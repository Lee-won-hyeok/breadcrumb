const express = require("express");
const app = express();
const multer = require("multer");
const fs = require("fs");
const http = require("http");
const https = require("https");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var db;
try {
  db = require("./db/db.js");
} catch (e) {
  console.log("create db.js");
  fs.writeFile(
    "./db/db.js",
    `var db = [
  {
    id: 1,
    date: "YYYY.MM.DD",
    location: "Seoul",
    src: "img.jpeg",
    title: "title",
    article: "article"
  }
];
module.exports = db;`,
    () => {
      db = require("./db/db.js");
      app.set("db", db);
    }
  );
}
var userdata;
try {
  userdata = require("./db/userdata.js");
} catch (e) {
  console.log("create userdata.js");
  fs.writeFile(
    "./db/userdata.js",
    `userdata = {
};
module.exports = userdata;`,
    () => {
      userdata = require("./db/userdata.js");
    }
  );
}

//load .env
require("dotenv").config();

const _PORT = process.env.PORT;
app.use(
  cors({
    origin: "https://" + process.env.IP + ":" + process.env.FE_PORT,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      secure: true,
    },
    //store:
  })
);
app.use(express.static("public"));

function getId(initial_value = 1) {
  if (getId.counter === undefined) {
    getId.counter = initial_value;
  }
  return getId.counter++;
}

//vertification
function signin(id, pwd) {
  if (!userdata.hasOwnProperty(id)) return false;
  const encryptedPwd = userdata[id].pwd;
  return new Promise((res, rej) => {
    bcrypt.compare(pwd, encryptedPwd, (err, same) => {
      if (err) {
        console.log(err);
        res(false);
      }
      res(same);
    });
  });
}

//accessToken veritification middleware
function vert(req, res, next) {
  const { accessToken } = req.cookies;
  if (!accessToken)
    return res.status(401).send({ message: "유효하지 않은 접근입니다." });
  try {
    const token = jwt.verify(accessToken, process.env.PRIVATE_KEY);
    if (userdata.hasOwnProperty(token.id)) {
      req.id = token.id;
      req.name = userdata[token.id].name;
      return next();
    }
    return res.status(401).send({ message: "유효하지 않은 접근입니다." });
  } catch (e) {
    console.log(e);
    return res.status(401).send({ message: "유효하지 않은 접근입니다." });
  }
}
// app.use(vert);

//access-token
app.post("/signin", async (req, res) => {
  const { id, pwd } = req.body;
  const vertify = await signin(id, pwd);
  if (vertify) {
    const accessToken = jwt.sign({ id }, process.env.PRIVATE_KEY);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      domain: process.env.IP,
    });
    res.cookie("id", id, {
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      domain: process.env.IP,
    });
    res.status(200).send({ message: "success" });
    return;
  } else {
    res.status(401).send({ message: "Not Valid" });
    return;
  }
});

//hasing + push db
app.post("/signup", (req, res) => {
  const { id, pwd, name, email, aut } = req.body;
  if (userdata.hasOwnProperty(id))
    return res.status(400).send({ message: "ID already in use" });
  bcrypt.hash(pwd, parseInt(process.env.SALT), (e, encryptedPwd) => {
    if (e) {
      console.log(e);
      res.status(500).send({ message: "error" });
    }
    userdata[id] = { pwd: encryptedPwd, name, email, aut };
    res.send({ message: "success" });
  });
});

//logout
app.get("/signout", vert, (req, res) => {
  res.cookie("accessToken", null, {
    httpOnly: true,
    secure: true,
    maxAge: 0,
  });
  res.status(200).send();
});

app.get("/:location", (req, res) => {
  const location = req.params.location;
  res.send(
    req.app
      .get("db")
      .filter((i) => i.location === location)
      .map((i) => ({
        id: i.id,
        src: i.src,
        date: i.date,
      }))
  );
});

app.get("/post/:id", (req, res) => {
  const post = req.app.get("db").find((i) => i.id === parseInt(req.params.id));
  if (!post) {
    res.status(400).send({ message: "Not Exist" });
    return;
  }
  res.json(post);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./db");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".png");
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024, fieldSize: 52428800 },
});

app.post("/post", upload.single("src"), function (req, res) {
  const post = Object.assign({}, req.body);
  const file = req.file;
  if (!post || !file) {
    res.status(400).send({ message: "Empty body data" });
    return;
  }
  post.src = file.filename;
  post.id = getId(8);
  var newdb = [...res.app.get("db")];
  newdb.push(post);
  req.app.set("db", newdb);
  res.json(post);
});

app.get("/db/:path", function (req, res) {
  res.sendFile(__dirname + "/db/" + req.params.path);
});

app.post("/post/:id", (req, res) => {
  const post = req.body;
  const id = parseInt(req.params.id);
  if (!post) {
    res.status(400).send({ message: "Empty request body" });
    return;
  }
  var newdb = [];
  req.app.get("db").forEach(function (i) {
    if (i.id === id) {
      newdb.push({ ...i, title: post.title, article: post.article });
    } else {
      newdb.push(i);
    }
  });
  req.app.set("db", newdb);
  res.status(200).send({ message: "success" });
});

app.delete("/post/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) {
    res.status(400).send({ message: "Empty ID" });
    return;
  }
  const newdb = req.app.get("db").filter((i) => i.id !== id);
  req.app.set("db", newdb);
  res.status(200).send({ message: "success" });
});

const credentials = {
  key: fs.readFileSync("./rootca.key"),
  cert: fs.readFileSync("./rootca.crt"),
  ca: fs.readFileSync("./rootca.csr"),
};

// app.get("/*", (req, res) => {
//   res.cookie("val", "qwerqwer");
//   res.send(req.cookies);
// });

app.post("/", vert, (req, res) => {
  res.json({ name: req.name });
});

// const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

// httpServer.listen(_PORT, () => {
//   console.log(`http port ${_PORT} listening`);
// });
httpsServer.listen(_PORT, () => {
  console.log(`https port ${_PORT} listening`);
});

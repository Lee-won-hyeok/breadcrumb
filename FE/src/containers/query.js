// import React, {useState, use} from "react";
import axios from "axios";
const _IP = process.env.REACT_APP_IP;
const _PORT = process.env.REACT_APP_BE_PORT;
const _URL = `https://${_IP}:${_PORT}`;

const _error_handlr = (e) => {
  e.response ? alert(e.response.data.message) : alert("CONNECTION ERROR!");
};

export async function tokenVertification(res_callback, rej_callback) {
  await axios
    .post(_URL, null, { withCredentials: true })
    .then((res) => res_callback(res.data.name))
    .catch(() => rej_callback());
}

export async function userSubmit(path, auth) {
  var ret;
  await axios
    .post(_URL + path, auth, {
      withCredentials: true,
    })
    .then((res) => {
      ret = true;
    })
    .catch(_error_handlr);
  return ret;
}

export async function signout(cb) {
  await axios
    .get(_URL + `/signout`, {
      withCredentials: true,
    })
    .then((res) => {
      cb();
    })
    .catch(_error_handlr);
}

export async function getPostList(location = undefined) {
  var ret = [];
  if (location) {
    await axios
      .get(_URL + `/${location}`)
      .then(function (res) {
        ret = [...res.data];
        ret.forEach((i) => {
          i.src = _URL + "/db/" + i.src;
        });
      })
      .catch(_error_handlr);
  }
  return ret;
}

//C
export async function createPost(data, src) {
  let post = new FormData();
  if (src) post.append("src", src, "img.png");
  Object.keys(data).forEach(
    (key) => post.append(key, data[key])
    //(key) => post.append(key, new Blob([data[key]], { type: "text/plain" }))
  );
  post.forEach((value, key) => console.log(key + ":" + value));

  var ret = {};
  await axios
    .post(_URL + `/post`, post, {
      headers: { "Content-Type": "multipart/form-data", charset: "utf-8" },
      timeout: 5000,
    })
    .then((res) => {
      ret = { ...res.data };
      ret.src = _URL + "/db/" + res.data.src;
    })
    .catch(_error_handlr);
  return ret;
}

//U
export async function updatePost(id, post) {
  await axios
    .post(_URL + `/post/${id}`, post)
    .then((res) => res.data)
    .catch(_error_handlr);
}

//R
export async function getPost(id) {
  if (!id) return;
  var ret = {};
  await axios
    .get(_URL + `/post/${id}`)
    .then(function (res) {
      ret = { ...res.data };
      ret.src = _URL + "/db/" + res.data.src;
    })
    .catch(_error_handlr);
  return ret;
}

//D
export async function deletePost(id) {
  await axios
    .delete(_URL + `/post/${id}`)
    .then((res) => console.log(res))
    .catch(_error_handlr);
}

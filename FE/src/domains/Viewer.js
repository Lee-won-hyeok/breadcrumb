import React, { useState, useEffect, useContext } from "react";
import Card from "../components/Card";
import Map from "../containers/Map";
import Masonry from "../components/Masonry";
import { useMediaQuery } from "react-responsive";
import Detail from "./Detail";
import useKakaomap from "../hooks/useKakaomap";
import { ContextAPI } from "../context/ContextAPI";
import { districtDB } from "../js/districtDB";
import FileUploadBtn from "../components/FileUploadBtn";

import {
  getPostList,
  getPost,
  updatePost,
  deletePost,
  createPost,
} from "../containers/query";

function gps(getcoords, callback) {
  if ("geolocation" in navigator) {
    const watchID = navigator.geolocation.watchPosition(
      (res) => {
        getcoords(res.coords.latitude, res.coords.longitude, callback);
        return watchID;
      },
      (e) => console.log(e.code, e.message),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  } else {
    alert("해당 브라우저를 지원하지 않습니다.");
  }
}

export default function Viewer() {
  const isDesktop = useMediaQuery({
    query: "(min-width:800px)",
  });
  const [cols, setCols] = useState(3);
  const [cardActive, setCardActive] = useState(false);
  const [location, setLocation] = useState(undefined);
  const [clientCoords, setClientCoords] = useState(null);
  const [cardDirection, setCardDirection] = useState({ y: true, x: true });
  const [detailidx, setDetailidx] = useState(false);
  const [posts, setPosts] = useState([]);
  const [detailpost, setDetailPost] = useState(undefined);
  const { searchAddrFromCoords: getcoords } = useKakaomap();
  const { setUserAddr } = useContext(ContextAPI);

  useEffect(() => {
    gps(getcoords, (res, stat) => {
      if (res[0]) {
        console.log(res);
        setUserAddr(() => districtDB[res[0].region_1depth_name]);
      }
    });
  }, []);
  useEffect(() => {
    if (isDesktop) setCols(4);
    else setCols(3);
  }, [isDesktop]);
  
  const onClick = async (e) => {
    setDetailidx(false);
    if (window.innerWidth / 2 < e.clientX)
      setCardDirection((v) => ({ ...v, x: true }));
    else setCardDirection((v) => ({ ...v, x: false }));
    if (window.innerHeight / 2 < e.clientY)
      setCardDirection((v) => ({ ...v, y: true }));
    else setCardDirection((v) => ({ ...v, y: false }));
    setClientCoords(() => ({
      x: e.clientX,
      y: e.clientY,
    }));
    
    if (e.target.dataset.name !== location) {
      setLocation(e.target.dataset.name);
      e.target.dataset.name && getPostList(e.target.dataset.name)
        .then((posts) => setPosts(posts))
        .catch((e) => alert(e));
    }
    if (!e.target.dataset.name) return setCardActive(() => false);
    if (!cardActive) {
      setCardActive((v) => !v);
    }
  };
  const validationCheck = (val) => {
    const fileType = val.type;
    if (!fileType.includes("image")) {
      alert(
        `해당 파일은 이미지 파일이 아닙니다.\n이미지(JPG,JPEG,GIF,PNG) 파일을 업로드 해주세요.`
      );
      return false;
    }
    return true;
  };
  const AddButtonOnClick = (e) => {
    if (e.target.files.length < 1) return;
    if (!validationCheck(e.target.files[0])) return;
    const data = {
      date: new Date().toISOString().slice(0, 10),
      location: location,
      title: "",
      article: "",
    };
    createPost(data, e.target.files[0])
      .then((res) => {
        const post = res;
        setDetailidx(post.id);
        setCardActive(false);
        setLocation(undefined);
        setDetailPost(post);
      })
      .catch((e) => alert(e));
  };
  const deleteButtonOnClick = () => {
    deletePost(detailidx)
      .then(() => {
        setDetailidx(false);
        setDetailPost(undefined);
      })
      .catch((e) => alert(e));
  };
  const updateButtonOnClick = (id, post) => {
    updatePost(id, post)
      .then(setDetailPost(post))
      .catch((e) => alert(e));
  };
  const photoCardOnClick = (e) => {
    const id = e.target.dataset.key;
    e.stopPropagation();
    setDetailidx(id);
    setCardActive(false);
    setLocation(undefined);
    getPost(id)
      .then((post) => setDetailPost(post))
      .catch((e) => alert(e));
  };
  const backButtonOnClick = (e) => {
    setDetailidx(false);
    setDetailPost(undefined);
  };

  return (
    <div className="Viewer">
      <div className="wrapper">
        <Map onClick={onClick}></Map>
        {cardActive && (
          <Card
            title={location}
            coords={clientCoords}
            dir={cardDirection}
            maxsize={{
              wid: isDesktop
                ? "unset"
                : cardDirection.x
                ? 0.9 * clientCoords.x + "px"
                : (window.innerWidth - clientCoords.x) * 0.9 + "px",
              hei: "40vh",
            }}
          >
            <Masonry
              items={posts}
              cols={cols < posts.length ? cols : posts.length + 1}
              onClick={(e) => photoCardOnClick(e)}
              direction={isDesktop}
            >
              <FileUploadBtn
                onClick={AddButtonOnClick}
                style={
                  posts.length === 0
                    ? {
                        width: isDesktop ? "20vw" : "100%",
                      }
                    : {}
                }
                accept="image/*"
              >
                <p>ADD</p>
              </FileUploadBtn>
            </Masonry>
          </Card>
        )}
        <Detail
          data={detailpost}
          activate={detailidx}
          backButtonOnClick={backButtonOnClick}
          deleteButtonOnClick={deleteButtonOnClick}
          updateButtonOnClick={updateButtonOnClick}
        ></Detail>
      </div>
    </div>
  );
}

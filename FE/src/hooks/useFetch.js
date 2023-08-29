// import React, {useState, use} from "react";
import axios from "axios";
const _IP = process.env.REACT_APP_BE_IP;
const _PORT = process.env.REACT_APP_BE_PORT;
const _URL = `https://${_IP}:${_PORT}`;
export async function getPostList(location = undefined) {
  if (location) {
    await axios
      .get(_URL + `/${location}`)
      .then((res) => {
        console.log("getPostList" + JSON.stringify(res.data));
        return ["qewr"];
      })
      .catch((e) => console.log(e));
  } else {
    await axios
      .get(_URL)
      .then((res) => res.data)
      .catch((e) => console.log(e));
  }
}

//C
export async function createPost(post) {
  await axios
    .post(_URL + `/post`, { ...post })
    .then((res) => res.data)
    .catch((e) => console.log(e));
}

//U

//R
export async function getPost(id) {
  if (!id) return;
  await axios
    .get(_URL + `/${id}`)
    .then((res) => {
      console.log("getpost" + res.data);
      return res.data;
    })
    .catch((e) => console.log(e));
}

//D
export async function deletePost(id) {
  await axios
    .delete(_URL + `/${id}`)
    .then((res) => console.log(res))
    .catch((e) => console.log(e));
}

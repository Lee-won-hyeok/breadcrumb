import React, { useState, useEffect } from "react";
import ActionButton from "../components/ActionButton";
import ExpandingTextArea from "../components/ExpandingTextArea";
import PopupView from "../components/PopupVIew";

export default function Detail({
  data,
  activate,
  backButtonOnClick,
  deleteButtonOnClick,
  updateButtonOnClick,
}) {
  const [article, setArticle] = useState();
  const [title, setTitle] = useState();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [backConfirm, setBackConfirm] = useState(false);
  useEffect(() => {
    setTitle(data && data.title);
    setArticle(data && data.article);
    // console.log("on");
    return () => {
      // console.log("off");
    };
  }, [data]);
  if (!data) return <div className="Detail"></div>;
  const { src, date } = data;
  const detailStyle = {
    left: { activate } && "0%",
  };
  const isChanged = function () {
    if (title === data.title && article === data.article) {
      return false;
    }
    return true;
  };

  return (
    <div className="Detail" style={detailStyle}>
      <div className="wrapper">
        <div className="title">
          <ExpandingTextArea
            value={title}
            setValue={setTitle}
            placeholder="제목을 입력하세요"
          />
        </div>
        <div className="body-pg">
          <ExpandingTextArea
            value={article}
            setValue={setArticle}
            placeholder="내용을 입력하세요"
          />
        </div>
        <h2 className="date">{date}</h2>
        <img src={src} alt="img" />
      </div>

      <ActionButton
        coords={{ x: "12%", y: `calc(20% + 10px)` }}
        size={{ x: "50px", y: "50px" }}
        onClick={() =>
          isChanged() ? setBackConfirm(true) : backButtonOnClick()
        }
        style={{ transform: "translateX(-100%)" }}
      >
        <span className="material-symbols-outlined">arrow_back_ios_new</span>
      </ActionButton>
      <ActionButton
        coords={{ x: "12%", y: `calc(20% + 70px)` }}
        size={{ x: "50px", y: "50px" }}
        onClick={() => setDeleteConfirm(true)}
        style={{ transform: "translateX(-100%)" }}
      >
        <span className="material-symbols-outlined">delete</span>
      </ActionButton>
      <ActionButton
        coords={{ x: "12%", y: `calc(20% + 130px)` }}
        size={{ x: "50px", y: "50px" }}
        onClick={() => updateButtonOnClick(data.id, { ...data, title, article })}
        style={{ transform: "translateX(-100%)" }}
      >
        <span className="material-symbols-outlined">save</span>
      </ActionButton>
      {deleteConfirm && (
        <PopupView>
          <h3>Delete Confirmation</h3>
          <p>
            Current post will be deleted permanantly. You cannot undo this
            action.
          </p>
          <div className="btns" onClick={() => setDeleteConfirm(false)}>
            <button className="cancel" type="text">
              CANCEL
            </button>
            <button
              className="delete"
              type="text"
              onClick={deleteButtonOnClick}
            >
              DELETE
            </button>
          </div>
        </PopupView>
      )}
      {backConfirm && (
        <PopupView>
          <h3>Leave page without saving?</h3>
          <p>All unsaved changes will be lost.</p>
          <div className="btns" onClick={() => setBackConfirm(false)}>
            <button className="cancel" type="text">
              No
            </button>
            <button className="delete" type="text" onClick={backButtonOnClick}>
              Yes
            </button>
          </div>
        </PopupView>
      )}
    </div>
  );
}

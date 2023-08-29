import React, { useRef, useContext } from "react";
import { ContextAPI } from "../context/ContextAPI";
import Dropdown from "../components/Dropdown";
import { signout } from "./query";

function dataformatter(dt) {
  const year = dt.getFullYear();
  const month = dt.getMonth() + 1;
  const date = dt.getDate();
  return `${year}-${month >= 10 ? month : "0" + month}-${
    date >= 10 ? date : "0" + date
  }`;
}

export default function Nav({ setAuth }) {
  const { username, userAddr } = useContext(ContextAPI);
  const d = dataformatter(new Date());
  const dropDownTriggerRef = useRef();
  const logout = (e) => {
    e.preventDefault();
    signout(() => {
      setAuth(() => false);
      alert("logout");
    });
  };
  return (
    <div className="Nav">
      <div className="date">
        <p>{d}</p>
      </div>
      <div className="location">
        <p>{userAddr}</p>
      </div>
      <div className="username">
        <Dropdown
          triggerRef={dropDownTriggerRef}
          dropdownLength="70px"
          left={true}
        >
          <a href="/" ref={dropDownTriggerRef}>
            {username}
          </a>
          <a className="items" href="/">
            Profile
          </a>
          <a className="items" href="/" onClick={logout}>
            logout
          </a>
        </Dropdown>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { userSubmit } from "../containers/query";
// import { useDispatch } from "react-redux";
import cookie from "react-cookies";

export default function LoginView({ setAuth }) {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [viewState, setViewState] = useState(0);

  useEffect(() => {
    initialize();
    if (viewState === 0 && cookie.load("id")) setId(cookie.load("id"));
  }, [viewState]);

  const initialize = () => {
    setId("");
    setPwd("");
    setConfirmPwd("");
    setName("");
    setEmail("");
  };
  const _setViewState = (e, state) => {
    e.preventDefault();
    setViewState(state);
  };
  const isValid = (id, pwd) => {
    if (id.length < 6 || pwd.length < 8) return false;
    return true;
  };
  const onsubmit_signin = async (e) => {
    e.preventDefault();
    if (!isValid(id, pwd)) {
      alert("유효하지 않은 형식입니다.");
      return initialize();
    }
    if (await userSubmit("/signin", { id, pwd })) {
      // TODO: useDispatch() redux 글로벌 전역변수 설정해주기
      return setAuth(true);
    }
    return initialize();
  };
  const onsubmit_signup = async (e) => {
    e.preventDefault();
    if (pwd !== confirmPwd) return alert("비밀번호가 일치하지 않습니다.");
    if (!isValid(id, pwd)) {
      alert("유효하지 않은 형식입니다.");
      return;
    }
    if (await userSubmit("/signup", { id, pwd, name, email })) {
      alert("등록되었습니다.");
      initialize();
      setViewState(0);
    }
    return;
  };

  return (
    <div className="LoginView">
      {viewState === 0 && (
        <div className="wrapper">
          <h2>Sign In</h2>
          <p>Welcome!</p>
          <form
            action="/login"
            method=""
            name="login"
            onSubmit={onsubmit_signin}
          >
            <label htmlFor="login-ID">ID</label>
            <div className="input-with-icon top">
              <div className="icon-wrapper">
                <span className="material-symbols-outlined">person</span>
              </div>
              <input
                id="login-ID"
                name="ID"
                type="text"
                placeholder="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              ></input>
            </div>
            <label htmlFor="login-pwd">password</label>
            <div className="input-with-icon bottom">
              <div className="icon-wrapper">
                <span className="material-symbols-outlined">key</span>
              </div>
              <input
                id="login-pwd"
                name="password"
                type="password"
                placeholder="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
              ></input>
            </div>
            <a href="/">Forgot Password?</a>
            <button type="submit">SUBMIT</button>
          </form>
          <a href="/" onClick={(e) => _setViewState(e, 1)}>
            Sign Up
          </a>
        </div>
      )}
      {viewState === 1 && (
        <div className="wrapper">
          <h2>Sign Up</h2>
          <p>Welcome!</p>
          <form
            action="/signup"
            method=""
            name="login"
            onSubmit={onsubmit_signup}
          >
            <label htmlFor="signup-ID">ID</label>
            <div className="input-with-icon top">
              <div className="icon-wrapper">
                <span className="material-symbols-outlined">person</span>
              </div>
              <input
                id="signup-ID"
                name="ID"
                type="text"
                placeholder="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              ></input>
            </div>
            <label htmlFor="signup-pwd">password</label>
            <div className="input-with-icon middle">
              <div className="icon-wrapper">
                <span className="material-symbols-outlined">key</span>
              </div>
              <input
                id="signup-pwd"
                name="password"
                type="password"
                placeholder="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
              ></input>
            </div>
            <label htmlFor="signin-confirm-pwd">confirm-password</label>
            <div className="input-with-icon middle">
              <input
                id="signin-confirm-pwd"
                name="confirm-password"
                type="password"
                placeholder="confirm-password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                required
              ></input>
            </div>
            <label htmlFor="signup-name">name</label>
            <div className="input-with-icon middle">
              <input
                id="signup-name"
                name="name"
                type="text"
                placeholder="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              ></input>
            </div>
            <label htmlFor="signup-email">name</label>
            <div className="input-with-icon bottom">
              <input
                id="signup-email"
                name="email"
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              ></input>
            </div>
            <button type="submit">SUBMIT</button>
          </form>
          <a href="/" onClick={(e) => _setViewState(e, 0)}>
            Sign In
          </a>
        </div>
      )}
    </div>
  );
}

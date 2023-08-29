import "./App.scss";
import Viewer from "./domains/Viewer";
import Nav from "./containers/Nav";
import LoginView from "./domains/LoginView";
import React, { useState, useEffect } from "react";
import { ContextAPI } from "./context/ContextAPI";

import { tokenVertification } from "./containers/query";
import useHOC from "./hooks/useHOC";
import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import viewerReducer from "./containers/viewerReducer";
import detailReducer from "./containers/detailReducer";

function App() {
  const [username, setUsername] = useState("");
  const [userAddr, setUserAddr] = useState("");
  const [privateComponent, authorizingComponent, auth, setAuth] = useHOC(
    "/login",
    "/"
  );

  //const ls = window.localStorage;
  //ls.setItem("key", val);
  //ls.getItem("key");
  //ls.removeItem("key");
  useEffect(() => {
    tokenVertification(
      (username) => {
        setAuth(() => true);
        setUsername(username);
      },
      () => {
        setAuth(() => false);
        setUsername("");
      }
    );
  }, [auth, setAuth]);

  let store = configureStore({
    reducer: {
      postlist: viewerReducer,
      currpost: detailReducer,
    },
  });

  // useEffect 두번 호출(두번 로드되는 현상 발생)
  // const HomeView = () => (
  //   <>
  //     <Nav />
  //     <Viewer />
  //   </>
  // );

  return (
    <div className="App">
      <Provider store={store}>
        <ContextAPI.Provider
          value={{ username, setUsername, userAddr, setUserAddr }}
        >
          <Routes>
            <Route path="/*" element={privateComponent()}></Route>
            <Route
              path="/"
              element={privateComponent(
                <>
                  <Nav setAuth={setAuth} />
                  <Viewer />
                </>
              )}
            ></Route>
            <Route
              path="/login"
              element={authorizingComponent(<LoginView setAuth={setAuth} />)}
            />
          </Routes>
        </ContextAPI.Provider>
      </Provider>
    </div>
  );
}

export default App;

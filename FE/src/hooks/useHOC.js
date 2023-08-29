import { useState } from "react";
import { Navigate } from "react-router-dom";

//notAuthURL: auth가 false일 때 redirect되는 경로
//baseURL: auth가 true일 때 redirect되는 경로

export default function useHOC(notAuthURL, baseURL, initial_auth = false) {
  const [auth, setAuth] = useState(initial_auth);

  //privateComponent: 인증이 필요한 모든 컴포넌트에 사용
  //el: 인증되었을 때 띄워줄 컴포넌트
  const privateComponent = (el) => {
    return auth ? (
      el || <Navigate to={baseURL} replace={true} />
    ) : (
      <Navigate to={notAuthURL} replace={true} />
    );
  };

  //authorizingComponent: notAuthURL에 라우팅되는 컴포넌트에 사용
  //el: 인증이 필요할 때 띄워줄 컴포넌트
  const authorizingComponent = (el) => {
    return auth ? <Navigate to={baseURL} replace={true} /> : el;
  };

  return [privateComponent, authorizingComponent, auth, setAuth];
}

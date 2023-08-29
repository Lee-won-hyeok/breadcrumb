import React, { useRef, useEffect } from "react";
const { kakao } = window;

export default function useJSX() {
  // const jsxRef = useRef(<div id="maps" className="kakaomap"></div>);
  const jsxRef = useRef();
  const map =
    jsxRef.current &&
    new kakao.maps.Map(jsxRef.current, {
      center: new kakao.maps.LatLng(36.50701, 128.570667),
      level: 3,
    });
  console.log(jsxRef.current);
  //jsx !== html
  //return <div id="maps" className="kakaomap" ref={jsxRef}></div>;
  return jsxRef.current;
}

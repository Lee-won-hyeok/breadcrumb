import React from "react";

export default function Lazyimg({ src, alt, style }) {
  return (
    <>
      <img src="" alt={alt} data-src={src} style={style}></img>
    </>
  );
}

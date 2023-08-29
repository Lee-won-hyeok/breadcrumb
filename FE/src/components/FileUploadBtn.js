import React, { useRef } from "react";

export default function FileUploadBtn({ children, onClick, accept, style }) {
  const inputRef = useRef();
  const uploadOnClick = () => {
    inputRef.current.click();
  };
  return (
    <div className="FileUploadBtn" onClick={uploadOnClick} style={style}>
      {children}
      <input
        ref={inputRef}
        type="file"
        name="src"
        accept={accept}
        style={{ display: "none" }}
        onChange={onClick}
      />
    </div>
  );
}

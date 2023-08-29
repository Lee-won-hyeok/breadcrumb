import React from "react";

export default function ActionButton({
  coords,
  size,
  onClick,
  style,
  children,
}) {
  const wrapperStyle = {
    ...style,
    position: "absolute",
    left: coords.x,
    top: coords.y,
    width: size.x,
    height: size.y,
  };
  const buttonStyle = {
    width: "100%",
    height: "100%",
    padding: 0,
    margin: 0,
    border: 0,
    borderRadius: "20%",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  return (
    <div className="ActionButton" style={wrapperStyle} onClick={onClick}>
      <button type="button" style={buttonStyle}>
        {children}
      </button>
    </div>
  );
}

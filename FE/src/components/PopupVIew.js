import React from "react";

export default function PopupView({ style, children }) {
  const containerStyle = {
    ...style,
    position: "fixed",
    zIndex: "1000",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.24)",
  };
  return (
    <div className="PopupView" style={containerStyle}>
      {children}
    </div>
  );
}

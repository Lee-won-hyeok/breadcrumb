import React from "react";

export default function Card({ title, children, coords, dir, maxsize }) {
  const { x, y } = dir;
  const { wid, hei } = maxsize;

  //dir props 받지 않고 card가 나오는 위치 구현하기 //
  //card 위치가 지도를 가리지 않도록 재배칠 할 방안 고민//

  const cardStyle = {
    left: coords.x + "px",
    top: coords.y + "px",
    transform:
      (x ? "translateX(-100%)" : "translateX(0)") +
      " " +
      (y ? "translateY(-100%)" : "translateY(0)"),
  };
  const wrapperStyle = {
    overflowX: "auto",
    overflowY: "auto",
    maxWidth: wid,
    maxHeight: hei,
  };
  return (
    <div className="Card" style={cardStyle}>
      <h2 className="Title">{title}</h2>
      <div className="wrapper" style={wrapperStyle}>
        {children}
      </div>
    </div>
  );
}

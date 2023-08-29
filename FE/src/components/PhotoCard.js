import React from "react";

const PhotoCard = function ({ width, onClick, src, desc }) {
  return (
    <div className="PhotoCard" onClick={onClick}>
      <div className="overlay">
        {desc && <p className="description"> {desc} </p>}
      </div>
      <img src={src} alt="photocard" style={{ width: width, height: "100%" }} />
    </div>
  );
};

export default React.memo(PhotoCard);

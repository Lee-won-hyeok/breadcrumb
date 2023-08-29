import React from "react";

export default function Masonry({ direction, cols, items, onClick, children }) {
  // if (items.length < cols)
  //   throw console.error(
  //     "Masonry.props.cols is smaller than Masonry.props.items.length"
  //   );
  const colWrapper = [];
  for (let i = 0; i < cols; i++) colWrapper.push([]);
  for (let i = 0; i < items.length; i++) {
    colWrapper[(i + 1) % cols].push(items[i]);
  }
  const MasonryStyle = {
    display: "flex",
    gap: "0.5vw",
    flexDirection: direction ? "row" : "column",
  };
  const WrapperStyle = {
    display: "flex",
    flexDirection: direction ? "column" : "row",
    gap: "0.5vw",
  };
  const PhotoCardStyle = {
    width: direction ? "10vw" : "auto",
    height: direction ? "auto" : "10vh",
  };
  return (
    <div className="Masonry" style={MasonryStyle}>
      {colWrapper.map((cols, col) => {
        return (
          <div key={col} className="column" style={WrapperStyle}>
            {col === 0 && children}
            {cols.map((item, idx) => {
              return (
                <div className="PhotoCard" key={idx}>
                  <div
                    className="overlay"
                    data-key={item.id}
                    onClick={(e) => onClick(e)}
                  >
                    {item.date && <p className="description"> {item.date} </p>}
                  </div>
                  <img src={item.src} alt="photocard" style={PhotoCardStyle} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

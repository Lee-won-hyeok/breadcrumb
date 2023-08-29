import React, { useEffect, useState, useRef } from "react";

export default function Dropdown({
  triggerRef,
  dropdownLength,
  left,
  children,
}) {
  const [activate, setActive] = useState(false);
  const dropdownRef = useRef();
  var _children = [...children];

  useEffect(() => {
    const clickEventHandlr = (e) => {
      if (activate && !dropdownRef.current.contains(e.target)) setActive(false);
    };
    if (activate) {
      window.addEventListener("click", clickEventHandlr);
    }
    return () => window.removeEventListener("click", clickEventHandlr);
  }, [activate]);

  useEffect(() => {
    const triggerHandlr = (e) => {
      e.preventDefault();
      setActive((s) => !s);
    };
    triggerRef && triggerRef.current.addEventListener("click", triggerHandlr);
  }, [triggerRef]);

  return (
    <div
      className="Dropdown"
      ref={dropdownRef}
      style={{ position: "relative" }}
    >
      {_children.shift()}
      <div
        className={`dropper ${left ? "right" : "left"}`}
        style={{ maxHeight: activate ? dropdownLength : "0px" }}
      >
        {_children}
      </div>
    </div>
  );
}

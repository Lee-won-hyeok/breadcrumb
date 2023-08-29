import React, { useRef, useEffect } from "react";

export default function ExpandingTextArea({
  value,
  setValue,
  placeholder,
  style,
}) {
  const textareaRef = useRef();
  useEffect(() => {
    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, [value]);
  const onChange = (e) => {
    setValue(e.target.value);
    textareaRef.current.style.height = "0px";
    e.target.style.height = e.target.scrollHeight + "px";
  };
  return (
    <div className="ExpandingTextArea">
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        ref={textareaRef}
        style={style}
      />
    </div>
  );
}

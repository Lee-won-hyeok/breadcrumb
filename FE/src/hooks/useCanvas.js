import { useEffect, useRef } from "react";

export default function useCanvas(setCanvas) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas && setCanvas(canvas);
  }, [setCanvas]);

  return canvasRef;
}

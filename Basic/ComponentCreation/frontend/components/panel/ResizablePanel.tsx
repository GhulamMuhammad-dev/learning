"use client";
import { useState, useRef, useEffect, ReactNode } from "react";

interface ResizablePanelProps {
  children: ReactNode;
  height?: string; // Tailwind height like "h-64"
  side?: "left" | "right"; // which side of the screen to stick to
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
}

export default function ResizablePanel({
  children,
  height = "h-screen",
  side = "left",
  minWidth = 280,
  maxWidth = 600,
  defaultWidth = 280,
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [resizing, setResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const liveWidth = useRef(width);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    setResizing(true);
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    let newWidth = width;

    if (side === "left") {
      newWidth = e.clientX - rect.left;
    } else {
      newWidth = rect.right - e.clientX;
    }

    if (newWidth > minWidth && newWidth < maxWidth) {
      liveWidth.current = newWidth;
      panelRef.current.style.width = `${newWidth}px`;
    }
  };

  const onMouseUp = () => {
    if (isResizing.current) {
      setWidth(liveWidth.current);
    }
    isResizing.current = false;
    setResizing(false);
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [side, width]);

  return (
    <div
      ref={panelRef}
      className={`${height} border border-gray-200 rounded-xl shadow-lg bg-gray-800 relative overflow-hidden`}
      style={{
        width,
        position: "absolute",
        top: 0,
        left: side === "left" ? 0 : "auto",
        right: side === "right" ? 0 : "auto",
      }}
    >
      {/* Content */}
      <div
        className={`w-full h-full overflow-y-auto p-3 scrollbar-custom ${
          resizing ? "pointer-events-none" : ""
        }`}
      >
        {children}
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={onMouseDown}
        className={`absolute top-0 ${
          side === "left" ? "right-0" : "left-0"
        } w-2 h-full cursor-ew-resize hover:bg-gray-600/30`}
      />
    </div>
  );
}

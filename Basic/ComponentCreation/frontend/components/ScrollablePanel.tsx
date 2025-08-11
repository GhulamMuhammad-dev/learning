"use client";
import { useState, useRef, useEffect } from "react";

interface ScrollablePanelProps {
  items: string[];
  height?: string; // Tailwind height like "h-64"
  side?: "left" | "right"; // which side of the screen to stick to
}

export default function ScrollablePanel({
  items,
  height = "h-screen",
  side = "left",
}: ScrollablePanelProps) {
  const [width, setWidth] = useState(280); // committed width after resize
  const [resizing, setResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const liveWidth = useRef(width); // track width without re-render

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
      // Resize from the right edge
      newWidth = e.clientX - rect.left;
    } else {
      // side === "right" → resize from the left edge
      newWidth = rect.right - e.clientX;
    }

    if (newWidth > 280 && newWidth < 600) {
      liveWidth.current = newWidth;
      panelRef.current.style.width = `${newWidth}px`; // update directly
    }
  };

  const onMouseUp = () => {
    if (isResizing.current) {
      setWidth(liveWidth.current); // commit final width
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
      {/* Scrollable content */}
      <div
        className={`w-full h-full overflow-y-auto p-3 scrollbar-custom ${
          resizing ? "pointer-events-none" : ""
        }`}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="p-3 mb-2 bg-gradient-to-r from-blue-700 to-blue-700/30 rounded-lg shadow-sm hover:border-2 hover:border-amber-50 transition-all"
          >
            {item}
          </div>
          
        ))}
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

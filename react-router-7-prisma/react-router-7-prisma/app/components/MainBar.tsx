import React from "react";

type MainBarProps = {
  height?: number | string; // e.g., 150 or "150px"
  className?: string;
  children?: React.ReactNode;
};

export default function MainBar({ height = 150, className = "", children }: MainBarProps) {
  const h = typeof height === "number" ? `${height}px` : height;
  return (
    <div
      className={`fixed left-0 right-0 top-0 bg-[#D9D9D9] flex items-center justify-center z-20 ${className}`}
      style={{ height: h }}
    >
      {children}
    </div>
  );
}

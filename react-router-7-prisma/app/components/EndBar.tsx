import React from "react";

type EndBarProps = {
  height?: number | string;
  className?: string;
  children?: React.ReactNode;
};

export default function EndBar({ height = 50, className = "", children }: EndBarProps) {
  const h = typeof height === "number" ? `${height}px` : height;
  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-[#444444] z-10 ${className}`}
      style={{ height: h }}
    >
      {children}
    </div>
  );
}

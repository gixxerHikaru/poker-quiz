import React from "react";

type MainBarProps = {
  height?: number | string;
  className?: string;
  children?: React.ReactNode;
};

export default function MainBar({
  height = 80,
  className = "",
  children,
}: MainBarProps) {
  return (
    <div className="fixed left-0 right-0 top-0 h-[60px] bg-[#D9D9D9] flex items-center justify-center z-20">
      <h1 className="font-bold text-[32px] md:text-[36px] leading-[1.1] text-black">
        47都道府県旅行記録
      </h1>
    </div>
  );
}

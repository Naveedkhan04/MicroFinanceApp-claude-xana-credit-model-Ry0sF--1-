import React from "react";

export const StatusBar: React.FC = () => (
  <div className="relative z-10 flex h-9 items-center justify-between px-4 pt-2 text-white">
    <div className="flex items-center gap-1 rounded-full bg-neutral-900/90 px-2.5 py-1">
      <span className="h-2 w-2 rounded-full border border-white" />
      <span className="h-2 w-2 rounded-full border border-white" />
    </div>
    <div className="flex items-center gap-1.5">
      <svg viewBox="0 0 18 12" className="h-3 w-5 fill-white">
        <rect x="0" y="8" width="3" height="4" rx="0.5" />
        <rect x="5" y="5" width="3" height="7" rx="0.5" />
        <rect x="10" y="2" width="3" height="10" rx="0.5" />
        <rect x="15" y="0" width="3" height="12" rx="0.5" opacity="0.5" />
      </svg>
      <svg viewBox="0 0 16 12" className="h-3 w-4 fill-white">
        <path d="M8 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-4a4 4 0 013.5 2L10 9.5a2 2 0 00-4 0L4.5 8.5A4 4 0 018 6.5zm0-4a8 8 0 017 4L13.5 8a6 6 0 00-11 0L1 6.5A8 8 0 018 2.5z" />
      </svg>
      <div className="relative ml-0.5 h-3 w-6 rounded-[2px] border border-white px-[1px] pt-[1px]">
        <div className="h-full w-[30%] rounded-[1px] bg-white" />
        <span className="absolute -right-[3px] top-[3px] h-1 w-[2px] rounded-r bg-white" />
      </div>
    </div>
  </div>
);

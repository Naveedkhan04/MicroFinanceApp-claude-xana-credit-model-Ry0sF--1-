import React from "react";

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const HomeIcon = () => (
  <Svg>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
  </Svg>
);

export const BorrowIcon = () => (
  <Svg>
    <path d="M12 3v18" />
    <path d="M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </Svg>
);

export const RepayIcon = () => (
  <Svg>
    <path d="M21 12a9 9 0 1 1-3.5-7.1" />
    <path d="M21 4v5h-5" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const HistoryIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </Svg>
);

export const ProfileIcon = () => (
  <Svg>
    <circle cx="12" cy="8" r="3.8" />
    <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
  </Svg>
);

export const SwapIcon = () => (
  <Svg>
    <path d="M7 4v16" />
    <path d="m3 8 4-4 4 4" />
    <path d="M17 20V4" />
    <path d="m21 16-4 4-4-4" />
  </Svg>
);

export const EarnIcon = () => (
  <Svg>
    <path d="M3 17 9 11l4 4 8-8" />
    <path d="M14 7h7v7" />
  </Svg>
);

export const PortfolioIcon = () => (
  <Svg>
    <path d="M4 7h16v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M4 12h16" />
  </Svg>
);

export const WalletIcon = () => (
  <Svg>
    <path d="M3 7a2 2 0 0 1 2-2h12v4" />
    <path d="M3 7v12a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-3" />
    <path d="M21 11H17a2 2 0 1 0 0 4h4z" />
  </Svg>
);

export const DepositIcon = () => (
  <Svg>
    <path d="M12 4v11" />
    <path d="m7 10 5 5 5-5" />
    <path d="M4 20h16" />
  </Svg>
);

export const WithdrawIcon = () => (
  <Svg>
    <path d="M12 20V9" />
    <path d="m7 14 5-5 5 5" />
    <path d="M4 4h16" />
  </Svg>
);

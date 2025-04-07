// components/LayoutClient.tsx
'use client';

import { useState } from "react";

import Marquee from "./Marquee";
import Header from "./Header";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [footerState, setFooterState] = useState({
    activeSection: 'home'
  });

  return (
    <div className="layoutClientWrapper">
      <Header setFooterState={setFooterState} />
      {children}
      <Marquee footerState={footerState} />
    </div>
  );
}
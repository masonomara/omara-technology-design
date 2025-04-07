// components/LayoutClient.tsx
'use client';

import Marquee from "./Marquee";
import Header from "./Header";
import { MenuProvider } from "../context/MenuContext";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <MenuProvider>
      <div className="layoutClientWrapper">
        <Header />
        {children}
        <Marquee />
      </div>
    </MenuProvider>
  );
}
"use client";

import Link from "next/link";

import { LuLamp } from "react-icons/lu";

import { TypographyH1 } from "@/components/ui/typography";

function Layout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <>
      <header className="h-[10vh] py-4">
        <Link href="/">
          <TypographyH1 className="hover:bg-black hover:text-background inline p-4">
            US-Lamp <LuLamp className="inline" size={32} />
          </TypographyH1>
        </Link>
      </header>
      <main className="max-w-[500px] mx-auto min-h-[90vh] flex flex-col justify-between p-8 pb-16 gap-12">
        {children}
      </main>
    </>
  );
}

export default Layout;

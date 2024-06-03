"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

import { TypographyH1, TypographyP } from "@/components/ui/typography";
import Throbber from "@/components/ui/throbber";

import readLampCodes from "@/lib/readLampCodes";

function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    readLampCodes().then((lampCodes) => {
      if (lampCodes.length > 0) {
        router.push("/lamp/list");
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) return <Throbber />;

  return (
    <>
      <div>
        <TypographyH1>Your lamps</TypographyH1>
        <TypographyP>Oops, looks like you have no saved lamps.</TypographyP>
      </div>
      <div>
        <Image
          alt="Distracting cat meme, can you fint the cat?"
          className="m-auto"
          src="/Bait.jpeg"
          width="300"
          height="300"
        />
        <TypographyP>
          We can&apos;t find your lamps. You can add them below or read{" "}
          <Link href="/about" className={buttonVariants({ variant: "link" })}>
            about page
          </Link>
          .
        </TypographyP>
      </div>
      <div className="flex flex-col gap-4">
        <Link
          href="/lamp/add"
          className={buttonVariants({ variant: "default" })}
        >
          Add an already connected lamp
        </Link>
        <Link
          href="/lamp/connect"
          className={buttonVariants({ variant: "default" })}
        >
          Connect new lamp
        </Link>
      </div>
    </>
  );
}

export default Index;

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { Slider } from "@/components/ui/slider";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyP,
} from "@/components/ui/typography";
import { FaThermometerHalf } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { MdBrightness7 } from "react-icons/md";
import { TbUfo, TbUfoOff } from "react-icons/tb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Throbber from "@/components/ui/throbber";
import { buttonVariants } from "@/components/ui/button";

import readLampCodes from "@/lib/readLampCodes";
import removeLampCode from "@/lib/removeLampCode";

function LampList() {
  const [loading, setLoading] = useState(true);

  const [lampCodes, setLampCodes] = useState<string[]>([]);
  const [connectedLamps, setConnectedLamps] = useState<string[]>([]);

  //read saved lamp codes on initial load
  useEffect(() => {
    const connectedLampsBuffer: string[] = [];
    readLampCodes().then(async (lampCodes) => {
      //remove lamp codes that do not exist on server
      for (const lampCode of lampCodes) {
        const res = await fetch(
          process.env.API_URL + `/verify?lampCode=${lampCode}`,
          {
            method: "GET",
          }
        );
        const lamp = await res.json();
        if (lamp.isConnected) connectedLampsBuffer.push(lampCode);
        if (!lamp.exists) removeLampCode(lampCode);
      }

      readLampCodes().then((lampCodes) => {
        setLampCodes(lampCodes);
        setConnectedLamps(connectedLampsBuffer);
        setLoading(false);
      });
    });
  }, [setLampCodes]);

  async function handleRemoveLamp(event: React.FormEvent, lampCode: string) {
    event.preventDefault();

    setLampCodes(lampCodes.filter((code) => code !== lampCode));
    setConnectedLamps(connectedLamps.filter((code) => code !== lampCode));

    await removeLampCode(lampCode);
  }

  if (loading) return <Throbber />;

  return (
    <div className="flex flex-col gap-8">
      <TypographyH2>Saved lamps:</TypographyH2>
      <div className="flex flex-col gap-6">
        {lampCodes.map((lampCode) => (
          <Link href={`/lamp/${lampCode}`} key={lampCode as string}>
            <Alert className="hover:bg-primary hover:text-background flex gap-3 justify-between">
              <div className="flex flex-col gap-1 items-center justify-between">
                <MdBrightness7 size={20} />
                {connectedLamps.includes(lampCode) ? (
                  <div className="w-3 h-3 rounded-full bg-online"></div>
                ) : (
                  <div className="w-3 h-3 rounded-full bg-offline"></div>
                )}
              </div>
              <div>
                <AlertTitle>{lampCode}</AlertTitle>
                <AlertDescription>Click to manage this lamp</AlertDescription>
              </div>
              <div>
                <FaTrash
                  onClick={(e) => handleRemoveLamp(e, lampCode)}
                  className="hover:text-offline"
                  size={15}
                />
              </div>
            </Alert>
          </Link>
        ))}
      </div>
      <div className="grow-1"></div>
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
    </div>
  );
}

export default LampList;

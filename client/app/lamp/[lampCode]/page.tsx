"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Slider } from "@/components/ui/slider";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyP,
} from "@/components/ui/typography";
import { FaThermometerHalf } from "react-icons/fa";
import { MdBrightness7 } from "react-icons/md";
import { TbUfo, TbUfoOff } from "react-icons/tb";
import { MdModeEdit } from "react-icons/md";
import Throbber from "@/components/ui/throbber";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import socket from "@/lib/socket";
import readLampCodes from "@/lib/readLampCodes";
import saveLampCode from "@/lib/saveLampCode";
import copyToClipboard from "@/lib/copyToClipboard";
import getLampNameBrowser from "@/lib/getLampName";
import setLampNameBrowser from "@/lib/setLampName";

function LampConf() {
  const { lampCode }: { lampCode: string } = useParams();

  const [loading, setLoading] = useState(true);
  const [lampConnected, setLampConnected] = useState(false);
  const [lampName, setLampName] = useState(lampCode);
  const [feedback, setFeedback] = useState("");

  const [brightness, setBrightness] = useState(100);
  const [temperature, setTemperature] = useState(100);
  const [motion, setMotion] = useState(true);

  const [angle, setAngle] = useState(0);
  const [power, setPower] = useState(0);

  const [showChangeName, setShowChangeName] = useState(false);
  const [lampNameInput, setLampNameInput] = useState(lampCode);

  useEffect(() => {
    readLampCodes().then((lampCodes) => {
      if (!lampCodes.includes(lampCode as string)) {
        saveLampCode(lampCode as string);
      }
      setLampName(getLampNameBrowser(lampCode));
      setLampNameInput(getLampNameBrowser(lampCode));
    });
  }, [lampCode]);

  useEffect(() => {
    socket.on("brightness", (value: string | number) => {
      setBrightness(Math.round((+value * 100) / 1024));
    });
    socket.on("temperature", (value: string | number) => {
      setTemperature(Math.round(+value * 100) / 100);
    });
    socket.on("motion", (value: string | number) => {
      setMotion(+value === 1);
    });
    socket.on("angle", (value: string | number) => {
      setAngle(Math.round(180 - +value));
    });
    socket.on("power", (value: string | number) => {
      setPower(Math.round(+value / 2.55));
    });
    socket.on("addconnection", (value: string | number) => {
      setLoading(false);
      value = +value;
      if (value === 1) {
        setLampConnected(true);
      } else {
        setLampConnected(false);
      }
    });

    socket.emit("addconnection", lampCode);

    return () => {
      socket.off("brightness");
      socket.off("temperature");
      socket.off("motion");
      socket.off("angle");
      socket.off("power");
    };
  }, [lampCode, setBrightness, setTemperature, setMotion, setAngle, setPower]);

  function handleCopyCode() {
    try {
      copyToClipboard(lampCode);
      setFeedback("Code copied to clipboard");
    } catch (error) {
      setFeedback("Failed to copy code to clipboard");
    } finally {
      setTimeout(() => {
        setFeedback("");
      }, 2000);
    }
  }

  function setName() {
    setShowChangeName(false);
    setLampNameBrowser(lampCode, lampNameInput);
    setLampName(lampNameInput);
  }

  if (loading) return <Throbber />;

  if (!lampConnected) {
    return (
      <>
        <TypographyH1>{lampName}</TypographyH1>
        <TypographyP>
          Lamp is not connected. Website should refresh automatically when lamp
          is connected. If it doesn&apos;t, please refresh the page.
        </TypographyP>
        <TypographyP>
          If you need help, please visit the
          <Link href="/about" className={buttonVariants({ variant: "link" })}>
            about page
          </Link>
          .
        </TypographyP>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {showChangeName ? (
            <div className="flex">
              <Input
                value={lampNameInput}
                onChange={(e) => setLampNameInput(e.target.value)}
              />
              <Button onClick={setName} className="w-22">
                Set name
              </Button>
            </div>
          ) : (
            <div
              className="cursor-pointer"
              onClick={() => setShowChangeName(true)}
            >
              <TypographyH3>
                {lampName}
                {lampName.length >= 36 && <MdModeEdit size={20} />}
              </TypographyH3>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleCopyCode} className="w-22">
              Copy lamp code
            </Button>
          </div>
          <TypographyP>{feedback}</TypographyP>
        </div>

        <div className="grid grid-cols-2 justify-items-center justify-center p-4 gap-4">
          <div className="w-36 h-36 bg-foreground flex items-center justify-center text-background gap-1">
            <MdBrightness7 size={32} />
            {brightness}%
          </div>
          <div className="w-36 h-36 bg-foreground flex items-center justify-center text-background gap-1">
            <FaThermometerHalf size={32} />
            {temperature}°C
          </div>
          <div className="w-36 h-36 bg-foreground flex items-center justify-center text-background gap-1">
            {motion ? (
              <>
                <TbUfo size={32} /> detected
              </>
            ) : (
              <>
                <TbUfoOff size={32} />
                not detected
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Image
          width="100"
          height="100"
          src="/MotionIcon.gif"
          alt="Motion detected, moving object"
          className="animate-move"
          unoptimized
          style={{ visibility: motion ? "visible" : "hidden" }}
        />
        <Image
          style={{
            rotate: `${(angle - 90) / 3}deg`,
            opacity: Math.max(power / 100, 0.1),
          }}
          className={`rotate-[${angle}deg]`}
          width="100"
          height="100"
          src="/LampIcon.png"
          alt="Lamp icon"
        />
      </div>
      <div className="flex flex-col gap-10">
        <div>
          <TypographyH3>Angle</TypographyH3>
          <Slider
            onValueCommit={(newAngle) => {
              setAngle(newAngle[0]);
              socket.emit("angle", 180 - newAngle[0]);
            }}
            onValueChange={(newAngle) => {
              setAngle(newAngle[0]);
            }}
            defaultValue={[angle]}
            value={[angle]}
            min={0}
            max={180}
            step={1}
          />
        </div>
        <div>
          <TypographyH3>Power ({power > 0 ? `${power}%` : "OFF"})</TypographyH3>
          <Slider
            onValueCommit={(newPower) => {
              setPower(newPower[0]);
              socket.emit("power", Math.floor(newPower[0] * 2.55));
            }}
            onValueChange={(newPower) => {
              setPower(newPower[0]);
            }}
            defaultValue={[power]}
            value={[power]}
            min={0}
            max={100}
            step={1}
          />
        </div>
      </div>
    </>
  );
}

export default LampConf;

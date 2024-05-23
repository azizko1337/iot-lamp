"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TypographyH2, TypographyLarge } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

import saveLampCode from "@/lib/saveLampCode";

function AddLamp() {
  const router = useRouter();

  const [lampCode, setLampCode] = useState("");
  const [feedback, setFeedback] = useState("");

  const addLamp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lampCode.length !== 36) {
      setFeedback("Invalid lamp code");
      return;
    }

    const res = await fetch(
      process.env.API_URL + `/verify?lampCode=${lampCode}`,
      {
        method: "GET",
      }
    );
    const lamp = await res.json();
    if (lamp.exists) {
      await saveLampCode(lampCode);
      router.push("/lamp/list");
    } else {
      setFeedback("Lamp not found");
    }
  };

  return (
    <>
      <div></div>
      <form className="flex flex-col gap-2 items-end" onSubmit={addLamp}>
        <TypographyH2 className={cn("w-full")}>Add connected lamp</TypographyH2>
        <Input
          type="text"
          onChange={(e) => setLampCode(e.target.value)}
          value={lampCode}
          placeholder="Your lamp's code"
        />
        <Button type="submit">Add</Button>
        <TypographyLarge>{feedback}</TypographyLarge>
      </form>
      <div></div>
    </>
  );
}

export default AddLamp;

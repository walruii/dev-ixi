"use client";

import { makeUser } from "@/serveractions/user";
import { useState } from "react";

export default function MakeUser() {
  const [response, setResponse] = useState<string>("");
  const handleClick = async () => {
    try {
      const res = await makeUser();
      console.log(res);
      setResponse(JSON.stringify(res));
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  return (
    <>
      <button onClick={handleClick}>MAKE USER</button>
      <p>{response}</p>
    </>
  );
}

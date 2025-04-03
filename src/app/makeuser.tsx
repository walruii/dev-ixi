"use client";

import {
  checkPassword,
  createUser,
  deleteUserById,
} from "@/serveractions/user";

export default function MakeUser() {
  const handleClick = async () => {
    try {
      const res = await createUser({ name: "1", email: "1", password: "1" });
      console.log(res);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  return (
    <>
      <button onClick={handleClick}>MAKE USER</button>
      <button
        onClick={async () => {
          console.log(await checkPassword({ userId: 4, password: "1" }));
        }}
      >
        CHECK USER PASSWORD
      </button>
      <button
        onClick={async () => {
          console.log(await deleteUserById(4));
        }}
      >
        DELETE USER
      </button>
    </>
  );
}

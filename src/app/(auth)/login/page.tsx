"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
const SigninButton = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="">
        <button onClick={() => signOut()} className="text-black bg-main-pink py-1 px-2 border-2 rounded-md border-black">
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <button onClick={() => signIn()} className="bg-main-pink py-1 px-2 border-2 rounded-md border-black">
      Sign In
    </button>
  );
};

export default SigninButton;
"use client";
import { signIn } from "next-auth/react";
import { Button } from "@nextui-org/button";

export default function Page() {
  return <Button onClick={
    ()=>signIn("google")
  }>
    Login with
  </Button>
};
"use client";

import { Button } from "@nextui-org/button";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

const buttonClass =" bg-gradient-to-br from-red-500 to-pink-500 m-6 transition transform hover:scale-95 duration-1000";

export function Enter(){
    const session = useSession();
    if (session.status == "authenticated"){
        return <Button as={Link} href="/app/friends" size="lg" variant="ghost" className={buttonClass}>
            Enter
        </Button>
    }
    else {
        return <form action={()=>{
            signIn("google", {callbackUrl: "/app/friends"});
        }}>
            <Button type="submit" size="lg" variant="ghost" className={buttonClass}>
                Enter
            </Button>
        </form>
    }
}
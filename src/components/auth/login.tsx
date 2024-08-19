"use client";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { LoginDropdown } from "./login-dropdown";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export function Login(){
    const session = useSession();
    useEffect(()=>{
        session.update();
    },[])

    if (session.status === "loading"){
        return <Spinner color="secondary"/>
    }
    if (session.status === "unauthenticated") {
        return <form action={()=>{signIn("google", {callbackUrl: "/signup"})}}>
            <Button  variant="ghost" color="primary" type="submit" className="font-semibold hover:shadow-[0px_0px_10px_blue]">
                Login In
            </Button>
        </form>
    }
    if (session.data?.user?.image && session.data?.user?.name && session.data?.user?.email){
        return <LoginDropdown name={session.data.user.name} image={session.data.user.image} email={session.data.user.email}/>
    }
}
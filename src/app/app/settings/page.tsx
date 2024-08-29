"use client";
import { useSession, type UpdateSession } from "next-auth/react";
import { type Session } from "next-auth";
import { Avatar } from "@nextui-org/avatar";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { updateUser } from "@/actions/user";

export default function Page(){
    const {data: session, status, update:updateSession} = useSession();
    return <div className="h-full w-full flex justify-center items-center">
        <div className="h-5/6 w-5/6 md:w-2/3 bg-neutral-700 rounded-xl flex flex-col p-2">
        {
            (status === "authenticated" && session) ? <Contents session={session} updateSession={updateSession}/> : <></>
        }
        </div>
    </div>

}

function Save({inputValue, updateSession}:{updateSession: UpdateSession, inputValue: {displayName: string, userName: string}}){
    async function save(){
        const result = await updateUser(inputValue);
        if (result?.validationErrors?.fieldErrors.displayName){
            return alert("Display Name: "+result.validationErrors.fieldErrors.displayName);
        }
        if (result?.validationErrors?.fieldErrors.userName){
            return alert("User Name: "+result.validationErrors.fieldErrors.userName);
        }
        updateSession();
        alert("User updated successfully");
    }
    return <div className="flex justify-center w-full h-12">
        <div className="w-full md:w-2/3 h-full opacity-80 bg-neutral-800 rounded-lg flex items-center justify-center">
            <Button className="w-24 bg-green-600" onClick={save}>SAVE</Button>
        </div>
    </div>
}

function Contents({session, updateSession}:{session: Session, updateSession: UpdateSession}){
    //I will add the ability to change image later when I make the image upload
    const [inputValue, setInputValue] = useState({
        displayName: session.dbUser?.displayName || "",
        userName: session.dbUser?.userName || ""
    });
    
    function handleChange(event: React.ChangeEvent<HTMLInputElement>){
        setInputValue({...inputValue, [event.target.name]: event.target.value});
        console.log(inputValue);
    }

    return <>
        <div className="flex-1 flex md:flex-row flex-col">
            <div className="h-80 w-80 px-6 pt-10">
                <Avatar src={session?.dbUser?.imageUrl || ""} name={session.dbUser?.displayName || ""} className="h-full w-full scale-90 md:scale-100" isBordered />
            </div>
            <div className="flex flex-col flex-1 justify-center items-center md:items-end gap-6 p-6">
                <div className="flex flex-col gap-1">
                    <label htmlFor="displayName" className="font-semibold text-xs text-gray-300">DISPLAY NAME</label>
                    <input name="displayName" defaultValue={session.dbUser?.displayName || ""} className="w-80 md:w-96 h-10 p-1 px-3 rounded-md text-lg  bg-zinc-800" onChange={handleChange}/>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="userName" className="font-semibold text-xs text-gray-300">USER NAME</label>
                    <input name="userName" defaultValue={session.dbUser?.userName || ""} className="w-80 md:w-96 h-10 p-1 px-3 rounded-md text-lg bg-zinc-800" onChange={handleChange}/>
                </div>
            </div>
        </div>
        {
            ((inputValue.displayName !== session.dbUser?.displayName) || (inputValue.userName !== session.dbUser?.userName))
            ? 
            <Save updateSession={updateSession} inputValue={inputValue}/> : <></>
        }
    </>
}
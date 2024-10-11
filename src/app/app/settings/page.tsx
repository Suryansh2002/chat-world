"use client";
import { useSession, type UpdateSession } from "next-auth/react";
import { type Session } from "next-auth";
import { Avatar } from "@nextui-org/avatar";
import { useState, useRef } from "react";
import { Button } from "@nextui-org/button";
import { updateUser } from "@/actions/user";
import { EditButton } from "@/components/ui/edit-button";
import { Spinner } from "@nextui-org/spinner";

export default function Page(){
    const {data: session, status, update:updateSession} = useSession();
    return <div className="h-full w-full flex justify-center items-center">
        <div className="h-5/6 w-5/6 md:w-2/3 bg-zinc-700 rounded-xl flex flex-col p-2">
        {
            (status === "authenticated" && session) ? <Contents session={session} updateSession={updateSession}/> : <></>
        }
        </div>
    </div>

}

function Save({
    inputValue,
    updateSession
}:{
    updateSession: UpdateSession,
    inputValue: {displayName: string, userName: string, file?: Uint8Array}
}){
    const [loading, setLoading] = useState(false);
    const [resultState, setResult] = useState<{
        message:string,
        type:"success"|"error"
    }>({message:"", type:"success"});
    async function save(){
        setLoading(true);
        const result = await updateUser(inputValue);
        setLoading(false);
        console.log(result);
        if (result?.validationErrors?.fieldErrors.displayName){
            return setResult({message:"Display Name: "+result.validationErrors.fieldErrors.displayName, type:"error"});
        }
        if (result?.validationErrors?.fieldErrors.userName){
            return setResult({message:"User Name: "+result.validationErrors.fieldErrors.userName, type:"error"});
        }
        if (result?.serverError){
            return setResult({message:result.serverError, type:"error"});
        }
        setResult({message:"Saved", type:"success"});
        
    }
    if (loading){
        return <div className="flex justify-center w-full">
            <div className="max-w-fit md:w-2/3 p-1 bg-zinc-800 rounded-full flex items-center justify-center border-2 border-gray-600">
                <Spinner size="lg" color="white" />
            </div>
        </div>
    }
    if (resultState.message){
        return <div className="flex justify-center w-full">
            <div className={`max-w-fit md:w-2/3 p-2 ${resultState.type === "success" ? "bg-green-500" : "bg-red-400"} font-medium bg-opacity-70 rounded-xl flex items-center justify-center border-3 border-gray-600`}>
                <p className="text-white">{resultState.message}</p>
            </div>
        </div>
    }
    return <div className="flex justify-center w-full">
        <div className="max-w-fit md:w-2/3 p-1 bg-zinc-800 rounded-xl flex items-center justify-center border-2 border-gray-600">
            <Button className="w-24 bg-green-600 border-2 border-gray-400 bg-opacity-70" onClick={()=>{
                save().then(()=>{
                    setTimeout(()=>{
                        updateSession();
                    }, 5000);
                })
            }}>SAVE</Button>
        </div>
    </div>
}

function Contents({session, updateSession}:{session: Session, updateSession: UpdateSession}){
    //I will add the ability to change image later when I make the image upload
    const [inputValue, setInputValue] = useState({
        displayName: session.dbUser?.displayName || "",
        userName: session.dbUser?.userName || "",
        imageUrl: session.dbUser?.imageUrl || ""
    });

    const [file, setFile] = useState<Uint8Array>();

    const [whatsDisabled, setWhatsDisabled] = useState({
        displayName: true,
        userName: true
    });

    function handleImageInput(event: React.ChangeEvent<HTMLInputElement>){
        const file = event.target.files?.[0];
        if (!file) return;
        file.arrayBuffer().then((data)=>{
            setFile(new Uint8Array(data));
        });
        const reader = new FileReader();
        reader.onload = (e)=>{
            setInputValue({...inputValue, imageUrl: e.target?.result as string});
        }
        reader.readAsDataURL(file);
    }
    
    function handleChange(event: React.ChangeEvent<HTMLInputElement>){
        setInputValue({...inputValue, [event.target.name]: event.target.value});
    }

    const inputRef = useRef<HTMLInputElement>(null);

    return <>
        <div className="flex-1 flex lg:flex-row flex-col">
            <div className="h-80 w-80 md:px-6 md:pt-10 relative">
                <Avatar src={inputValue.imageUrl} name={session.dbUser?.displayName || ""} className="h-full w-full scale-85 md:scale-100" isBordered />
                <EditButton className="absolute rounded-full z-10 bottom-1 right-1" onClick={()=>{
                    inputRef.current?.click();
                }}/>
                <input type="file" className="hidden" id="imageinput" accept="image/*" onChange={handleImageInput} ref={inputRef}/>
            </div>
            <div className="flex flex-col flex-1 justify-center items-center md:items-end gap-6 p-6">
                <div className="flex flex-col gap-1">
                    <label htmlFor="displayName" className="font-semibold text-xs text-gray-300">DISPLAY NAME</label>
                    <div className="flex gap-1">
                        <input name="displayName" defaultValue={session.dbUser?.displayName || ""} 
                            disabled={whatsDisabled.displayName}
                            className={`w-56 sm:w-64 md:w-96 h-10 p-1 px-3 rounded-md text-lg ${whatsDisabled.displayName ? "bg-zinc-800" : "bg-zinc-900"}`} 
                            onChange={handleChange}
                            onFocus={()=>{setWhatsDisabled({...whatsDisabled, userName: true})}}
                        />
                        <EditButton onClick={()=>{setWhatsDisabled({...whatsDisabled, displayName: !whatsDisabled.displayName})}}/>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="userName" className="font-semibold text-xs text-gray-300">USER NAME</label>
                    <div className="flex gap-1">
                        <input name="userName" defaultValue={session.dbUser?.userName || ""}
                            disabled={whatsDisabled.userName}
                            className={`w-56 sm:w-64 md:w-96 h-10 p-1 px-3 rounded-md text-lg ${whatsDisabled.userName ? "bg-zinc-800" : "bg-zinc-900"}`}
                            onChange={handleChange}
                            onFocus={()=>{setWhatsDisabled({...whatsDisabled, displayName: true})}}
                        />
                        <EditButton onClick={()=>{setWhatsDisabled({...whatsDisabled, userName: !whatsDisabled.userName})}}/>
                    </div>
                </div>
            </div>
        </div>
        {
            ((inputValue.displayName !== session.dbUser?.displayName) || (inputValue.userName !== session.dbUser?.userName)) || (inputValue.imageUrl !== session.dbUser?.imageUrl)
            ? 
            <Save updateSession={updateSession} inputValue={{...inputValue,file}}/> : <></>
        }
    </>
}
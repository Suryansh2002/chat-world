import { useRef, useState, useTransition } from "react";
import { sendRequest } from "@/actions/friends";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";

export function AddFriendModal({setMode}:{setMode:React.Dispatch<React.SetStateAction<boolean>>}){
    const colorRef = useRef("text-red-500");
    const inputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState("");
    const [isPending, startTransition] = useTransition();

    async function handleClick(){
        startTransition(async()=>{
            colorRef.current = "text-red-500";
            if (!inputRef.current){
                setMessage("Please enter a username !");
                return;
            }
            const result = await sendRequest({userName:inputRef.current.value});
            if (result?.serverError){
                setMessage(result.serverError);
                return;
            }
            if (result?.data){
                colorRef.current = "text-emerald-500";
                setMessage(result.data);
            }
        });
    }

    function keyDown(event:React.KeyboardEvent){
        if (event.key === "Enter"){
            handleClick();
        }
    }


    return <div className="absolute w-full h-full bg-black bg-opacity-70 flex items-center justify-center">
        <div className="absolute bg-zinc-900 border-2 border-orange-400 w-[90%] md:w-1/3 h-52 rounded-2xl flex flex-col items-center p-4 gap-4 overflow-hidden">
            <button className="absolute top-1 right-1 bg-red-500 w-7 h-7 rounded-lg border-2 border-red-400" onClick={()=>{setMode(false)}}>✕</button>
            <h1 className="text-2xl font-semibold self-center text-white">Add Friend</h1>
            <input ref={inputRef} className="border-2 border-zinc-700 rounded-md p-2 md:w-2/3" type="text" placeholder="Enter username" onChange={()=>setMessage("")} onKeyDown={keyDown}/>
            <p className={`${colorRef.current} text-small`}>{message}</p>
            <Button className="bg-blue-500 rounded-md self-center" onClick={handleClick}>
                {isPending ? <Spinner color="default" size="sm"/>: "Add"}
            </Button>
        </div>
    </div>
}

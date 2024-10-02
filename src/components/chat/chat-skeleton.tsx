'use client';
import { Skeleton } from "@nextui-org/skeleton";

function ChatItem(){
    return (
        <div className="md:max-w-[400px] max-w-[80%] w-full relative">
            <Skeleton className="flex rounded-full w-12 h-12 absolute"/>
            <div className="pl-14 py-1 flex flex-col gap-2 w-full">
                {
                    Array.from({length:2}).map((_,i)=><Skeleton key={i} className="h-4 w-full rounded-lg"/>)
                }
            </div>
        </div>
    )
}


export function ChatSkeleton(){
    return <div className="min-h-full w-full overflow-x-hidden overflow-y-scroll">
        <div className="flex-col flex h-full w-full gap-4 bg-zinc-900 rounded-xl p-3">
            {
                Array.from({length: 10}).map((_,i)=><ChatItem key={i}/>)
            }
        </div>
    </div>;
}

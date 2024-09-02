import { Skeleton } from "@nextui-org/skeleton";
import { getRndInteger } from "@/lib/utils";

function ChatItem(){
    return (
        <div className="md:max-w-[400px] max-w-[80%] w-full relative">
            <Skeleton className="flex rounded-full w-12 h-12 absolute"/>
            <div className="pl-14 py-1 flex flex-col gap-2 w-full">
                {
                    Array.from({length: getRndInteger(2, 3)}).map((_,i)=><Skeleton key={i} className="h-4 w-full rounded-lg"/>)
                }
            </div>
        </div>
    )
}


export function ChatSkeleton(){
    return <div className="flex flex-col h-full w-full p-3 gap-4 overflow-x-hidden overflow-y-scroll">
        {
            Array.from({length: 10}).map((_,i)=><ChatItem key={i}/>)
        }
    </div>;
}

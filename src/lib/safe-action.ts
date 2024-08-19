import { auth } from "@/auth";
import { createSafeActionClient, } from "next-safe-action";
import { redirect } from "next/navigation";

export const actionClient = createSafeActionClient({
    defaultValidationErrorsShape: "flattened",
    handleReturnedServerError(e){
        return e.message;   
    }
});

export const authActionClient = actionClient.use(async({next})=>{
    const session = await auth();
    if(!session){
        redirect("/");        
    }
    return next({ctx:{session}});
})
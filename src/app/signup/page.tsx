"use client"
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Select,SelectItem } from "@nextui-org/select";
import { createUser } from "@/actions";
import { useAction } from "next-safe-action/hooks";


export default function Signup(){
    const {execute, result} = useAction(createUser);
    let fieldError = result?.validationErrors?.fieldErrors;
    return <div className="h-screen w-screen flex justify-center items-center">
        <form action={execute}>
        <Card className="w-60 md:w-72">
            <CardHeader>Signup</CardHeader>
            <Divider/>
            <CardBody className="gap-3 flex items-center">
                <Input type="text" name="userName" label="Username" placeholder="Enter your username" isRequired={true}/>
                {<p className="text-red-500 text-tiny">{fieldError?.userName?.length && fieldError.userName[0]}</p>}
                <Input type="text" name="displayName" label="Display Name" placeholder="Enter your display name" isRequired={true}/>
                {<p className="text-red-500 text-tiny">{fieldError?.displayName?.length && fieldError.displayName[0]}</p>}
                <Select name="gender" label="Gender" placeholder="Select your gender" isRequired={true}>
                    <SelectItem key="male">Male</SelectItem>
                    <SelectItem key="female">Female</SelectItem>
                    <SelectItem key="other">Other</SelectItem>
                </Select>
                {<p className="text-red-500 text-tiny">{fieldError?.gender?.length && fieldError.gender[0]}</p>}
                {<p className="text-red-500 text-tiny">{result.serverError}</p>}
                <Button color="danger" variant="bordered" className="w-1/3" type="submit">Submit</Button>
            </CardBody>
        </Card>
        </form>
    </div>
}
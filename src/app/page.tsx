import {MainNavbar} from "@/components/main-nav"
import {MainFooter} from "@/components/main-footer"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { Enter } from "@/components/auth/enter"


export default async function Page(){
    return <div>
        <MainNavbar />
        <section className="flex items-center justify-center flex-col">
            <h1 className="text-center text-7xl mt-56 mx-2 text-transparent bg-clip-text bg-gradient-to-tr from-white to-red-800">Chat World</h1>
            <TextGenerateEffect staggerValue={0.1} className="font-semibold mx-10" words="Chat World is a place to chat with your friends and form a community"/>
            <Enter />
        </section>

        <section className="flex items-center justify-center flex-col">
            <h1 className="text-6xl mt-32">Features</h1>
        </section>
        <MainFooter />
    </div>
}
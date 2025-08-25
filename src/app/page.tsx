import {MainNavbar} from "@/components/main/nav"
import {MainFooter} from "@/components/main/footer"
import { Features } from "@/components/main/features"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { Enter } from "@/components/auth/enter"
import { GlassyBackground } from "@/components/ui/glassy-bg"


export default async function Page(){
    return <div className="bg-gradient-to-br from-gray-950 via-black to-gray-950 min-h-screen">
        <MainNavbar />
        <section className="px-6 lg:px-96">
            <GlassyBackground className="mt-56 py-8 rounded-xl flex items-center justify-center flex-col border border-gray-600">
                <h1 className="text-center text-6xl lg:text-7xl mx-2 text-transparent bg-clip-text bg-gradient-to-tr from-indigo-300 to-red-500">Chat World</h1>
                    <TextGenerateEffect 
                        staggerValue={0.1} 
                        className="font-medium mx-10" 
                        words="Chat World is a place to chat with your friends and form a community"
                    />
                <Enter />
            </GlassyBackground>
        </section>

        <section className="flex items-center justify-center flex-col">
            <h1 className="text-6xl mt-32">Features</h1>
            <Features />
        </section>
        <MainFooter />
    </div>
}
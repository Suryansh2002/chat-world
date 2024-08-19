import { auth,signIn } from "@/auth"

async function signInWithGoogle(){
  "use server";
  await signIn("google")
}

export default async function Page() {
  const session = await auth();

  return <form>
    <button formAction={signInWithGoogle}>
      CLICK TO SIGN IN
    </button>
    <div>
      {
        JSON.stringify(session?.dbUser)
      }
    </div>
  </form>
};
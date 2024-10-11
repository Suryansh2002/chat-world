import { NextRequest, NextResponse } from "next/server";
import { type Session } from "next-auth";

export default async function middleware(request:NextRequest){
  if (request.headers.get("next-action")){
    return;
  }
  const result = await fetch(`${process.env.NEXTAUTH_URL || request.nextUrl.origin}/api/auth/session`, {
    headers: {
      cookie: request.headers.get("cookie") || ""
    }
  })

  const session:Session = await result.json();
  const {pathname} = request.nextUrl;

  if (pathname.startsWith("/app")){
    if (!session){
      request.nextUrl.pathname = "/"
      return NextResponse.redirect(request.nextUrl);
    }
    if (!session?.dbUser){
      request.nextUrl.pathname = "/signup"
      return NextResponse.redirect(request.nextUrl);
    }
  }
  else if (pathname.startsWith("/signup")){
    if (session?.dbUser){
        request.nextUrl.pathname = "/"
        return NextResponse.redirect(request.nextUrl);
    }
  }
}

export const config = {
  matcher: ["/app/:path*", "/signup"],
};

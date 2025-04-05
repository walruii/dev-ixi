// export { auth as middleware } from "@/auth";
import { auth } from "@/auth";
export default auth((req) => {
  const { pathname, origin } = req.nextUrl;
  if (pathname === "/onboarding") return;

  if (
    req.auth?.user &&
    !req.auth?.user?.isRegistered &&
    pathname !== "/onboarding"
  ) {
    const newUrl = new URL("/onboarding", origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};

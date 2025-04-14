import OnboardingForm from "./onboardingForm";
import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";

export default async function Onboarding() {
  const session = await auth();
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium font-stretch-ultra-expanded"
          >
            <Image
              src="/icon.svg"
              alt="dev-ixi"
              width={50}
              height={50}
              className="dark:invert"
            />
            DEV-IXI
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <OnboardingForm session={session} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          height={1000}
          width={1000}
        />
      </div>
    </div>
  );
}

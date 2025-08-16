import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { signUpAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { UrlProvider } from "@/components/url-provider";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <div className="w-full border-b border-blue-200 bg-white/95 backdrop-blur-md py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-center">
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="/images/loyo-icon-favicon.png"
              alt="LOYO Logo"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              LOYO
            </span>
          </Link>
        </div>
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          <UrlProvider>
            <form className="flex flex-col space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Sign up
                </h1>
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    className="text-primary font-medium hover:underline transition-all"
                    href="/sign-in"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Your password"
                    minLength={6}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <SubmitButton
                formAction={signUpAction}
                pendingText="Signing up..."
                className="w-full"
              >
                Sign up
              </SubmitButton>

              <FormMessage message={searchParams} />
            </form>
          </UrlProvider>
        </div>
        <SmtpMessage />
      </div>
    </>
  );
}

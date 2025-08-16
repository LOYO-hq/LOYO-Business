"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { User, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <nav className="w-full border-b border-blue-200 bg-white/95 backdrop-blur-md py-2 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" prefetch className="flex items-center space-x-2">
            <img
              src="/images/loyo-correct-logo.png"
              alt="LOYO Logo"
              className="h-8 object-contain"
            />
          </Link>
          <div className="flex gap-4 items-center">
            <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full border-b border-blue-200 bg-white/95 backdrop-blur-md py-2 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center space-x-2">
          <img
            src="/images/loyo-correct-logo.png"
            alt="LOYO Logo"
            className="h-8 object-contain"
          />
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white">
                  Dashboard
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 rounded-md hover:from-blue-700 hover:to-teal-700 transition-all shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

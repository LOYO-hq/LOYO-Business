"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function TopMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Home", href: "/", section: "home" },
    { name: "Features", href: "/#features", section: "features" },
    { name: "Smart Analytics", href: "/#analytics", section: "analytics" },
    { name: "How It Works", href: "/#demo", section: "demo" },
    { name: "Pricing", href: "/#pricing", section: "pricing" },
  ];

  const scrollToSection = (sectionId: string) => {
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/images/loyo-correct-logo.png"
              alt="LOYO Logo"
              className="h-8 object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.href.startsWith("/#")) {
                    e.preventDefault();
                    scrollToSection(item.section);
                  }
                }}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-teal-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-blue-600"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/#pricing">
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-blue-100">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (item.href.startsWith("/#")) {
                      e.preventDefault();
                      scrollToSection(item.section);
                    } else {
                      setIsOpen(false);
                    }
                  }}
                  className="text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-blue-100">
                <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:text-blue-600"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/#pricing" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

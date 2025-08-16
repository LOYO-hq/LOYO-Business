"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Play,
  QrCode,
  Users,
  Award,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50 pt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000" />
      </div>

      <div className="relative pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto">
            {/* Logo and Slogan */}
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <img
                  src="/images/icon-loyo.png"
                  alt="LOYO Logo"
                  className="w-20 h-20 sm:w-24 sm:h-24"
                />
              </div>
              <p className="text-4xl sm:text-5xl font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-600 to-teal-700 font-bold italic animate-pulse">
                Smart loyalty made easy
              </p>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
              Transform Your Business with{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600">
                  Digital Loyalty
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-blue-300 to-teal-300 -skew-x-12 opacity-60" />
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Create stunning digital stamp cards, track customer engagement,
              and boost repeat business with our intuitive platform designed for
              modern entrepreneurs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/#pricing"
                className="group inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl hover:from-blue-800 hover:to-blue-700 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
                <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <button
                onClick={() =>
                  document.getElementById("how-it-works-dialog")?.click()
                }
                className="group inline-flex items-center px-8 py-4 text-gray-700 bg-white border-2 border-blue-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 text-lg font-medium shadow-sm hover:shadow-md"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                How it works
              </button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium text-gray-800">
                  QR Code Generation
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100 shadow-sm">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-teal-600" />
                </div>
                <span className="font-medium text-gray-800">
                  Customer Insights
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100 shadow-sm">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="font-medium text-gray-800">Smart Rewards</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

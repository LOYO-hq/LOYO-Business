"use client";

import Footer from "@/components/footer";
import Hero from "@/components/hero";
import TopMenu from "@/components/top-menu";
import Link from "next/link";
import {
  ArrowUpRight,
  QrCode,
  Palette,
  MapPin,
  BarChart3,
  Smartphone,
  Award,
  Users,
  Check,
  TrendingUp,
  X,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Analytics Carousel Component
function AnalyticsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {/* Weekly Engagement Trend Card */}
        <div className="w-full flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xl border border-blue-200 p-6 relative h-[520px] m-4">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-gray-900">
                Weekly Engagement Trend
              </h4>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Live Data</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
                <div className="text-xl font-bold text-blue-700">2,847</div>
                <div className="text-xs text-blue-600">Active Customers</div>
                <div className="text-xs text-green-600 mt-1">
                  ↗ +12% this month
                </div>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-3 rounded-xl border border-teal-200">
                <div className="text-xl font-bold text-teal-700">89%</div>
                <div className="text-xs text-teal-600">Retention Rate</div>
                <div className="text-xs text-green-600 mt-1">
                  ↗ +5% this month
                </div>
              </div>
            </div>

            {/* Weekly Engagement Chart */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200">
              <div className="flex items-end justify-between h-32 mb-4">
                {[23, 45, 31, 67, 42, 78, 56].map((height, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="text-xs text-gray-600 mb-1">{height}</div>
                    <div className="flex justify-center w-full">
                      <div
                        className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                        style={{
                          height: `${(height / 80) * 120}px`,
                          width: "20px",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, index) => (
                    <span key={index} className="text-center flex-1">
                      {day}
                    </span>
                  ),
                )}
              </div>
              <div className="text-center text-xs text-gray-600 mt-3">
                Customer Visits This Week
              </div>
            </div>

            {/* Recent Activity - Fixed Container */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-3">
                Recent Activity
              </div>
              <div className="space-y-2">
                {[
                  {
                    action: "New customer registered",
                    time: "2 min ago",
                    color: "bg-green-100",
                  },
                  {
                    action: "Reward redeemed",
                    time: "5 min ago",
                    color: "bg-blue-100",
                  },
                  {
                    action: "Stamp awarded",
                    time: "8 min ago",
                    color: "bg-teal-100",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${activity.color}`}
                      ></div>
                      <span className="text-xs text-gray-700 truncate">
                        {activity.action}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Segments Card */}
        <div className="w-full flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xl border border-blue-200 p-6 relative h-[520px] m-4">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-gray-900">
                Customer Segments
              </h4>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Live Data</span>
              </div>
            </div>

            {/* Expanded Customer Segments Chart */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 flex-1">
              <div className="flex items-center justify-center mb-8">
                <div className="relative w-56 h-56">
                  {/* Enhanced Donut Chart */}
                  <svg
                    className="w-56 h-56 transform -rotate-90"
                    viewBox="0 0 42 42"
                  >
                    {/* VIP Customers - 45% */}
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="6"
                      strokeDasharray="45 55"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                    {/* Regular Customers - 25% */}
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="6"
                      strokeDasharray="25 75"
                      strokeDashoffset="-45"
                      strokeLinecap="round"
                    />
                    {/* New Customers - 20% */}
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="6"
                      strokeDasharray="20 80"
                      strokeDashoffset="-70"
                      strokeLinecap="round"
                    />
                    {/* At-Risk Customers - 10% */}
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="6"
                      strokeDasharray="10 90"
                      strokeDashoffset="-90"
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Center percentage labels */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-800">
                        45%
                      </div>
                      <div className="text-sm text-gray-600">VIP</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Legend */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-100 shadow-sm">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      VIP Customers
                    </div>
                    <div className="text-gray-600">45% • 1,281</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-100 shadow-sm">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      Regular Customers
                    </div>
                    <div className="text-gray-600">25% • 712</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-green-100 shadow-sm">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      New Customers
                    </div>
                    <div className="text-gray-600">20% • 569</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-yellow-100 shadow-sm">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      At-Risk Customers
                    </div>
                    <div className="text-gray-600">10% • 285</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        <div
          className={`w-3 h-3 rounded-full transition-colors duration-300 ${
            currentSlide === 0 ? "bg-blue-500" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`w-3 h-3 rounded-full transition-colors duration-300 ${
            currentSlide === 1 ? "bg-blue-500" : "bg-gray-300"
          }`}
        ></div>
      </div>

      {/* Floating elements - positioned to be fully visible */}
      <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full opacity-60 animate-bounce"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full opacity-40 animate-pulse"></div>
    </div>
  );
}

export default function Home() {
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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <TopMenu />
      <Hero />

      {/* How It Works Dialog */}
      <Dialog>
        <DialogTrigger id="how-it-works-dialog" className="hidden" />
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6">
              How LOYO Works
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold">
                    Customer Scans QR Code
                  </h3>
                </div>
                <p className="text-gray-600">
                  Customer scans your LOYO QR code displayed at the counter.
                  Your store stamp card loads in their wallet and they request a
                  new stamp.
                </p>
              </div>
              <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center">
                <QrCode className="w-24 h-24 text-blue-600" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold">
                    Location Verification & Approval
                  </h3>
                </div>
                <p className="text-gray-600">
                  After location verification, you receive a notification in
                  your LOYO business app to manually confirm and award the
                  stamp.
                </p>
              </div>
              <div className="w-48 h-80 bg-gray-900 rounded-3xl p-4 relative">
                <div className="w-full h-full bg-white rounded-2xl p-4 flex flex-col justify-between">
                  <div className="text-center mb-3">
                    <div className="text-sm font-bold text-gray-800">
                      LOYO Business
                    </div>
                    <div className="text-xs text-gray-600">
                      Stamp Request Notification
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs font-bold text-blue-800">
                        📍 Location Verified
                      </div>
                      <div className="text-xs text-blue-700">
                        Customer at your store
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-xs font-bold text-green-800">
                        ✓ Confirm Stamp Award
                      </div>
                      <div className="text-xs text-green-700">
                        John D. - Coffee Purchase
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-600 text-white text-xs text-center py-2 rounded-lg mt-3">
                    Tap to Approve
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold">Stamp Added & Sync</h3>
                </div>
                <p className="text-gray-600">
                  Customer sees the new stamp added to their card. Both sides
                  synchronize to update the customer reward counts in real-time.
                </p>
              </div>
              <div className="w-48 h-80 bg-gray-900 rounded-3xl p-4 relative">
                <div className="w-full h-full bg-white rounded-2xl p-4 flex flex-col justify-between">
                  <div className="text-center mb-3">
                    <div className="text-sm font-bold text-gray-800">
                      Brew Bros Loyalty
                    </div>
                    <div className="text-xs text-gray-600">
                      Stamp added successfully!
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 ${i === 7 ? "bg-green-500 animate-pulse" : "bg-teal-500"} rounded-full flex items-center justify-center`}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ))}
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 bg-gray-200 rounded-full"
                        ></div>
                      ))}
                    </div>
                    <div className="text-xs text-center text-gray-600 mb-3">
                      8 / 12 stamps
                    </div>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg text-center">
                    <div className="text-xs font-bold text-green-800">
                      ✨ New Stamp Added!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <h3 className="text-xl font-semibold">Reward Redemption</h3>
                </div>
                <p className="text-gray-600">
                  When the customer is ready to redeem their reward, you receive
                  a notification to award the reward upon customer scan.
                </p>
              </div>
              <div className="w-48 h-48 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center">
                <Award className="w-24 h-24 text-orange-600" />
              </div>
            </div>

            {/* QR Code Demo */}
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-2xl text-center">
              <h4 className="text-lg font-semibold mb-4">Try it yourself!</h4>
              <div className="inline-block p-4 bg-white rounded-xl shadow-lg">
                <a
                  href="/stamp-card/demo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-2 relative overflow-hidden">
                    <img
                      src="/images/loyo-icon-favicon.png"
                      alt="QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-gray-600">Scan to see demo card</p>
                </a>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                This QR code takes you to a live demo loyalty card
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hands-Off Process Section */}
      <section
        id="process"
        className="py-16 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-200 to-teal-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-green-50 text-green-800 rounded-full text-sm font-medium mb-6">
              <Check className="w-4 h-4" />
              <span>Hassle-Free Process</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 text-clipping-fix">
              The Most
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-blue-700 contrast-fix">
                Hands-Off Loyalty System
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Your customers do the scanning. LOYO handles the authentication.
              You just press a button to approve.
              <span className="font-semibold text-green-700">
                Business as usual, loyalty as a bonus.
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-green-200 via-green-300 to-blue-200" />

            {[
              {
                step: "01",
                icon: <Smartphone className="w-10 h-10" />,
                title: "Customer Scans",
                description:
                  "Customer scans your QR code and requests a stamp. Location is automatically verified. No interruption to your service.",
                color: "from-green-700 to-green-600",
                bgColor: "bg-green-100",
                iconColor: "text-green-700",
              },
              {
                step: "02",
                icon: <Check className="w-10 h-10" />,
                title: "You Approve (One Tap)",
                description:
                  "Get a notification. Tap to approve. That's it. Or enable auto-approval during peak hours - stamps get approved automatically if no action taken.",
                color: "from-blue-600 to-teal-600",
                bgColor: "bg-blue-100",
                iconColor: "text-blue-600",
              },
              {
                step: "03",
                icon: <Award className="w-10 h-10" />,
                title: "Customer Gets Stamp",
                description:
                  "Stamp is instantly added to their digital card. Both sides sync automatically. Customer loyalty grows without any extra work from you.",
                color: "from-teal-600 to-teal-500",
                bgColor: "bg-teal-100",
                iconColor: "text-teal-600",
              },
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div
                    className={`w-24 h-24 ${step.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl border border-opacity-20`}
                  >
                    <div className={step.iconColor}>{step.icon}</div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-700 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-5 text-gray-900 group-hover:text-green-600 transition-colors text-clipping-fix">
                  {step.title}
                </h3>
                <p className="text-gray-700 leading-relaxed max-w-sm mx-auto text-clipping-fix">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Automation Features */}
          <div className="mt-20 bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-3xl border border-green-200 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Even More Hands-Off Options
              </h3>
              <p className="text-gray-700 text-lg">
                Perfect for busy periods when you can't check every notification
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2 text-gray-900">
                    Bulk Management
                  </h4>
                  <p className="text-gray-700">
                    Review, approve, reject, or modify multiple stamp requests
                    at once. Handle them when it's convenient for you.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2 text-gray-900">
                    Auto-Approval Settings
                  </h4>
                  <p className="text-gray-700">
                    Set lunch hour or peak time auto-approval. Stamps get
                    approved automatically if no action taken by end of
                    business.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              href="#pricing"
              className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-green-700 to-blue-600 rounded-xl hover:from-green-800 hover:to-blue-700 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Try Hands-Off Loyalty
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 bg-gradient-to-b from-white to-blue-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Smartphone className="w-4 h-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 text-clipping-fix">
              Everything You Need for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-teal-700 contrast-fix">
                Digital Loyalty Success
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Comprehensive tools designed to help small businesses create,
              manage, and optimize their customer loyalty programs with ease.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Palette className="w-8 h-8" />,
                title: "Visual Card Builder",
                description:
                  "Create stunning stamp cards with our intuitive drag-and-drop editor. Professional templates included.",
                color: "from-blue-700 to-blue-600",
                bgColor: "bg-blue-100",
                iconColor: "text-blue-700",
              },
              {
                icon: <QrCode className="w-8 h-8" />,
                title: "Smart QR Codes",
                description:
                  "Generate unique, secure QR codes for each campaign. Trackable and fraud-resistant.",
                color: "from-blue-600 to-teal-600",
                bgColor: "bg-blue-100",
                iconColor: "text-blue-600",
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Location Verification",
                description:
                  "Automatic GPS verification ensures stamps are only awarded when customers are at your location.",
                color: "from-teal-600 to-teal-500",
                bgColor: "bg-teal-100",
                iconColor: "text-teal-600",
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Advanced Analytics",
                description:
                  "Deep insights into customer behavior, campaign performance, and ROI tracking.",
                color: "from-blue-600 to-blue-500",
                bgColor: "bg-blue-100",
                iconColor: "text-blue-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-blue-200 hover:border-blue-300 hover:-translate-y-1"
              >
                <div
                  className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-opacity-20`}
                >
                  <div className={feature.iconColor}>{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors text-clipping-fix">
                  {feature.title}
                </h3>
                <p className="text-xl text-gray-700 leading-relaxed text-clipping-fix">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Analytics Section */}
      <section
        id="analytics"
        className="py-16 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <BarChart3 className="w-4 h-4" />
              <span>Smart Analytics</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
              Data-Driven Insights for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600">
                Smarter Business Decisions
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Transform raw customer data into actionable insights. Track
              performance, understand behavior patterns, and optimize your
              loyalty programs for maximum impact.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Analytics Features */}
            <div className="space-y-8">
              <div className="flex items-start gap-4 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    Customer Engagement Tracking
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Monitor visit frequency, stamp collection rates, and reward
                    redemption patterns to understand what drives customer
                    loyalty.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    Customer Segmentation
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Identify your most valuable customers, occasional visitors,
                    and at-risk segments to create targeted retention
                    strategies.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    Campaign Performance
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Track ROI on loyalty campaigns, measure reward
                    effectiveness, and optimize your program for better business
                    outcomes.
                  </p>
                </div>
              </div>
            </div>

            {/* Analytics Dashboard Preview - Carousel Container */}
            <AnalyticsCarousel />
          </div>

          {/* CTA directly below carousel */}
          <div className="text-center mt-8">
            <Link
              href="#pricing"
              className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-blue-700 to-teal-600 rounded-xl hover:from-blue-800 hover:to-teal-700 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Tracking Performance
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-8 bg-gradient-to-br from-white to-blue-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              <span>Flexible Pricing</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 text-clipping-fix">
              Simple, Transparent
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-teal-700 contrast-fix">
                Pricing Plans
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Choose the plan that fits your business. Start free and upgrade as
              you grow. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Basic Plan */}
            <div className="group bg-white border-2 border-blue-200 rounded-2xl p-8 relative hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Basic</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">A$29</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">Up to 100 customers</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">Basic stamp cards</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">QR code generation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">Basic analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">Email support</span>
                </li>
              </ul>

              <Link
                href="/sign-up"
                className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold group-hover:border-blue-700 group-hover:text-blue-700"
              >
                Get Started
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="group bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-300 rounded-2xl p-8 relative hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">
                  Premium
                </h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">A$59</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-gray-600">For growing businesses</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">Unlimited customers</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    Custom stamp card designs
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">Advanced QR codes</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    Detailed analytics & insights
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">Location verification</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">Export customer data</span>
                </li>
              </ul>

              <div className="space-y-3">
                <Link
                  href="/sign-up"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-xl hover:from-blue-800 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
                <Link
                  href="/sign-up"
                  className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold"
                >
                  Try Premium FREE - 30 Days
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="group bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-300 rounded-2xl p-8 relative hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">
                  Enterprise
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    Custom
                  </span>
                </div>
                <p className="text-gray-600">
                  Tailored pricing for your business
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">All Premium features</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">Multi-store integration</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">POS system integration</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    Advanced personalization
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    Custom branding & white-label
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    Dedicated account manager
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">Targeted promotions</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    Google Business Suite integration
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    Social media integration
                  </span>
                </li>
              </ul>

              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-700 to-teal-600 text-white rounded-xl hover:from-blue-800 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-200 to-teal-200 rounded-full opacity-30 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full opacity-30 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Award className="w-4 h-4" />
              <span>Ready to Get Started?</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-bold mb-6 text-gray-900 text-clipping-fix">
              Ready to Launch Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-teal-700 contrast-fix">
                Loyalty Program?
              </span>
            </h2>

            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of small businesses already using LOYO to increase
              customer retention, boost sales, and build lasting relationships
              with their customers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/sign-up"
                className="group inline-flex items-center px-10 py-5 text-white bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl hover:from-blue-800 hover:to-blue-700 transition-all duration-300 text-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Creating Cards
                <ArrowUpRight className="ml-3 w-6 h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <div className="text-sm text-gray-600">
                <span className="font-medium">Free 30-day trial</span> • No
                credit card required
              </div>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" />
                <span className="font-medium">Setup in 5 minutes</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" />
                <span className="font-medium">Cancel anytime</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" />
                <span className="font-medium">24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

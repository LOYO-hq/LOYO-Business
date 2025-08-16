"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  QrCode,
  ArrowLeft,
  Smartphone,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface StampCard {
  id: string;
  name: string;
  description?: string;
  stamps_required: number;
  reward_description: string;
  background_color?: string;
  accent_color?: string;
  business_id: string;
}

interface Business {
  id: string;
  business_name: string;
  logo_url?: string;
  address: string;
  suburb: string;
  state: string;
}

interface ExistingCustomer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  currentStamps: number;
  redeemedStamps: number;
}

export default function QROnboardingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [stampCard, setStampCard] = useState<StampCard | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [existingCustomer, setExistingCustomer] =
    useState<ExistingCustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<
    "detecting" | "existing" | "new" | "success"
  >("detecting");

  // Form data for new customers
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const businessId = searchParams.get("businessId");
  const customerId = searchParams.get("customerId");

  useEffect(() => {
    const detectCustomerStatus = async () => {
      if (!params.stampCardId || !businessId) {
        setError("Invalid QR code parameters");
        setLoading(false);
        return;
      }

      const supabase = createClient();

      try {
        // Validate QR code and get stamp card info
        const qrData = `${window.location.origin}/stamp-card/${params.stampCardId}?businessId=${businessId}${customerId ? `&customerId=${customerId}` : ""}`;

        const response = await fetch("/api/qr-scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qrData }),
        });

        const result = await response.json();

        if (!result.success) {
          setError(result.error || "Invalid QR code");
          setLoading(false);
          return;
        }

        const { data } = result;
        setStampCard({
          id: data.stampCardId,
          name: data.stampCardName,
          description: data.description,
          stamps_required: data.stampsRequired,
          reward_description: data.rewardDescription,
          background_color: data.cardDesign.backgroundColor,
          accent_color: data.cardDesign.accentColor,
          business_id: data.businessId,
        });

        setBusiness({
          id: data.businessId,
          business_name: data.businessName,
          logo_url: data.logoUrl,
          address: data.businessAddress.split(",")[0],
          suburb: data.businessAddress.split(",")[1]?.trim() || "",
          state: data.businessAddress.split(",")[2]?.trim() || "",
        });

        // Check customer status
        if (data.isExistingCustomer && data.existingCustomer) {
          setExistingCustomer(data.existingCustomer);
          setStep("existing");
        } else {
          setStep("new");
        }

        setLoading(false);
      } catch (err) {
        console.error("Detection error:", err);
        setError("Failed to process QR code");
        setLoading(false);
      }
    };

    detectCustomerStatus();
  }, [params.stampCardId, businessId, customerId]);

  const handleNewCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      (!formData.email.trim() && !formData.phone.trim())
    ) {
      setError("Please provide your name and either email or phone number");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Register new customer
      const registerResponse = await fetch("/api/customer-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register_new_customer",
          businessId,
          customerData: formData,
        }),
      });

      const registerResult = await registerResponse.json();
      if (!registerResult.success) {
        setError(registerResult.error || "Failed to register");
        setSubmitting(false);
        return;
      }

      // Request first stamp
      const stampResponse = await fetch("/api/customer-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_first_stamp",
          customerId: registerResult.customerId,
          stampCardId: params.stampCardId,
          businessId,
        }),
      });

      const stampResult = await stampResponse.json();
      if (!stampResult.success) {
        setError(stampResult.error || "Failed to request stamp");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setStep("success");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExistingCustomerAction = (action: "mobile" | "web") => {
    if (!stampCard || !business) return;

    const baseUrl =
      action === "mobile"
        ? `loyo://stamp-card/${stampCard.id}`
        : `https://customer.loyo.app/stamp-card/${stampCard.id}`;

    const url = `${baseUrl}?businessId=${businessId}${customerId ? `&customerId=${customerId}` : ""}`;

    if (action === "mobile") {
      // Try to open mobile app, fallback to app store
      window.location.href = url;
      setTimeout(() => {
        window.open("https://apps.apple.com/app/loyo-loyalty", "_blank");
      }, 2000);
    } else {
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Processing QR code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            QR Code Error
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {business?.logo_url ? (
              <img
                src={business.logo_url}
                alt={business.business_name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {business?.business_name?.charAt(0) || "B"}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {business?.business_name}
              </h1>
              <p className="text-gray-600">{stampCard?.name}</p>
            </div>
          </div>
        </div>

        {/* Existing Customer Flow */}
        {step === "existing" && existingCustomer && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {existingCustomer.name}!
              </h2>
              <p className="text-gray-600">
                You have {existingCustomer.currentStamps} stamps on your{" "}
                {stampCard?.name} card
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => handleExistingCustomerAction("mobile")}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-4 text-lg"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Open in LOYO App
              </Button>

              <Button
                onClick={() => handleExistingCustomerAction("web")}
                variant="outline"
                className="w-full py-4 text-lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Open in Web Browser
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 text-center">
                💡 Tip: Use the LOYO app for the best experience and to collect
                stamps easily!
              </p>
            </div>
          </div>
        )}

        {/* New Customer Registration Flow */}
        {step === "new" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <QrCode className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Join {business?.business_name}'s Loyalty Program
              </h2>
              <p className="text-gray-600">
                Get your first stamp and start earning rewards!
              </p>
            </div>

            {/* Stamp Card Preview */}
            <div className="mb-6 p-4 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {stampCard?.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {stampCard?.description}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <span>Collect {stampCard?.stamps_required} stamps</span>
                  <span>→</span>
                  <span className="font-semibold text-green-600">
                    {stampCard?.reward_description}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleNewCustomerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="0400 000 000"
                  className="w-full"
                />
              </div>

              <p className="text-xs text-gray-500">
                * Please provide either email or phone number
              </p>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-4 text-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Join & Request First Stamp"
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Success State */}
        {step === "success" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to {business?.business_name}!
            </h2>
            <p className="text-gray-600 mb-6">
              Your registration is complete and your first stamp has been
              requested. The business owner will approve it shortly.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800">
                💡 Download the LOYO app to track your stamps and get notified
                when they're approved!
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() =>
                  window.open(
                    "https://apps.apple.com/app/loyo-loyalty",
                    "_blank",
                  )
                }
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Download LOYO App
              </Button>

              <Link href="/">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

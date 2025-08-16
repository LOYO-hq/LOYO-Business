"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Award,
  Camera,
  Check,
  Clock,
  Heart,
  Info,
  Loader2,
  MapPin,
  Shield,
  Sparkles,
  Star,
  User,
} from "lucide-react";

interface StampCardData {
  stampCardId: string;
  stampCardName: string;
  description: string;
  stampsRequired: number;
  rewardDescription: string;
  businessId: string;
  businessName: string;
  businessAddress: string;
  logoUrl?: string;
  cardDesign: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    stampShape: string;
    selectedEmoji: string;
    customStampImage?: string;
    stampBaseShape: string;
    showLogo: boolean;
    showProgress: boolean;
  };
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  selfieUrl?: string;
}

export default function CustomerOnboarding() {
  const params = useParams();
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId");

  const [stampCardData, setStampCardData] = useState<StampCardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<
    "welcome" | "registration" | "requesting" | "success" | "error"
  >("welcome");
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
  });
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [stampRequestId, setStampRequestId] = useState<string | null>(null);

  useEffect(() => {
    const validateQRCode = async () => {
      if (!params.stampCardId || !businessId) {
        setError("Invalid QR code");
        setLoading(false);
        return;
      }

      try {
        const qrData = `https://customer.loyo.app/qr/${params.stampCardId}?businessId=${businessId}`;

        const response = await fetch("/api/qr-scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qrData }),
        });

        const result = await response.json();

        if (!result.success) {
          setError(result.error || "Invalid QR code");
          setStep("error");
          setLoading(false);
          return;
        }

        setStampCardData(result.data);
        setLoading(false);
      } catch (err) {
        console.error("QR validation error:", err);
        setError("Failed to validate QR code");
        setStep("error");
        setLoading(false);
      }
    };

    validateQRCode();
  }, [params.stampCardId, businessId]);

  const handleRegistration = async () => {
    if (
      !customerData.name.trim() ||
      (!customerData.email.trim() && !customerData.phone.trim())
    ) {
      alert("Please fill in your name and either email or phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      // Register customer
      const registerResponse = await fetch("/api/customer-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register_new_customer",
          businessId: stampCardData?.businessId,
          customerData,
        }),
      });

      const registerResult = await registerResponse.json();

      if (!registerResult.success) {
        throw new Error(registerResult.error || "Registration failed");
      }

      setCustomerId(registerResult.customerId);

      // Request first stamp
      const stampResponse = await fetch("/api/customer-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_first_stamp",
          customerId: registerResult.customerId,
          stampCardId: stampCardData?.stampCardId,
          businessId: stampCardData?.businessId,
        }),
      });

      const stampResult = await stampResponse.json();

      if (!stampResult.success) {
        throw new Error(stampResult.error || "Failed to request stamp");
      }

      setStampRequestId(stampResult.stampRequestId);
      setStep("requesting");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStampCard = () => {
    if (!stampCardData) return null;

    const { cardDesign } = stampCardData;
    const stampSize = 32;
    const filledStamps = 1; // Show first stamp as filled

    return (
      <div
        className="bg-white rounded-2xl shadow-lg p-6 border-2 max-w-sm mx-auto"
        style={{
          backgroundColor: cardDesign.backgroundColor,
          borderColor: cardDesign.accentColor + "40",
          color: cardDesign.textColor,
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          {cardDesign.showLogo && stampCardData.logoUrl && (
            <img
              src={stampCardData.logoUrl}
              alt="Business Logo"
              className="w-12 h-12 rounded-lg object-cover mx-auto mb-3"
            />
          )}
          <h3 className="text-lg font-semibold">
            {stampCardData.businessName}
          </h3>
          <h4 className="text-base font-medium">
            {stampCardData.stampCardName}
          </h4>
          {stampCardData.description && (
            <p className="text-sm opacity-75 mt-1">
              {stampCardData.description}
            </p>
          )}
        </div>

        {/* Stamps */}
        <div className="mb-4">
          <div className="grid grid-cols-5 gap-2 justify-center">
            {Array.from(
              { length: stampCardData.stampsRequired },
              (_, index) => {
                const filled = index < filledStamps;
                const isAnimated = index === 0 && step === "welcome";

                const stampBaseStyle = {
                  width: stampSize,
                  height: stampSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: filled
                    ? `2px solid ${cardDesign.accentColor}`
                    : `2px solid #e5e7eb`,
                  backgroundColor: filled
                    ? cardDesign.accentColor + "20"
                    : "transparent",
                  borderRadius:
                    cardDesign.stampBaseShape === "circle"
                      ? "50%"
                      : cardDesign.stampBaseShape === "rounded-square"
                        ? "8px"
                        : "50%",
                };

                return (
                  <div
                    key={index}
                    style={stampBaseStyle}
                    className={isAnimated ? "animate-pulse" : ""}
                  >
                    {filled && cardDesign.stampShape === "emoji" && (
                      <span
                        style={{ fontSize: "16px" }}
                        className={isAnimated ? "animate-bounce" : ""}
                      >
                        {cardDesign.selectedEmoji}
                      </span>
                    )}
                    {filled &&
                      cardDesign.stampShape === "custom" &&
                      cardDesign.customStampImage && (
                        <img
                          src={cardDesign.customStampImage}
                          alt="Custom stamp"
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "contain",
                          }}
                          className={isAnimated ? "animate-bounce" : ""}
                        />
                      )}
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* Progress */}
        {cardDesign.showProgress && (
          <div className="mb-4">
            <div className="flex justify-between text-xs opacity-75 mb-2">
              <span>1 / {stampCardData.stampsRequired} stamps</span>
              <span>
                {Math.round((1 / stampCardData.stampsRequired) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: cardDesign.accentColor,
                  width: `${(1 / stampCardData.stampsRequired) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Reward */}
        <div
          className="rounded-lg p-3 border-2 text-center relative overflow-hidden"
          style={{
            backgroundColor: cardDesign.accentColor + "10",
            borderColor: cardDesign.accentColor + "40",
          }}
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="text-lg">🎁</span>
            <h4
              className="font-bold text-sm"
              style={{ color: cardDesign.accentColor }}
            >
              Your Reward
            </h4>
          </div>
          <p
            className="font-semibold text-xs"
            style={{ color: cardDesign.textColor }}
          >
            {stampCardData.rewardDescription}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading loyalty program...</p>
        </div>
      </div>
    );
  }

  if (step === "error" || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Invalid QR Code</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Please make sure you're scanning a valid LOYO loyalty program QR
              code.
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
            >
              Go to LOYO Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Welcome Step */}
        {step === "welcome" && stampCardData && (
          <div className="space-y-6">
            {/* Welcome Header */}
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to {stampCardData.businessName}!
              </h1>
              <p className="text-gray-600">
                Join our loyalty program powered by{" "}
                <span className="font-semibold text-blue-600">LOYO</span>
              </p>
            </div>

            {/* Business Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {stampCardData.businessAddress}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">
                    Collect {stampCardData.stampsRequired} stamps to earn:{" "}
                    {stampCardData.rewardDescription}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Stamp Card Preview */}
            <div className="relative">
              {renderStampCard()}
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 animate-bounce">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={() => setStep("registration")}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-3 text-lg font-semibold"
            >
              Request Your First Stamp
            </Button>
          </div>
        )}

        {/* Registration Step */}
        {step === "registration" && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <User className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Quick Registration
              </h2>
              <p className="text-gray-600 text-sm">
                Just a few details to get your first stamp
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <Input
                    value={customerData.name}
                    onChange={(e) =>
                      setCustomerData({ ...customerData, name: e.target.value })
                    }
                    placeholder="Your full name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={customerData.email}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        email: e.target.value,
                      })
                    }
                    placeholder="your@email.com"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <Input
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        phone: e.target.value,
                      })
                    }
                    placeholder="+61 xxx xxx xxx"
                    className="w-full"
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-xs text-blue-800">
                      <p className="font-medium mb-1">Privacy Protected</p>
                      <p>
                        Your contact details will not be shared with the shop
                        owner.
                        <button
                          onClick={() => setShowPrivacyInfo(true)}
                          className="underline hover:no-underline ml-1"
                        >
                          Learn more
                        </button>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleRegistration}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Requesting First Stamp...
                      </>
                    ) : (
                      "Request First Stamp"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => setStep("welcome")}
              variant="outline"
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}

        {/* Requesting Step */}
        {step === "requesting" && (
          <div className="space-y-6 text-center py-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-yellow-600 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Stamp Request Sent!
            </h2>
            <p className="text-gray-600">
              We've notified {stampCardData?.businessName} about your first
              stamp request. They'll approve it shortly.
            </p>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>What happens next:</strong>
              </p>
              <div className="text-left space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Business owner receives notification</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>They approve your first stamp</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>You'll be invited to join LOYO wallet</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Request ID: {stampRequestId?.slice(-8)}
            </p>
          </div>
        )}

        {/* Privacy Info Dialog */}
        <Dialog open={showPrivacyInfo} onOpenChange={setShowPrivacyInfo}>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Privacy & Data Protection
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>LOYO is committed to protecting your privacy:</strong>
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Your contact details are encrypted and secure</li>
                <li>Business owners only see your first name</li>
                <li>We comply with Australian Privacy Principles</li>
                <li>You can delete your data anytime</li>
                <li>No spam or unwanted marketing</li>
              </ul>
              <p className="text-xs text-gray-500">
                By continuing, you agree to LOYO's Privacy Policy and Terms of
                Service.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

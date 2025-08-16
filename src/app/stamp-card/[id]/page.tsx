"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";
import { QrCode, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface StampCard {
  id: string;
  name: string;
  description?: string;
  stamps_required: number;
  reward_description: string;
  background_color?: string;
  is_active: boolean;
  business_id: string;
}

interface Business {
  id: string;
  business_name: string;
  logo_url?: string;
}

export default function StampCardView() {
  const params = useParams();
  const [stampCard, setStampCard] = useState<StampCard | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStampCard = async () => {
      if (!params.id) return;

      const supabase = createClient();

      try {
        // Fetch stamp card
        const { data: cardData, error: cardError } = await supabase
          .from("stamp_cards")
          .select("*")
          .eq("id", params.id)
          .single();

        if (cardError) {
          setError("Stamp card not found");
          setLoading(false);
          return;
        }

        setStampCard(cardData);

        // Fetch business info
        const { data: businessData, error: businessError } = await supabase
          .from("businesses")
          .select("*")
          .eq("id", cardData.business_id)
          .single();

        if (!businessError) {
          setBusiness(businessData);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load stamp card");
        setLoading(false);
      }
    };

    fetchStampCard();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stamp card...</p>
        </div>
      </div>
    );
  }

  if (error || !stampCard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Stamp Card Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The stamp card you're looking for doesn't exist."}
          </p>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Stamp Card Preview
          </h1>
        </div>

        {/* Stamp Card Display */}
        <div className="max-w-md mx-auto">
          <div
            className="bg-white rounded-2xl shadow-lg p-8 border-2"
            style={{
              backgroundColor: stampCard.background_color || "#ffffff",
              borderColor: stampCard.background_color || "#e5e7eb",
            }}
          >
            {/* Business Info */}
            <div className="text-center mb-6">
              {business?.logo_url ? (
                <img
                  src={business.logo_url}
                  alt={business.business_name}
                  className="w-16 h-16 rounded-lg mx-auto mb-4 object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">
                    {business?.business_name?.charAt(0) || "B"}
                  </span>
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {business?.business_name}
              </h2>
              <h3 className="text-lg font-semibold text-gray-800">
                {stampCard.name}
              </h3>
              {stampCard.description && (
                <p className="text-sm text-gray-600 mt-2">
                  {stampCard.description}
                </p>
              )}
            </div>

            {/* Stamp Grid */}
            <div className="mb-6">
              <div className="grid grid-cols-5 gap-3 justify-center">
                {Array.from(
                  { length: stampCard.stamps_required },
                  (_, index) => {
                    const filled =
                      index < Math.floor(stampCard.stamps_required * 0.6);
                    const stampBaseStyle = {
                      width: 48,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: filled
                        ? `2px solid ${(stampCard as any).accent_color || "#3b82f6"}`
                        : `2px solid #e5e7eb`,
                      backgroundColor: filled
                        ? ((stampCard as any).accent_color || "#3b82f6") + "20"
                        : "transparent",
                      borderRadius:
                        (stampCard as any).stamp_base_shape === "circle"
                          ? "50%"
                          : (stampCard as any).stamp_base_shape ===
                              "rounded-square"
                            ? "8px"
                            : "50%",
                    };

                    return (
                      <div key={index} style={stampBaseStyle}>
                        {filled &&
                          (stampCard as any).stamp_shape === "emoji" && (
                            <span style={{ fontSize: "24px" }}>
                              {(stampCard as any).selected_emoji || "⭐"}
                            </span>
                          )}
                        {filled &&
                          (stampCard as any).stamp_shape === "custom" &&
                          (stampCard as any).custom_stamp_image && (
                            <img
                              src={(stampCard as any).custom_stamp_image}
                              alt="Custom stamp"
                              style={{
                                width: "32px",
                                height: "32px",
                                objectFit: "contain",
                              }}
                            />
                          )}
                        {!filled && (
                          <span className="text-xs text-gray-400">
                            {index + 1}
                          </span>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {(stampCard as any).show_progress !== false && (
              <div className="mb-4">
                <div className="flex justify-between text-sm opacity-75 mb-2">
                  <span>
                    {Math.floor(stampCard.stamps_required * 0.6)} /{" "}
                    {stampCard.stamps_required} stamps
                  </span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        (stampCard as any).accent_color || "#3b82f6",
                      width: "60%",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Reward Info */}
            <div
              className="rounded-lg p-4 border-2 text-center relative overflow-hidden mb-6"
              style={{
                backgroundColor:
                  ((stampCard as any).accent_color || "#3b82f6") + "10",
                borderColor:
                  ((stampCard as any).accent_color || "#3b82f6") + "40",
              }}
            >
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  background: `linear-gradient(45deg, ${(stampCard as any).accent_color || "#3b82f6"}, transparent)`,
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">🎁</span>
                  <h4
                    className="font-bold text-lg"
                    style={{
                      color: (stampCard as any).accent_color || "#3b82f6",
                    }}
                  >
                    Your Reward
                  </h4>
                </div>
                <p
                  className="font-semibold text-base"
                  style={{ color: (stampCard as any).text_color || "#1f2937" }}
                >
                  {stampCard.reward_description}
                </p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="text-center space-y-3">
              <Link
                href={`/qr-onboarding/${stampCard.id}?businessId=${stampCard.business_id}`}
                className="w-full text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 mb-2 transition-colors"
                style={{
                  backgroundColor: (stampCard as any).accent_color || "#3b82f6",
                }}
                onClick={() => {
                  // Track QR scan analytics
                  fetch("/api/qr-scan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      scanType: "qr_scan_stamp_card",
                      businessId: stampCard.business_id,
                      stampCardId: stampCard.id,
                      source: "stamp_card_view",
                    }),
                  }).catch(console.error);
                }}
              >
                <QrCode className="w-5 h-5" />
                Scan QR Code
              </Link>
              <p className="text-xs text-gray-500">Tap to collect stamps</p>

              {/* Customer App Link */}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">
                  Access your digital wallet:
                </p>
                <a
                  href={`https://customer.loyo.app/qr/${stampCard.id}?businessId=${stampCard.business_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Open in Customer App
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Card Info */}
        <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Card Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Stamps Required:</span>
              <span className="font-medium">{stampCard.stamps_required}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span
                className={`font-medium ${stampCard.is_active ? "text-green-600" : "text-red-600"}`}
              >
                {stampCard.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Card ID:</span>
              <span className="font-mono text-xs">{stampCard.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

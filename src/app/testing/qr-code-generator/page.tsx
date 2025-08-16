"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "../../../../supabase/client";
import QRCode from "qrcode";
import { Copy, Download, RefreshCw } from "lucide-react";

interface Business {
  id: string;
  business_name: string;
  qr_code_data?: any;
}

interface StampCard {
  id: string;
  name: string;
  business_id: string;
}

export default function QRCodeGeneratorTesting() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [stampCards, setStampCards] = useState<StampCard[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [selectedStampCardId, setSelectedStampCardId] = useState("");
  const [customBusinessId, setCustomBusinessId] = useState("");
  const [customStampCardId, setCustomStampCardId] = useState("");
  const [qrCodes, setQrCodes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  const CUSTOMER_DOMAIN = "https://customer.loyo.app";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const supabase = createClient();

    try {
      // Fetch businesses
      const { data: businessData } = await supabase
        .from("businesses")
        .select("id, business_name, qr_code_data")
        .limit(10);

      // Fetch stamp cards
      const { data: stampCardData } = await supabase
        .from("stamp_cards")
        .select("id, name, business_id")
        .eq("is_active", true)
        .limit(10);

      setBusinesses(businessData || []);
      setStampCards(stampCardData || []);

      if (businessData && businessData.length > 0) {
        setSelectedBusinessId(businessData[0].id);
      }

      if (stampCardData && stampCardData.length > 0) {
        setSelectedStampCardId(stampCardData[0].id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (url: string, key: string) => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      setQrCodes((prev) => ({ ...prev, [key]: qrCodeDataUrl }));
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const generateBusinessQR = () => {
    const businessId = selectedBusinessId || customBusinessId;
    if (!businessId) return;

    const url = `${CUSTOMER_DOMAIN}/qr/${businessId}`;
    generateQRCode(url, "business");
  };

  const generateStampCardQR = () => {
    const stampCardId = selectedStampCardId || customStampCardId;
    const businessId = selectedBusinessId || customBusinessId;

    if (!stampCardId || !businessId) return;

    const url = `${CUSTOMER_DOMAIN}/qr/${stampCardId}?businessId=${businessId}`;
    generateQRCode(url, "stampCard");
  };

  const generateCompletedCardQR = () => {
    const stampCardId = selectedStampCardId || customStampCardId;
    const businessId = selectedBusinessId || customBusinessId;

    if (!stampCardId || !businessId) return;

    const url = `${CUSTOMER_DOMAIN}/qr/${stampCardId}?businessId=${businessId}&status=completed`;
    generateQRCode(url, "completed");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const downloadQR = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading testing interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            QR Code Generator - Testing Interface
          </h1>
          <p className="text-gray-600">
            Generate and test different types of QR codes for the customer
            scanning system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Existing Business</Label>
                  <select
                    value={selectedBusinessId}
                    onChange={(e) => setSelectedBusinessId(e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                  >
                    <option value="">Select a business...</option>
                    {businesses.map((business) => (
                      <option key={business.id} value={business.id}>
                        {business.business_name} ({business.id.slice(0, 8)}...)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="custom-business-id">
                    Or Enter Custom Business ID
                  </Label>
                  <Input
                    id="custom-business-id"
                    value={customBusinessId}
                    onChange={(e) => setCustomBusinessId(e.target.value)}
                    placeholder="550e8400-e29b-41d4-a716-446655440000"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stamp Card Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Existing Stamp Card</Label>
                  <select
                    value={selectedStampCardId}
                    onChange={(e) => setSelectedStampCardId(e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                  >
                    <option value="">Select a stamp card...</option>
                    {stampCards.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.name} ({card.id.slice(0, 8)}...)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="custom-stamp-card-id">
                    Or Enter Custom Stamp Card ID
                  </Label>
                  <Input
                    id="custom-stamp-card-id"
                    value={customStampCardId}
                    onChange={(e) => setCustomStampCardId(e.target.value)}
                    placeholder="abc123-def456"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generate QR Codes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={generateBusinessQR} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Business QR Code
                </Button>

                <Button
                  onClick={generateStampCardQR}
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Stamp Card QR Code
                </Button>

                <Button
                  onClick={generateCompletedCardQR}
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Completed Card QR Code
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* QR Code Display */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Generated QR Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="business" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="business">Business</TabsTrigger>
                    <TabsTrigger value="stampCard">Stamp Card</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>

                  <TabsContent value="business" className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold mb-2">Business QR Code</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        For new customers to join loyalty program
                      </p>

                      {qrCodes.business ? (
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg border inline-block">
                            <img
                              src={qrCodes.business}
                              alt="Business QR Code"
                              className="w-48 h-48"
                            />
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs text-gray-500 break-all">
                              {`${CUSTOMER_DOMAIN}/qr/${selectedBusinessId || customBusinessId}`}
                            </p>

                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  copyToClipboard(
                                    `${CUSTOMER_DOMAIN}/qr/${selectedBusinessId || customBusinessId}`,
                                  )
                                }
                              >
                                <Copy className="w-4 h-4 mr-1" />
                                Copy URL
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  downloadQR(
                                    qrCodes.business,
                                    "business-qr.png",
                                  )
                                }
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          Generate a business QR code to see it here
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="stampCard" className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold mb-2">Stamp Card QR Code</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        For existing customers with stamp cards
                      </p>

                      {qrCodes.stampCard ? (
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg border inline-block">
                            <img
                              src={qrCodes.stampCard}
                              alt="Stamp Card QR Code"
                              className="w-48 h-48"
                            />
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs text-gray-500 break-all">
                              {`${CUSTOMER_DOMAIN}/qr/${selectedStampCardId || customStampCardId}?businessId=${selectedBusinessId || customBusinessId}`}
                            </p>

                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  copyToClipboard(
                                    `${CUSTOMER_DOMAIN}/qr/${selectedStampCardId || customStampCardId}?businessId=${selectedBusinessId || customBusinessId}`,
                                  )
                                }
                              >
                                <Copy className="w-4 h-4 mr-1" />
                                Copy URL
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  downloadQR(
                                    qrCodes.stampCard,
                                    "stamp-card-qr.png",
                                  )
                                }
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          Generate a stamp card QR code to see it here
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold mb-2">
                        Completed Card QR Code
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        For completed stamp cards ready for redemption
                      </p>

                      {qrCodes.completed ? (
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg border inline-block">
                            <img
                              src={qrCodes.completed}
                              alt="Completed Card QR Code"
                              className="w-48 h-48"
                            />
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs text-gray-500 break-all">
                              {`${CUSTOMER_DOMAIN}/qr/${selectedStampCardId || customStampCardId}?businessId=${selectedBusinessId || customBusinessId}&status=completed`}
                            </p>

                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  copyToClipboard(
                                    `${CUSTOMER_DOMAIN}/qr/${selectedStampCardId || customStampCardId}?businessId=${selectedBusinessId || customBusinessId}&status=completed`,
                                  )
                                }
                              >
                                <Copy className="w-4 h-4 mr-1" />
                                Copy URL
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  downloadQR(
                                    qrCodes.completed,
                                    "completed-card-qr.png",
                                  )
                                }
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          Generate a completed card QR code to see it here
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

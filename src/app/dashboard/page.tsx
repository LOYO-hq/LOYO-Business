"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import {
  Plus,
  QrCode,
  Users,
  BarChart3,
  Award,
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  Printer,
  Mail,
  MessageCircle,
  Copy,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { createClient } from "../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchPendingStampRequests,
  approveStampRequest,
  denyStampRequest,
} from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface Business {
  id: string;
  business_name: string;
  logo_url?: string;
  user_id: string;
}

interface StampCard {
  id: string;
  name: string;
  description?: string;
  stamps_required: number;
  reward_description: string;
  background_color?: string;
  text_color?: string;
  accent_color?: string;
  stamp_shape?: string;
  selected_emoji?: string;
  custom_stamp_image?: string;
  layout?: string;
  font_size?: string;
  show_logo?: boolean;
  show_progress?: boolean;
  stamp_base_shape?: string;
  is_active: boolean;
}

interface Customer {
  id: string;
  business_id: string;
}

interface StampTransaction {
  id: string;
  transaction_type: string;
  created_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [stampCards, setStampCards] = useState<StampCard[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stampTransactions, setStampTransactions] = useState<
    StampTransaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<StampCard | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    stamps_required: 10,
    reward_description: "",
    background_color: "#ffffff",
    text_color: "#1f2937",
    accent_color: "#3b82f6",
    stamp_base_shape: "circle",
    stamp_shape: "emoji",
    selected_emoji: "⭐",
    custom_stamp_image: "",
    qr_button_color: "#ea580c",
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [showQRRegenerateDialog, setShowQRRegenerateDialog] = useState(false);
  const [regeneratingQR, setRegeneratingQR] = useState(false);
  const [revisionNumber, setRevisionNumber] = useState<number>(1);
  const [qrCodeType, setQrCodeType] = useState<"business" | "stamp_card">(
    "stamp_card",
  );
  const [businessQrCodeUrl, setBusinessQrCodeUrl] = useState<string>("");
  const [pendingStampRequests, setPendingStampRequests] = useState<any[]>([]);
  const [showPendingRequests, setShowPendingRequests] = useState(false);

  const fetchData = async () => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/sign-in");
      return;
    }

    // Check if user has a business registered
    const { data: businessData } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!businessData) {
      router.push("/business-registration");
      return;
    }

    setBusiness(businessData);

    // Fetch dashboard data
    const { data: stampCardsData } = await supabase
      .from("stamp_cards")
      .select("*")
      .eq("business_id", businessData.id)
      .eq("is_active", true);

    // Fetch customers from both tables
    const { customers: allCustomers } = await fetchAllCustomers(
      businessData.id,
    );

    // Fetch stamp requests from both tables
    const { data: legacyStampRequests } = await supabase
      .from("stamp_requests")
      .select("*")
      .eq("business_id", businessData.id)
      .order("requested_at", { ascending: false })
      .limit(5);

    const { data: loyoStampRequests } = await supabase
      .from("loyo_stamp_requests")
      .select("*")
      .eq("business_id", businessData.id)
      .order("requested_at", { ascending: false })
      .limit(5);

    // Combine and sort all stamp requests
    let allStampRequests: any[] = [];
    if (legacyStampRequests) {
      allStampRequests = [...allStampRequests, ...legacyStampRequests];
    }
    if (loyoStampRequests) {
      allStampRequests = [...allStampRequests, ...loyoStampRequests];
    }

    allStampRequests.sort((a, b) => {
      const dateA = new Date(a.requested_at || a.created_at).getTime();
      const dateB = new Date(b.requested_at || b.created_at).getTime();
      return dateB - dateA;
    });

    setStampCards(stampCardsData || []);
    setCustomers(allCustomers || []);
    setStampTransactions(allStampRequests.slice(0, 10) || []);

    // Fetch pending stamp requests
    const pendingRequests = await fetchPendingStampRequests(businessData.id);
    setPendingStampRequests(pendingRequests);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const generateQRCode = async (
    cardId: string,
    qrType: "business" | "stamp_card" = "stamp_card",
  ) => {
    try {
      let qrData: string;

      // Smart QR Code that handles both new and existing customers
      qrData = `https://0d8e131a-3b25-4f95-9361-e5af017049f5.tempo.build/customer-onboarding/${cardId}?businessId=${business?.id}`;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      const qrImage = new Image();
      qrImage.crossOrigin = "anonymous";

      return new Promise<string>((resolve) => {
        qrImage.onload = async () => {
          canvas.width = 256;
          canvas.height = 256;

          ctx?.drawImage(qrImage, 0, 0, 256, 256);

          const logoImage = new Image();
          logoImage.crossOrigin = "anonymous";
          logoImage.onload = () => {
            if (ctx) {
              const logoSize = 40;
              const logoX = (256 - logoSize) / 2;
              const logoY = (256 - logoSize) / 2;

              ctx.fillStyle = "#ffffff";
              ctx.fillRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8);

              ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
            }
            resolve(canvas.toDataURL());
          };
          logoImage.onerror = () => resolve(qrCodeDataUrl);
          // Use business logo if available, otherwise use new LOYO logo (slightly larger)
          logoImage.src = business.logo_url || "/images/loyo-icon-new.png";
        };
        qrImage.src = qrCodeDataUrl;
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      return "";
    }
  };

  const handleViewCard = async (card: StampCard) => {
    setSelectedCard(card);
    const qrCode = await generateQRCode(card.id, "stamp_card");
    setQrCodeUrl(qrCode);
    setViewDialogOpen(true);
  };

  const handleEditCard = (card: StampCard) => {
    setSelectedCard(card);
    setEditFormData({
      name: card.name || "",
      description: card.description || "",
      stamps_required: card.stamps_required || 10,
      reward_description: card.reward_description || "",
      background_color: card.background_color || "#ffffff",
      text_color: card.text_color || "#1f2937",
      accent_color: card.accent_color || "#3b82f6",
      stamp_base_shape: card.stamp_base_shape || "circle",
      stamp_shape: card.stamp_shape || "emoji",
      selected_emoji: card.selected_emoji || "⭐",
      custom_stamp_image: card.custom_stamp_image || "",
      qr_button_color: (card as any).qr_button_color || "#ea580c",
      is_active: card.is_active ?? true,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedCard) return;

    setSaving(true);
    const supabase = createClient();

    try {
      const { error: updateError } = await supabase
        .from("stamp_cards")
        .update({
          name: editFormData.name,
          description: editFormData.description,
          stamps_required: editFormData.stamps_required,
          reward_description: editFormData.reward_description,
          background_color: editFormData.background_color,
          text_color: editFormData.text_color,
          accent_color: editFormData.accent_color,
          stamp_base_shape: editFormData.stamp_base_shape,
          stamp_shape: editFormData.stamp_shape,
          selected_emoji: editFormData.selected_emoji,
          custom_stamp_image: editFormData.custom_stamp_image || null,
          qr_button_color: editFormData.qr_button_color,
          is_active: editFormData.is_active,
        })
        .eq("id", selectedCard.id);

      if (updateError) {
        throw updateError;
      }

      setEditDialogOpen(false);
      await fetchData(); // Refresh the data
    } catch (err) {
      console.error("Error updating stamp card:", err);
      alert("Failed to update stamp card");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this stamp card? This action cannot be undone.",
      )
    ) {
      return;
    }

    const supabase = createClient();

    try {
      const { error: deleteError } = await supabase
        .from("stamp_cards")
        .delete()
        .eq("id", cardId);

      if (deleteError) {
        throw deleteError;
      }

      await fetchData(); // Refresh the data
    } catch (err) {
      console.error("Error deleting stamp card:", err);
      alert("Failed to delete stamp card");
    }
  };

  const handlePrintQR = () => {
    if (qrCodeUrl && selectedCard) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print QR Code - ${selectedCard.name}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 20px;
                }
                .qr-container {
                  max-width: 400px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 2px solid #000;
                }
                img { max-width: 100%; }
                h2 { margin-bottom: 10px; }
                p { margin: 5px 0; }
              </style>
            </head>
            <body>
              <div class="qr-container">
                <h2>${selectedCard.name}</h2>
                <p>${selectedCard.description}</p>
                <img src="${qrCodeUrl}" alt="QR Code" />
                <p><strong>Scan to collect stamps!</strong></p>
                <p>Collect ${selectedCard.stamps_required} stamps to earn: ${selectedCard.reward_description}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleShareQR = (platform: string) => {
    if (!selectedCard) return;

    const shareText = `Check out ${selectedCard.name}! Collect ${selectedCard.stamps_required} stamps to earn: ${selectedCard.reward_description}`;
    const shareUrl = `https://0d8e131a-3b25-4f95-9361-e5af017049f5.tempo.build/customer-onboarding/${selectedCard.id}?businessId=${business?.id}`;

    switch (platform) {
      case "email":
        window.open(
          `mailto:?subject=${encodeURIComponent(selectedCard.name)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`,
        );
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
        break;
      default:
        break;
    }
  };

  if (!business) {
    return null;
  }

  const totalStampsAwarded =
    stampTransactions?.filter((t) => t.status === "approved").length || 0;
  const totalRewardsRedeemed = 0; // Will be implemented when reward redemption is added

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {business.logo_url ? (
                  <img
                    src={business.logo_url}
                    alt="Business Logo"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">L</span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Manage your loyalty programs and customer engagement
                </p>
              </div>
            </div>
            <Link href="/dashboard/create-card">
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Create New Card
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Cards
                </CardTitle>
                <QrCode className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stampCards?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active loyalty programs
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customers?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Registered customers
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Stamps Awarded
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStampsAwarded}</div>
                <p className="text-xs text-muted-foreground">
                  Total stamps given
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Rewards Redeemed
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRewardsRedeemed}</div>
                <p className="text-xs text-muted-foreground">Rewards claimed</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stamp Cards Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Stamp Cards</CardTitle>
                  <CardDescription>
                    Manage your active loyalty programs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stampCards && stampCards.length > 0 ? (
                      stampCards.map((card) => (
                        <div
                          key={card.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center"
                                style={{
                                  backgroundColor:
                                    card.background_color || "#3B82F6",
                                }}
                              >
                                <QrCode className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{card.name}</h3>
                                <p className="text-sm text-gray-600">
                                  {card.description ||
                                    `Collect ${card.stamps_required} stamps`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={async () => {
                                        const qrCode = await generateQRCode(
                                          card.id,
                                        );
                                        setQrCodeUrl(qrCode);
                                        setSelectedCard(card);
                                        setShowQRRegenerateDialog(true);
                                      }}
                                      className="bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200"
                                    >
                                      <QrCode className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Generate new QR code</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleViewCard(card)}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View stamp card</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditCard(card)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit stamp card</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteCard(card.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete stamp card</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {card.reward_description}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {card.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No stamp cards yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Create your first loyalty program to get started
                        </p>
                        <Link href="/dashboard/create-card">
                          <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg font-semibold">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Card
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start py-2 px-3"
                    variant="outline"
                    onClick={() => setShowPendingRequests(true)}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Award Stamps
                    {pendingStampRequests.length > 0 && (
                      <Badge className="ml-2 bg-red-500 text-white">
                        {pendingStampRequests.length}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    className="w-full justify-start py-2 px-3"
                    variant="outline"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Redeem Rewards
                  </Button>
                  <Link href="/dashboard/customers">
                    <Button
                      className="w-full justify-start py-2 px-3"
                      variant="outline"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      View Customers
                    </Button>
                  </Link>
                  <Button
                    className="w-full justify-start py-2 px-3"
                    variant="outline"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stampTransactions && stampTransactions.length > 0 ? (
                      stampTransactions.slice(0, 4).map((request) => {
                        const isApproved = request.status === "approved";
                        const timeAgo = new Date(
                          request.requested_at || request.created_at,
                        ).toLocaleDateString();
                        return (
                          <div
                            key={request.id}
                            className="flex items-center gap-3 text-sm"
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                isApproved
                                  ? "bg-green-500"
                                  : request.status === "pending"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            ></div>
                            <span className="text-gray-600">
                              {isApproved
                                ? "Stamp approved"
                                : request.status === "pending"
                                  ? "Stamp pending"
                                  : "Stamp denied"}
                            </span>
                            <span className="text-xs text-gray-400 ml-auto">
                              {timeAgo}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500 text-sm">
                          No recent activity yet
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* View Card Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-center">
                Card Saved Successfully!
              </DialogTitle>
            </DialogHeader>
            {selectedCard && (
              <div className="space-y-6">
                {/* Card Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{selectedCard.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedCard.description}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>Stamps Required:</span>
                    <span className="font-medium">
                      {selectedCard.stamps_required}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Reward:</span>
                    <span className="font-medium">
                      {selectedCard.reward_description}
                    </span>
                  </div>
                </div>

                {/* QR Code Display */}
                {qrCodeUrl && (
                  <div className="text-center">
                    <p className="text-sm font-medium mb-3">Smart QR Code:</p>
                    <div className="bg-white p-4 rounded-lg border inline-block">
                      <img
                        src={qrCodeUrl}
                        alt="Smart QR Code"
                        className="w-32 h-32 mx-auto"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Automatically detects new vs existing customers
                    </p>
                    <p className="text-xs text-gray-400 mt-1 break-all">
                      {`https://0d8e131a-3b25-4f95-9361-e5af017049f5.tempo.build/customer-onboarding/${selectedCard?.id}?businessId=${business?.id}`}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handlePrintQR}
                    className="w-full"
                    variant="outline"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print QR Code
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleShareQR("email")}
                      variant="outline"
                      size="sm"
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </Button>
                    <Button
                      onClick={() => handleShareQR("whatsapp")}
                      variant="outline"
                      size="sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      WhatsApp
                    </Button>
                  </div>

                  <Button
                    onClick={() => handleShareQR("copy")}
                    variant="outline"
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setViewDialogOpen(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Card Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl mx-auto">
            <DialogHeader>
              <DialogTitle>Edit Stamp Card</DialogTitle>
            </DialogHeader>
            {selectedCard && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Edit Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Card Name</Label>
                    <Input
                      id="edit-name"
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter card name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="edit-description"
                      value={editFormData.description}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter card description"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-stamps-required">
                      Stamps Required
                    </Label>
                    <Input
                      id="edit-stamps-required"
                      type="number"
                      min="1"
                      max="20"
                      value={editFormData.stamps_required}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          stamps_required: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-reward-description">
                      Reward Description
                    </Label>
                    <Textarea
                      id="edit-reward-description"
                      value={editFormData.reward_description}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          reward_description: e.target.value,
                        })
                      }
                      placeholder="Describe the reward customers will receive"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-background-color">
                      Background Color
                    </Label>
                    <div className="flex gap-2">
                      <input
                        id="edit-background-color"
                        type="color"
                        value={editFormData.background_color}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            background_color: e.target.value,
                          })
                        }
                        className="w-16 h-10 rounded border cursor-pointer"
                      />
                      <Input
                        value={editFormData.background_color}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            background_color: e.target.value,
                          })
                        }
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-text-color">Text Color</Label>
                    <div className="flex gap-2">
                      <input
                        id="edit-text-color"
                        type="color"
                        value={editFormData.text_color}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            text_color: e.target.value,
                          })
                        }
                        className="w-16 h-10 rounded border cursor-pointer"
                      />
                      <Input
                        value={editFormData.text_color}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            text_color: e.target.value,
                          })
                        }
                        placeholder="#1f2937"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-accent-color">Accent Color</Label>
                    <div className="flex gap-2">
                      <input
                        id="edit-accent-color"
                        type="color"
                        value={editFormData.accent_color}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            accent_color: e.target.value,
                          })
                        }
                        className="w-16 h-10 rounded border cursor-pointer"
                      />
                      <Input
                        value={editFormData.accent_color}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            accent_color: e.target.value,
                          })
                        }
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-qr-button-color">
                      QR Button Color
                    </Label>
                    <div className="flex gap-2">
                      <input
                        id="edit-qr-button-color"
                        type="color"
                        value={editFormData.qr_button_color}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            qr_button_color: e.target.value,
                          })
                        }
                        className="w-16 h-10 rounded border cursor-pointer"
                      />
                      <Input
                        value={editFormData.qr_button_color}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            qr_button_color: e.target.value,
                          })
                        }
                        placeholder="#ea580c"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-stamp-base-shape">
                      Stamp Base Shape
                    </Label>
                    <select
                      id="edit-stamp-base-shape"
                      value={editFormData.stamp_base_shape}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          stamp_base_shape: e.target.value as any,
                        })
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="circle">Circle</option>
                      <option value="rounded-square">Rounded Square</option>
                      <option value="hexagon">Hexagon</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-stamp-shape">Stamp Content</Label>
                    <select
                      id="edit-stamp-shape"
                      value={editFormData.stamp_shape}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          stamp_shape: e.target.value as any,
                        })
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="emoji">Emoji</option>
                      <option value="custom">Custom Image</option>
                    </select>
                  </div>

                  {editFormData.stamp_shape === "emoji" && (
                    <div className="space-y-2">
                      <Label>Choose Emoji</Label>
                      <div className="grid grid-cols-5 gap-2 max-h-24 overflow-y-auto border rounded p-2">
                        {[
                          "⭐",
                          "❤️",
                          "☕",
                          "🍕",
                          "🍔",
                          "🍰",
                          "🎯",
                          "💎",
                          "🏆",
                          "🎁",
                          "✂️",
                          "🔧",
                          "🚗",
                          "🦴",
                          "🌸",
                        ].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() =>
                              setEditFormData({
                                ...editFormData,
                                selected_emoji: emoji,
                              })
                            }
                            className={`p-2 text-lg rounded hover:bg-gray-100 transition-colors ${
                              editFormData.selected_emoji === emoji
                                ? "bg-blue-100 ring-2 ring-blue-500"
                                : ""
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {editFormData.stamp_shape === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="edit-custom-image">
                        Custom Stamp Image
                      </Label>
                      <Input
                        id="edit-custom-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 1024 * 1024) {
                              alert("File size must be less than 1MB");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              setEditFormData({
                                ...editFormData,
                                custom_stamp_image: result,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="cursor-pointer"
                      />
                      {editFormData.custom_stamp_image && (
                        <div className="flex items-center gap-3">
                          <img
                            src={editFormData.custom_stamp_image}
                            alt="Custom stamp preview"
                            className="w-12 h-12 object-contain border rounded"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setEditFormData({
                                ...editFormData,
                                custom_stamp_image: "",
                                stamp_shape: "emoji",
                              })
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-is-active"
                      checked={editFormData.is_active}
                      onCheckedChange={(checked) =>
                        setEditFormData({ ...editFormData, is_active: checked })
                      }
                    />
                    <Label htmlFor="edit-is-active">Card is active</Label>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Preview</h3>
                  <div className="max-w-sm mx-auto">
                    <div
                      className="bg-white rounded-2xl shadow-lg p-6 border-2"
                      style={{
                        backgroundColor:
                          selectedCard?.background_color ||
                          editFormData.background_color,
                        borderColor:
                          (selectedCard?.background_color ||
                            editFormData.background_color) !== "#ffffff"
                            ? selectedCard?.background_color ||
                              editFormData.background_color
                            : "#e5e7eb",
                        color: editFormData.text_color,
                      }}
                    >
                      <div className="text-center mb-4">
                        {selectedCard?.show_logo && business?.logo_url && (
                          <img
                            src={business.logo_url}
                            alt="Business Logo"
                            className="w-12 h-12 rounded-lg object-cover mx-auto mb-3"
                          />
                        )}
                        <h3 className="text-lg font-semibold">
                          {editFormData.name || "Card Name"}
                        </h3>
                        {editFormData.description && (
                          <p className="text-sm opacity-75 mt-1">
                            {editFormData.description}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="grid grid-cols-5 gap-2 justify-center">
                          {Array.from(
                            { length: editFormData.stamps_required },
                            (_, index) => {
                              const filled =
                                index <
                                Math.floor(editFormData.stamps_required * 0.6);
                              const stampBaseStyle = {
                                width: 32,
                                height: 32,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: filled
                                  ? `2px solid ${editFormData.accent_color}`
                                  : `2px solid #e5e7eb`,
                                backgroundColor: filled
                                  ? editFormData.accent_color + "20"
                                  : "transparent",
                                borderRadius:
                                  editFormData.stamp_base_shape === "circle"
                                    ? "50%"
                                    : editFormData.stamp_base_shape ===
                                        "rounded-square"
                                      ? "8px"
                                      : editFormData.stamp_base_shape ===
                                          "hexagon"
                                        ? "0"
                                        : "50%",
                                clipPath:
                                  editFormData.stamp_base_shape === "hexagon"
                                    ? "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
                                    : "none",
                              };

                              return (
                                <div key={index} style={stampBaseStyle}>
                                  {filled &&
                                    editFormData.stamp_shape === "emoji" && (
                                      <span style={{ fontSize: "16px" }}>
                                        {editFormData.selected_emoji}
                                      </span>
                                    )}
                                  {filled &&
                                    editFormData.stamp_shape === "custom" &&
                                    editFormData.custom_stamp_image && (
                                      <img
                                        src={editFormData.custom_stamp_image}
                                        alt="Custom stamp"
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                          objectFit: "contain",
                                        }}
                                      />
                                    )}
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>

                      {selectedCard?.show_progress && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs opacity-75 mb-2">
                            <span>
                              {Math.floor(editFormData.stamps_required * 0.6)} /{" "}
                              {editFormData.stamps_required} stamps
                            </span>
                            <span>60%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                backgroundColor: editFormData.accent_color,
                                width: "60%",
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div
                        className="rounded-lg p-3 border-2 text-center relative overflow-hidden mb-4"
                        style={{
                          backgroundColor: editFormData.accent_color + "10",
                          borderColor: editFormData.accent_color + "40",
                        }}
                      >
                        <div
                          className="absolute inset-0 opacity-5"
                          style={{
                            background: `linear-gradient(45deg, ${editFormData.accent_color}, transparent)`,
                          }}
                        />
                        <div className="relative z-10">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <span className="text-lg">🎁</span>
                            <h4
                              className="font-bold text-sm"
                              style={{
                                color: editFormData.accent_color,
                              }}
                            >
                              Your Reward
                            </h4>
                          </div>
                          <p
                            className="font-semibold text-xs"
                            style={{
                              color: editFormData.accent_color,
                            }}
                          >
                            {editFormData.reward_description ||
                              "Reward description"}
                          </p>
                        </div>
                      </div>

                      {/* QR Code Section */}
                      <div className="text-center">
                        <button
                          className="w-full text-white font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 mb-2 transition-colors text-sm"
                          style={{
                            backgroundColor: editFormData.qr_button_color,
                          }}
                        >
                          <QrCode className="w-4 h-4" />
                          Scan QR Code
                        </button>
                        <p className="text-xs text-gray-500">
                          Tap to collect stamps
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={() => setEditDialogOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* QR Code Regeneration Dialog */}
        <Dialog
          open={showQRRegenerateDialog}
          onOpenChange={setShowQRRegenerateDialog}
        >
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-orange-600">
                🔒 Generate New QR Code
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800 mb-2">
                  <strong>Fraud Prevention:</strong> Generate a new QR code for
                  this stamp card without affecting existing customer progress.
                </p>
                <p className="text-sm text-orange-700">
                  This creates a new secure code while keeping all customer data
                  intact. Use this if you suspect the current QR code has been
                  compromised.
                </p>
              </div>

              {regeneratingQR && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">
                    Generating new QR code...
                  </p>
                </div>
              )}

              {qrCodeUrl && !regeneratingQR && (
                <div className="text-center">
                  <p className="text-sm font-medium mb-3">
                    New QR Code (Rev. {revisionNumber}):
                  </p>
                  <div className="bg-white p-4 rounded-lg border inline-block">
                    <img
                      src={qrCodeUrl}
                      alt="Updated QR Code"
                      className="w-32 h-32 mx-auto"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    if (!selectedCard) return;
                    setRegeneratingQR(true);
                    try {
                      const newRevision = revisionNumber + 1;
                      setRevisionNumber(newRevision);
                      const newQrCode = await generateQRCode(selectedCard.id);
                      setQrCodeUrl(newQrCode);
                    } catch (error) {
                      console.error("Error generating new QR code:", error);
                      alert(
                        "Failed to generate new QR code. Please try again.",
                      );
                    } finally {
                      setRegeneratingQR(false);
                    }
                  }}
                  disabled={regeneratingQR}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Generate New Code
                </Button>
                <Button
                  onClick={() => setShowQRRegenerateDialog(false)}
                  variant="outline"
                  disabled={regeneratingQR}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Pending Stamp Requests Dialog */}
        <Dialog
          open={showPendingRequests}
          onOpenChange={setShowPendingRequests}
        >
          <DialogContent className="max-w-4xl mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Pending Stamp Requests
                {pendingStampRequests.length > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {pendingStampRequests.length}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pendingStampRequests.length > 0 ? (
                pendingStampRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">
                            {request.customers.name}
                          </h4>
                          {request.is_new_customer && (
                            <Badge className="bg-green-500 text-white text-xs">
                              New Customer
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {request.customers.email && (
                            <p>📧 {request.customers.email}</p>
                          )}
                          {request.customers.phone && (
                            <p>📱 {request.customers.phone}</p>
                          )}
                          <p>🎯 {request.stamp_cards.name}</p>
                          <p>🎁 {request.stamp_cards.reward_description}</p>
                          <p className="text-xs text-gray-400">
                            Requested:{" "}
                            {new Date(
                              request.requested_at || request.created_at,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={async () => {
                            const result = await approveStampRequest(
                              request.id,
                              request.source,
                            );
                            if (result.success) {
                              // Refresh pending requests
                              const updatedRequests =
                                await fetchPendingStampRequests(business!.id);
                              setPendingStampRequests(updatedRequests);
                              // Show success notification
                              alert(
                                `Stamp approved for ${request.customers.name}!`,
                              );
                            } else {
                              alert("Failed to approve stamp request");
                            }
                          }}
                        >
                          ✓ Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={async () => {
                            const result = await denyStampRequest(
                              request.id,
                              request.source,
                            );
                            if (result.success) {
                              // Refresh pending requests
                              const updatedRequests =
                                await fetchPendingStampRequests(business!.id);
                              setPendingStampRequests(updatedRequests);
                              alert(
                                `Stamp request denied for ${request.customers.name}`,
                              );
                            } else {
                              alert("Failed to deny stamp request");
                            }
                          }}
                        >
                          ✗ Deny
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No pending requests
                  </h3>
                  <p className="text-gray-600">
                    All stamp requests have been processed
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowPendingRequests(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}

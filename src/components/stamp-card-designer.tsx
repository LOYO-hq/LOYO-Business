"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Palette,
  Type,
  Image as ImageIcon,
  Save,
  Eye,
  Undo,
  Redo,
  Grid,
  Smartphone,
  Download,
  Settings,
  Upload,
  QrCode,
  Share2,
  Printer,
  Copy,
  Mail,
  MessageCircle,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";

interface Business {
  id: string;
  business_name: string;
  logo_url?: string;
}

interface StampCardDesignerProps {
  business: Business;
}

interface CardDesign {
  name: string;
  description: string;
  stampsRequired: number;
  rewardDescription: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  stampBaseShape: "circle" | "rounded-square" | "hexagon";
  stampShape: "emoji" | "custom";
  selectedEmoji: string;
  customStampImage: string | null;
  layout: "auto" | "grid" | "linear" | "circular";
  fontSize: "small" | "medium" | "large";
  showLogo: boolean;
  showProgress: boolean;

}

const emojiOptions = [
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
];

const getDefaultDesign = (businessName: string): CardDesign => ({
  name: `${businessName} Loyalty Card`,
  description: "Collect stamps and earn rewards!",
  stampsRequired: 10,
  rewardDescription: "Get a free coffee!",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  accentColor: "#3b82f6",
  stampBaseShape: "circle",
  stampShape: "emoji",
  selectedEmoji: "⭐",
  customStampImage: null,
  layout: "auto",
  fontSize: "medium",
  showLogo: true,
  showProgress: true,

});

const colorPresets = [
  { name: "Classic Blue", bg: "#ffffff", text: "#1f2937", accent: "#3b82f6" },
  { name: "Warm Orange", bg: "#fef7ed", text: "#9a3412", accent: "#ea580c" },
  { name: "Fresh Green", bg: "#f0fdf4", text: "#166534", accent: "#16a34a" },
  { name: "Royal Purple", bg: "#faf5ff", text: "#581c87", accent: "#9333ea" },
  { name: "Sunset Pink", bg: "#fdf2f8", text: "#be185d", accent: "#ec4899" },
  { name: "Ocean Teal", bg: "#f0fdfa", text: "#134e4a", accent: "#14b8a6" },
];

export default function StampCardDesigner({
  business,
}: StampCardDesignerProps) {
  const [design, setDesign] = useState<CardDesign>(
    getDefaultDesign(business.business_name),
  );
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [useCustomColors, setUseCustomColors] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [savedCardId, setSavedCardId] = useState<string | null>(null);
  const [revisionNumber, setRevisionNumber] = useState<number>(1);
  const [showEditWarning, setShowEditWarning] = useState(false);
  const [activeCustomersCount, setActiveCustomersCount] = useState(0);
  const [showQRRegenerateDialog, setShowQRRegenerateDialog] = useState(false);
  const [regeneratingQR, setRegeneratingQR] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  const updateDesign = useCallback((updates: Partial<CardDesign>) => {
    setDesign((prev) => ({ ...prev, ...updates }));
  }, []);

  const applyColorPreset = (preset: (typeof colorPresets)[0]) => {
    updateDesign({
      backgroundColor: preset.bg,
      textColor: preset.text,
      accentColor: preset.accent,

    });
  };

  const getOptimalLayout = (count: number) => {
    if (count <= 4) return { cols: count, rows: 1 };
    if (count <= 6) return { cols: 3, rows: 2 };
    if (count <= 9) return { cols: 3, rows: 3 };
    if (count <= 12) return { cols: 4, rows: 3 };
    if (count <= 16) return { cols: 4, rows: 4 };
    return { cols: 5, rows: Math.ceil(count / 5) };
  };

  const generateStampPositions = () => {
    const positions = [];
    const { stampsRequired, layout } = design;

    if (layout === "auto") {
      const { cols, rows } = getOptimalLayout(stampsRequired);
      for (let i = 0; i < stampsRequired; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        positions.push({ x: col, y: row, index: i });
      }
    } else if (layout === "grid") {
      const cols = Math.ceil(Math.sqrt(stampsRequired));
      const rows = Math.ceil(stampsRequired / cols);
      for (let i = 0; i < stampsRequired; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        positions.push({ x: col, y: row, index: i });
      }
    } else if (layout === "linear") {
      for (let i = 0; i < stampsRequired; i++) {
        positions.push({ x: i, y: 0, index: i });
      }
    } else if (layout === "circular") {
      const centerX = 0;
      const centerY = 0;
      const radius = 100;
      for (let i = 0; i < stampsRequired; i++) {
        const angle = (i / stampsRequired) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        positions.push({ x, y, index: i });
      }
    }

    return positions;
  };

  const getStampSize = () => {
    const { stampsRequired } = design;
    if (stampsRequired <= 4) return 48;
    if (stampsRequired <= 6) return 44;
    if (stampsRequired <= 10) return 40;
    if (stampsRequired <= 15) return 36;
    return 32;
  };

  const getStampBaseStyle = (size: number, filled: boolean = false) => {
    const baseStyle = {
      width: size,
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: filled ? `2px solid ${design.accentColor}` : `2px solid #e5e7eb`,
      backgroundColor: filled ? design.accentColor + "20" : "transparent",
    };

    switch (design.stampBaseShape) {
      case "circle":
        return { ...baseStyle, borderRadius: "50%" };
      case "rounded-square":
        return { ...baseStyle, borderRadius: "8px" };
      case "hexagon":
        return {
          ...baseStyle,
          clipPath:
            "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          border: "none",
          backgroundColor: filled ? design.accentColor + "20" : "#f3f4f6",
        };
      default:
        return baseStyle;
    }
  };

  const renderStampShape = (filled: boolean, size: number = 24) => {
    const baseClasses = `inline-block transition-all duration-200`;
    const stampBaseStyle = getStampBaseStyle(size, filled);

    const stampContent = () => {
      if (!filled) {
        return null; // Blank stamp base for unfilled stamps
      }

      if (design.stampShape === "emoji") {
        return (
          <span
            style={{
              fontSize: size * 0.6,
            }}
          >
            {design.selectedEmoji}
          </span>
        );
      } else if (design.stampShape === "custom" && design.customStampImage) {
        return (
          <img
            src={design.customStampImage}
            alt="Custom stamp"
            style={{
              width: size * 0.7,
              height: size * 0.7,
              objectFit: "contain",
            }}
          />
        );
      }
      return null;
    };

    return (
      <div className={baseClasses} style={stampBaseStyle}>
        {stampContent()}
      </div>
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 1MB)
      if (file.size > 1024 * 1024) {
        alert("File size must be less than 1MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateDesign({ customStampImage: result as string | null, stampShape: "custom" });
        setUploadDialogOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderCardPreview = () => {
    // Mobile phone screen dimensions (portrait) - optimized for mobile viewing
    const cardClasses = `
      relative overflow-hidden transition-all duration-300 shadow-xl border rounded-3xl
      w-80 h-[640px] bg-white
    `;

    const fontSizeClass = {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
    }[design.fontSize];

    const stampPositions = generateStampPositions();
    const filledStamps = Math.floor(design.stampsRequired * 0.6); // Demo: 60% filled
    const { cols } =
      design.layout === "auto"
        ? getOptimalLayout(design.stampsRequired)
        : { cols: Math.ceil(Math.sqrt(design.stampsRequired)) };
    const stampSize = getStampSize();

    return (
      <div
        className={cardClasses}
        style={{
          backgroundColor: design.backgroundColor,
          color: design.textColor,
        }}
      >
        {/* Header */}
        <div
          className="p-6 border-b"
          style={{ borderColor: design.accentColor + "20" }}
        >
          <div className="flex items-start justify-between">
            {design.showLogo && business.logo_url && (
              <img
                src={business.logo_url}
                alt="Business Logo"
                className="w-12 h-12 rounded-lg object-cover mr-4 flex-shrink-0"
              />
            )}
            {design.showLogo && !business.logo_url && (
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-xs text-gray-500">Logo</span>
              </div>
            )}
            <div className="flex-1">
              <h3 className={`font-bold ${fontSizeClass} mb-1`}>
                {design.name}
              </h3>
              <p
                className={`opacity-75 ${design.fontSize === "large" ? "text-base" : "text-sm"} leading-relaxed`}
              >
                {design.description}
              </p>
            </div>
          </div>
        </div>

        {/* Stamps Area */}
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="w-full">
            {(design.layout === "auto" || design.layout === "grid") && (
              <div
                className="grid gap-3 justify-items-center"
                style={{
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                }}
              >
                {Array.from({ length: design.stampsRequired }).map((_, i) => (
                  <div key={i} className="flex justify-center">
                    {renderStampShape(i < filledStamps, stampSize)}
                  </div>
                ))}
              </div>
            )}

            {design.layout === "linear" && (
              <div className="flex gap-2 flex-wrap justify-center">
                {Array.from({ length: design.stampsRequired }).map((_, i) => (
                  <div key={i}>
                    {renderStampShape(i < filledStamps, stampSize - 4)}
                  </div>
                ))}
              </div>
            )}

            {design.layout === "circular" && (
              <div className="relative w-48 h-48 mx-auto">
                {stampPositions.map((pos, i) => (
                  <div
                    key={i}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${50 + pos.x * 0.3}%`,
                      top: `${50 + pos.y * 0.3}%`,
                    }}
                  >
                    {renderStampShape(i < filledStamps, stampSize - 8)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {design.showProgress && (
          <div className="px-6 pb-4">
            <div className="flex justify-between text-sm opacity-75 mb-2">
              <span>
                {filledStamps} / {design.stampsRequired} stamps
              </span>
              <span>
                {Math.round((filledStamps / design.stampsRequired) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: design.accentColor,
                  width: `${(filledStamps / design.stampsRequired) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Reward Section */}
        <div className="px-6 pb-4">
          <div 
            className="rounded-lg p-4 border-2 text-center relative overflow-hidden"
            style={{
              backgroundColor: design.accentColor + "10",
              borderColor: design.accentColor + "40"
            }}
          >
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                background: `linear-gradient(45deg, ${design.accentColor}, transparent)`
              }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">🎁</span>
                <h4 className="font-bold text-lg" style={{ color: design.accentColor }}>
                  Your Reward
                </h4>
              </div>
              <p className="font-semibold text-base" style={{ color: design.textColor }}>
                {design.rewardDescription}
              </p>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="px-6 pb-6">
          <div className="text-center">
            <button 
              className="w-full text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 mb-2 transition-colors"
              style={{
                backgroundColor: design.accentColor,
                ':hover': {
                  backgroundColor: design.accentColor + 'dd'
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = design.accentColor + 'dd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = design.accentColor;
              }}
            >
              <QrCode className="w-5 h-5" />
              Scan QR Code
            </button>
            <p className="text-xs text-gray-500">
              Tap to collect stamps
            </p>
          </div>
        </div>
      </div>
    );
  };

  const generateQRCode = async (cardId: string, revisionNumber?: number) => {
    try {
      // Unified Smart QR Code that works for both new and existing customers
      // The mobile app will validate this URL and determine the appropriate action
      const qrData = `https://customer.loyo.app/qr/${cardId}?businessId=${business.id}${revisionNumber ? `&rev=${revisionNumber}` : ''}`;
      
      // Store QR code data in database for validation
      const supabase = createClient();
      await supabase
        .from('stamp_cards')
        .update({
          qr_code_data: {
            type: 'stamp_card',
            stamp_card_id: cardId,
            business_id: business.id,
            customer_url: qrData,
            revision: revisionNumber || 1,
            created_at: new Date().toISOString()
          }
        })
        .eq('id', cardId);
      
      // Create QR code with logo integration
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Generate base QR code
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      
      // Load QR code image
      const qrImage = new Image();
      qrImage.crossOrigin = 'anonymous';
      
      return new Promise<string>((resolve) => {
        qrImage.onload = async () => {
          canvas.width = 256;
          canvas.height = 256;
          
          // Draw QR code
          ctx?.drawImage(qrImage, 0, 0, 256, 256);
          
          // Load and draw logo in center
          const logoImage = new Image();
          logoImage.crossOrigin = 'anonymous';
          logoImage.onload = () => {
            if (ctx) {
              const logoSize = 52; // Slightly larger original logo
              const logoX = (256 - logoSize) / 2;
              const logoY = (256 - logoSize) / 2;
              
              // Create white background for logo
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8);
              
              // Draw logo
              ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
            }
            resolve(canvas.toDataURL());
          };
          logoImage.onerror = () => resolve(qrCodeDataUrl);
          // Use business logo if available, otherwise use new LOYO logo (slightly larger)
          logoImage.src = business.logo_url || '/images/loyo-icon-new.png';
        };
        qrImage.src = qrCodeDataUrl;
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      return "";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate required fields
      if (!design.name.trim()) {
        alert('Please enter a card name');
        return;
      }
      if (!design.rewardDescription.trim()) {
        alert('Please enter a reward description');
        return;
      }
      if (design.stampsRequired < 1 || design.stampsRequired > 20) {
        alert('Stamps required must be between 1 and 20');
        return;
      }

      console.log('Saving stamp card with data:', {
        business_id: business.id,
        name: design.name,
        description: design.description,
        stamps_required: design.stampsRequired,
        reward_description: design.rewardDescription,
        background_color: design.backgroundColor,
        text_color: design.textColor,
        accent_color: design.accentColor,
        stamp_shape: design.stampShape,
        selected_emoji: design.selectedEmoji,
        custom_stamp_image: design.customStampImage,
        layout: design.layout,
        font_size: design.fontSize,
        show_logo: design.showLogo,
        show_progress: design.showProgress,
        stamp_base_shape: design.stampBaseShape,
        is_active: true,
      });

      const { data, error } = await supabase
        .from("stamp_cards")
        .insert({
          business_id: business.id,
          name: design.name.trim(),
          description: design.description?.trim() || null,
          stamps_required: design.stampsRequired,
          reward_description: design.rewardDescription.trim(),
          background_color: design.backgroundColor,
          text_color: design.textColor,
          accent_color: design.accentColor,
          stamp_shape: design.stampShape,
          selected_emoji: design.selectedEmoji,
          custom_stamp_image: design.customStampImage,
          layout: design.layout,
          font_size: design.fontSize,
          show_logo: design.showLogo,
          show_progress: design.showProgress,
          stamp_base_shape: design.stampBaseShape,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        let errorMessage = 'Failed to create stamp card. ';
        if (error.code === '23505') {
          errorMessage += 'A card with this name already exists.';
        } else if (error.code === '23503') {
          errorMessage += 'Invalid business reference.';
        } else {
          errorMessage += error.message;
        }
        alert(errorMessage);
        return;
      }

      if (!data) {
        alert('Failed to create stamp card. No data returned.');
        return;
      }

      console.log('Stamp card saved successfully:', data);
      setSavedCardId(data.id);
      const qrCode = await generateQRCode(data.id, revisionNumber);
      setQrCodeUrl(qrCode);
      
      setShowSaveDialog(true);
    } catch (error) {
      console.error("Error saving stamp card:", error);
      alert('Failed to create stamp card. Please check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrintQR = () => {
    if (qrCodeUrl) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print QR Code - ${design.name}</title>
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
                <h2>${design.name}</h2>
                <p>${design.description}</p>
                <img src="${qrCodeUrl}" alt="QR Code" />
                <p><strong>Scan to collect stamps!</strong></p>
                <p>Collect ${design.stampsRequired} stamps to earn: ${design.rewardDescription}</p>
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
    const shareText = `Check out ${design.name}! Collect ${design.stampsRequired} stamps to earn: ${design.rewardDescription}`;
    const shareUrl = `${window.location.origin}/stamp-card/${savedCardId}${revisionNumber > 1 ? `?rev=${revisionNumber}` : ''}`;
    
    switch (platform) {
      case "email":
        window.open(`mailto:?subject=${encodeURIComponent(design.name)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`);
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`);
        break;
      case "messenger":
        window.open(`https://www.messenger.com/t/?link=${encodeURIComponent(shareUrl)}`);
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
        break;
      default:
        break;
    }
  };

  const handleEditCard = async () => {
    // Check for active customers with incomplete stamp cards
    if (savedCardId) {
      try {
        const { data: customers } = await supabase
          .from('customer_stamps')
          .select('*')
          .eq('stamp_card_id', savedCardId)
          .lt('stamps_earned', design.stampsRequired);
        
        setActiveCustomersCount(customers?.length || 0);
        setRevisionNumber(prev => prev + 1);
        setShowEditWarning(true);
      } catch (error) {
        console.error('Error checking active customers:', error);
      }
    }
  };

  const handleShowCard = () => {
    setShowSaveDialog(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Design Controls */}
      <div className="lg:col-span-1 space-y-6">
        <div className="space-y-6">


            {/* Card Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Card Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Card Name
                  </label>
                  <Input
                    value={design.name}
                    onChange={(e) => updateDesign({ name: e.target.value })}
                    placeholder="My Loyalty Card"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    value={design.description}
                    onChange={(e) =>
                      updateDesign({ description: e.target.value })
                    }
                    placeholder="Collect stamps and earn rewards!"
                    rows={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stamps Required
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={design.stampsRequired}
                    onChange={(e) =>
                      updateDesign({
                        stampsRequired: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reward Description
                  </label>
                  <Textarea
                    value={design.rewardDescription}
                    onChange={(e) =>
                      updateDesign({ rewardDescription: e.target.value })
                    }
                    placeholder="Get a free coffee!"
                    rows={1}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={design.showLogo}
                      onChange={(e) =>
                        updateDesign({ showLogo: e.target.checked })
                      }
                    />
                    <span className="text-sm font-medium">
                      Show Business Logo
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={design.showProgress}
                      onChange={(e) =>
                        updateDesign({ showProgress: e.target.checked })
                      }
                    />
                    <span className="text-sm font-medium">
                      Show Progress Bar
                    </span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Color Themes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Color Themes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!useCustomColors ? (
                  <div className="grid grid-cols-2 gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyColorPreset(preset)}
                        className="p-3 rounded-lg border hover:border-gray-400 transition-colors"
                        style={{ backgroundColor: preset.bg }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: preset.accent }}
                          />
                          <span
                            className="text-xs font-medium"
                            style={{ color: preset.text }}
                          >
                            {preset.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium min-w-[80px]">
                        Background
                      </label>
                      <input
                        type="color"
                        value={design.backgroundColor}
                        onChange={(e) =>
                          updateDesign({ backgroundColor: e.target.value })
                        }
                        className="w-8 h-8 rounded border cursor-pointer"
                      />
                      <Input
                        value={design.backgroundColor}
                        onChange={(e) =>
                          updateDesign({ backgroundColor: e.target.value })
                        }
                        placeholder="#ffffff"
                        className="text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium min-w-[80px]">
                        Text Color
                      </label>
                      <input
                        type="color"
                        value={design.textColor}
                        onChange={(e) =>
                          updateDesign({ textColor: e.target.value })
                        }
                        className="w-8 h-8 rounded border cursor-pointer"
                      />
                      <Input
                        value={design.textColor}
                        onChange={(e) =>
                          updateDesign({ textColor: e.target.value })
                        }
                        placeholder="#1f2937"
                        className="text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium min-w-[80px]">
                        Accent Color
                      </label>
                      <input
                        type="color"
                        value={design.accentColor}
                        onChange={(e) =>
                          updateDesign({ 
                            accentColor: e.target.value
                          })
                        }
                        className="w-8 h-8 rounded border cursor-pointer"
                      />
                      <Input
                        value={design.accentColor}
                        onChange={(e) =>
                          updateDesign({ 
                            accentColor: e.target.value
                          })
                        }
                        placeholder="#3b82f6"
                        className="text-xs"
                      />
                    </div>

                  </div>
                )}
                <div className="mt-4 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Use custom color scheme
                    </span>
                    <button
                      onClick={() => setUseCustomColors(!useCustomColors)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        useCustomColors ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          useCustomColors ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Layout Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  Layout & Style
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stamp Base Shape
                  </label>
                  <Select
                    value={design.stampBaseShape}
                    onValueChange={(value: any) =>
                      updateDesign({ stampBaseShape: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="rounded-square">
                        Rounded Square
                      </SelectItem>
                      <SelectItem value="hexagon">Hexagon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stamp Content
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={
                          design.stampShape === "emoji" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => updateDesign({ stampShape: "emoji" })}
                        className="flex-1"
                      >
                        Emoji
                      </Button>
                      <Dialog
                        open={uploadDialogOpen}
                        onOpenChange={setUploadDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant={
                              design.stampShape === "custom"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="flex-1"
                          >
                            <Upload className="w-4 h-4 mr-1" />
                            Custom
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Upload Custom Stamp Image</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                              Upload a custom image for your stamp. Maximum file
                              size: 1MB. Recommended: Square images work best.
                            </p>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="cursor-pointer"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {design.stampShape === "emoji" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Choose Emoji
                        </label>
                        <div className="grid grid-cols-5 gap-2 max-h-24 overflow-y-auto border rounded p-2">
                          {emojiOptions.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() =>
                                updateDesign({ selectedEmoji: emoji })
                              }
                              className={`p-2 text-lg rounded hover:bg-gray-100 transition-colors ${
                                design.selectedEmoji === emoji
                                  ? "bg-blue-100 ring-2 ring-blue-500"
                                  : "
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {design.stampShape === "custom" &&
                      design.customStampImage && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Custom Image Preview
                          </label>
                          <div className="flex items-center gap-3">
                            <img
                              src={design.customStampImage}
                              alt="Custom stamp preview"
                              className="w-12 h-12 object-contain border rounded"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateDesign({
                                  customStampImage: null,
                                  stampShape: "emoji",
                                })
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stamp Layout
                  </label>
                  <Select
                    value={design.layout}
                    onValueChange={(value: any) =>
                      updateDesign({ layout: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (Smart Layout)</SelectItem>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="circular">Circular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Font Size
                  </label>
                  <Select
                    value={design.fontSize}
                    onValueChange={(value: any) =>
                      updateDesign({ fontSize: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

          </div>



        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg font-semibold"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Card"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
        </div>

        {/* Edit Warning Dialog */}
        <Dialog open={showEditWarning} onOpenChange={setShowEditWarning}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-orange-600">⚠️ Card Edit Warning</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800">
                  You have <strong>{activeCustomersCount}</strong> active customers with incomplete stamp cards.
                </p>
                <p className="text-sm text-orange-700 mt-2">
                  Editing this card will create a new QR code (Rev. {revisionNumber}) and may affect existing customer progress.
                </p>
              </div>
              
              {qrCodeUrl && (
                <div className="text-center">
                  <p className="text-sm font-medium mb-3">New QR Code (Rev. {revisionNumber}):</p>
                  <div className="bg-white p-4 rounded-lg border inline-block">
                    <img src={qrCodeUrl} alt="Updated QR Code" className="w-32 h-32 mx-auto" />
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={async () => {
                    const newQrCode = await generateQRCode(savedCardId!, revisionNumber);
                    setQrCodeUrl(newQrCode);
                    setShowEditWarning(false);
                    setShowSaveDialog(true);
                  }} 
                  className="flex-1"
                >
                  Continue with Edit
                </Button>
                <Button 
                  onClick={() => {
                    setShowEditWarning(false);
                    setRevisionNumber(prev => prev - 1);
                  }} 
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Save Success Dialog */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-center">Card Saved Successfully!</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Card Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{design.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{design.description}</p>
                <div className="flex justify-between text-sm">
                  <span>Stamps Required:</span>
                  <span className="font-medium">{design.stampsRequired}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Reward:</span>
                  <span className="font-medium">{design.rewardDescription}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <p className="text-sm font-medium mb-3">Smart QR Code {revisionNumber > 1 ? `(Rev. ${revisionNumber})` : ''}:</p>
                <div className="bg-white p-4 rounded-lg border inline-block">
                  <img src={qrCodeUrl} alt="Smart QR Code" className="w-32 h-32 mx-auto" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Customers scan this to access their loyalty program
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Automatically detects new vs. existing customers
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button onClick={handlePrintQR} className="w-full" variant="outline">
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
                  onClick={() => {
                    setShowSaveDialog(false);
                    router.push("/dashboard");
                  }} 
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
                <Button 
                  onClick={() => setShowSaveDialog(false)} 
                  variant="outline"
                >
                  Create Another
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* QR Code Regeneration Dialog */}
        <Dialog open={showQRRegenerateDialog} onOpenChange={setShowQRRegenerateDialog}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-orange-600">🔒 Generate New QR Code</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800 mb-2">
                  <strong>Fraud Prevention:</strong> Generate a new QR code for this stamp card without affecting existing customer progress.
                </p>
                <p className="text-sm text-orange-700">
                  This creates a new secure code while keeping all customer data intact. Use this if you suspect the current QR code has been compromised.
                </p>
              </div>
              
              {regeneratingQR && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Generating new QR code...</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={async () => {
                    if (!savedCardId) return;
                    setRegeneratingQR(true);
                    try {
                      const newRevision = revisionNumber + 1;
                      setRevisionNumber(newRevision);
                      const newQrCode = await generateQRCode(savedCardId, newRevision);
                      setQrCodeUrl(newQrCode);
                      setShowQRRegenerateDialog(false);
                      setShowSaveDialog(true);
                    } catch (error) {
                      console.error('Error generating new QR code:', error);
                      alert('Failed to generate new QR code. Please try again.');
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
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-2">
        <div className="sticky top-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live Preview</span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Smartphone className="w-4 h-4" />
                  Mobile Phone View
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 p-8">
              <div className="flex flex-col items-center gap-6">
                {/* Phone Frame */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-black rounded-[2.5rem] shadow-2xl">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="relative m-1">{renderCardPreview()}</div>
                </div>
                <p className="text-sm text-gray-500 max-w-md text-center">
                  This is how your stamp card will appear to customers on their
                  mobile devices. The vertical layout is optimized for mobile
                  viewing and includes the QR code scanning functionality.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
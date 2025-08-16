import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { qrData, scanType, businessId, stampCardId, customerId, source } =
      await request.json();

    const supabase = await createClient();

    // If qrData is provided, validate the QR code
    if (qrData) {
      const validationResult = await validateQRCode(qrData, supabase);
      if (!validationResult.isValid) {
        return NextResponse.json(
          {
            error: "This QR code is not a valid LOYO business code",
            details: validationResult.error,
          },
          { status: 400 },
        );
      }

      // Return validation success with business/card data
      return NextResponse.json({
        success: true,
        message: "QR code validated successfully",
        data: validationResult.data,
        qrType: validationResult.type,
      });
    }

    // Legacy analytics tracking (when no qrData provided)
    if (!scanType || !businessId) {
      return NextResponse.json(
        { error: "Missing required fields: scanType and businessId" },
        { status: 400 },
      );
    }

    // Validate scan type
    const validScanTypes = [
      "qr_scan_business",
      "qr_scan_stamp_card",
      "qr_scan_external",
    ];
    if (!validScanTypes.includes(scanType)) {
      return NextResponse.json({ error: "Invalid scan type" }, { status: 400 });
    }

    // Log the scan event
    const analyticsData = {
      event_type: scanType,
      business_id: businessId,
      stamp_card_id: stampCardId || null,
      customer_id: customerId || null,
      source: source || "unknown",
      timestamp: new Date().toISOString(),
      metadata: {
        user_agent: request.headers.get("user-agent"),
        ip:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip"),
      },
    };

    console.log("QR Scan Analytics:", analyticsData);

    return NextResponse.json({
      success: true,
      message: "Scan tracked successfully",
      data: analyticsData,
    });
  } catch (error) {
    console.error("Error processing QR scan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// QR Code validation function with customer onboarding detection
async function validateQRCode(qrData: string, supabase: any) {
  try {
    // Parse the QR data URL
    const url = new URL(qrData);

    // Check if it's a LOYO URL (updated to include our onboarding domain)
    if (
      !url.hostname.includes("loyo.app") &&
      !url.hostname.includes("tempo.build")
    ) {
      return { isValid: false, error: "Not a LOYO QR code" };
    }

    // Extract stamp card ID from path - handle both old and new URL formats
    const pathParts = url.pathname.split("/");
    let stampCardId;

    // Handle new format: /customer-onboarding/{stampCardId}
    if (pathParts.includes("customer-onboarding")) {
      const onboardingIndex = pathParts.indexOf("customer-onboarding");
      stampCardId = pathParts[onboardingIndex + 1];
    } else {
      // Handle old format: /qr/{stampCardId}
      stampCardId = pathParts[pathParts.length - 1];
    }

    const businessId = url.searchParams.get("businessId");
    const customerId = url.searchParams.get("customerId"); // Optional for existing customers

    if (!stampCardId || !businessId) {
      return { isValid: false, error: "Invalid QR code format" };
    }

    // Validate stamp card and business
    const { data: stampCard, error: cardError } = await supabase
      .from("stamp_cards")
      .select(
        `
        id, 
        name, 
        description, 
        stamps_required, 
        reward_description, 
        background_color,
        text_color,
        accent_color,
        stamp_shape,
        selected_emoji,
        custom_stamp_image,
        stamp_base_shape,
        show_logo,
        show_progress,
        is_active,
        business_id,
        businesses!inner(
          id,
          business_name,
          logo_url,
          address,
          suburb,
          state
        )
      `,
      )
      .eq("id", stampCardId)
      .eq("business_id", businessId)
      .eq("is_active", true)
      .single();

    if (cardError || !stampCard) {
      return { isValid: false, error: "Stamp card not found or inactive" };
    }

    // Check if customer exists (for existing customer detection)
    let existingCustomer = null;
    if (customerId) {
      const { data: customer } = await supabase
        .from("customers")
        .select("id, name, email, phone, avatar_url")
        .eq("id", customerId)
        .eq("business_id", businessId)
        .single();

      if (customer) {
        existingCustomer = customer;

        // Check if they have existing stamps for this card
        const { data: existingStamps } = await supabase
          .from("customer_stamps")
          .select("stamps_earned, stamps_redeemed")
          .eq("customer_id", customerId)
          .eq("stamp_card_id", stampCardId)
          .single();

        if (existingStamps) {
          existingCustomer.currentStamps = existingStamps.stamps_earned || 0;
          existingCustomer.redeemedStamps = existingStamps.stamps_redeemed || 0;
        }
      }
    }

    return {
      isValid: true,
      type: "stamp_card",
      data: {
        stampCardId: stampCard.id,
        stampCardName: stampCard.name,
        description: stampCard.description,
        stampsRequired: stampCard.stamps_required,
        rewardDescription: stampCard.reward_description,
        businessId: stampCard.business_id,
        businessName: stampCard.businesses.business_name,
        businessAddress: `${stampCard.businesses.address}, ${stampCard.businesses.suburb}, ${stampCard.businesses.state}`,
        logoUrl: stampCard.businesses.logo_url,
        cardDesign: {
          backgroundColor: stampCard.background_color,
          textColor: stampCard.text_color,
          accentColor: stampCard.accent_color,
          stampShape: stampCard.stamp_shape,
          selectedEmoji: stampCard.selected_emoji,
          customStampImage: stampCard.custom_stamp_image,
          stampBaseShape: stampCard.stamp_base_shape,
          showLogo: stampCard.show_logo,
          showProgress: stampCard.show_progress,
        },
        // Customer status detection
        isExistingCustomer: !!existingCustomer,
        existingCustomer: existingCustomer,
        // Mobile app URLs for redirection
        mobileAppUrl: `loyo://stamp-card/${stampCardId}?businessId=${businessId}${customerId ? `&customerId=${customerId}` : ""}`,
        webAppUrl: `https://customer.loyo.app/stamp-card/${stampCardId}?businessId=${businessId}${customerId ? `&customerId=${customerId}` : ""}`,
        onboardingUrl: `https://78a1787d-6589-43c1-925c-e52a62d6827e.canvases.tempo.build/customer-onboarding/${stampCardId}?businessId=${businessId}`,
      },
    };
  } catch (error) {
    console.error("QR validation error:", error);
    return { isValid: false, error: "Invalid QR code format" };
  }
}

export async function GET() {
  return NextResponse.json({
    message: "QR Scan Analytics API",
    endpoints: {
      POST: "Track QR code scans",
      supportedScanTypes: [
        "qr_scan_business",
        "qr_scan_stamp_card",
        "qr_scan_external",
      ],
    },
  });
}

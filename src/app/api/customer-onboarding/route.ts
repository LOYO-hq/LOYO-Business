import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

export async function POST(request: NextRequest) {
  try {
    const {
      action,
      stampCardId,
      businessId,
      customerData,
      customerId,
      stampRequestId,
    } = await request.json();

    const supabase = await createClient();

    switch (action) {
      case "register_new_customer":
        return await registerNewCustomer(supabase, customerData, businessId);

      case "request_first_stamp":
        return await requestFirstStamp(
          supabase,
          customerId,
          stampCardId,
          businessId,
        );

      case "approve_stamp_request":
        return await approveStampRequest(supabase, stampRequestId);

      case "deny_stamp_request":
        return await denyStampRequest(supabase, stampRequestId);

      case "snooze_stamp_request":
        return await snoozeStampRequest(supabase, stampRequestId);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Customer onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Register new customer
async function registerNewCustomer(
  supabase: any,
  customerData: any,
  businessId: string,
) {
  const { name, email, phone, selfieUrl } = customerData;

  // Validate required fields
  if (!name || (!email && !phone)) {
    return NextResponse.json(
      { error: "Name and either email or phone are required" },
      { status: 400 },
    );
  }

  try {
    // Check if customer already exists
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("business_id", businessId)
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single();

    if (existingCustomer) {
      return NextResponse.json({
        success: true,
        customerId: existingCustomer.id,
        message: "Customer already exists",
        isExisting: true,
      });
    }

    // Create new customer
    const { data: newCustomer, error } = await supabase
      .from("customers")
      .insert({
        business_id: businessId,
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        avatar_url: selfieUrl || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating customer:", error);
      return NextResponse.json(
        { error: "Failed to register customer" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      customerId: newCustomer.id,
      message: "Customer registered successfully",
      isExisting: false,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register customer" },
      { status: 500 },
    );
  }
}

// Request first stamp
async function requestFirstStamp(
  supabase: any,
  customerId: string,
  stampCardId: string,
  businessId: string,
) {
  try {
    // Check if customer already has stamps for this card
    const { data: existingStamps } = await supabase
      .from("customer_stamps")
      .select("id, stamps_earned")
      .eq("customer_id", customerId)
      .eq("stamp_card_id", stampCardId)
      .single();

    if (existingStamps && existingStamps.stamps_earned > 0) {
      return NextResponse.json(
        { error: "Customer already has stamps for this card" },
        { status: 400 },
      );
    }

    // Create or update customer stamps record
    const { data: customerStamps, error: stampsError } = await supabase
      .from("customer_stamps")
      .upsert({
        customer_id: customerId,
        stamp_card_id: stampCardId,
        stamps_earned: 0,
        stamps_redeemed: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (stampsError) {
      console.error("Error creating customer stamps:", stampsError);
      return NextResponse.json(
        { error: "Failed to initialize stamp card" },
        { status: 500 },
      );
    }

    // Create stamp request (pending approval)
    const { data: stampRequest, error: requestError } = await supabase
      .from("stamp_requests")
      .insert({
        customer_stamp_id: customerStamps.id,
        business_id: businessId,
        stamp_number: 1,
        status: "pending",
        is_new_customer: true,
        requested_at: new Date().toISOString(),
      })
      .select(
        `
        *,
        customer_stamps!inner(
          customer_id,
          customers!inner(
            name,
            email,
            phone,
            avatar_url
          )
        )
      `,
      )
      .single();

    if (requestError) {
      console.error("Error creating stamp request:", requestError);
      return NextResponse.json(
        { error: "Failed to request stamp" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      stampRequestId: stampRequest.id,
      message: "First stamp requested successfully",
      customerName: stampRequest.customer_stamps.customers.name,
    });
  } catch (error) {
    console.error("Stamp request error:", error);
    return NextResponse.json(
      { error: "Failed to request stamp" },
      { status: 500 },
    );
  }
}

// Approve stamp request
async function approveStampRequest(supabase: any, stampRequestId: string) {
  try {
    // Get stamp request details
    const { data: stampRequest, error: requestError } = await supabase
      .from("stamp_requests")
      .select(
        `
        *,
        customer_stamps!inner(
          id,
          stamps_earned,
          customer_id,
          stamp_card_id
        )
      `,
      )
      .eq("id", stampRequestId)
      .eq("status", "pending")
      .single();

    if (requestError || !stampRequest) {
      return NextResponse.json(
        { error: "Stamp request not found" },
        { status: 404 },
      );
    }

    // Update stamp request status
    const { error: updateRequestError } = await supabase
      .from("stamp_requests")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
      })
      .eq("id", stampRequestId);

    if (updateRequestError) {
      console.error("Error updating stamp request:", updateRequestError);
      return NextResponse.json(
        { error: "Failed to approve stamp request" },
        { status: 500 },
      );
    }

    // Update customer stamps count
    const newStampCount = stampRequest.customer_stamps.stamps_earned + 1;
    const { error: updateStampsError } = await supabase
      .from("customer_stamps")
      .update({
        stamps_earned: newStampCount,
        last_stamp_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", stampRequest.customer_stamps.id);

    if (updateStampsError) {
      console.error("Error updating stamps:", updateStampsError);
      return NextResponse.json(
        { error: "Failed to update stamp count" },
        { status: 500 },
      );
    }

    // Create stamp transaction record
    const { error: transactionError } = await supabase
      .from("stamp_transactions")
      .insert({
        customer_stamp_id: stampRequest.customer_stamps.id,
        transaction_type: "earned",
        stamps_count: 1,
        notes: stampRequest.is_new_customer
          ? "First stamp - new customer"
          : "Stamp earned",
        created_at: new Date().toISOString(),
      });

    if (transactionError) {
      console.error("Error creating transaction:", transactionError);
    }

    return NextResponse.json({
      success: true,
      message: "Stamp approved successfully",
      newStampCount,
      isNewCustomer: stampRequest.is_new_customer,
    });
  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json(
      { error: "Failed to approve stamp" },
      { status: 500 },
    );
  }
}

// Deny stamp request
async function denyStampRequest(supabase: any, stampRequestId: string) {
  try {
    const { error } = await supabase
      .from("stamp_requests")
      .update({
        status: "denied",
        denied_at: new Date().toISOString(),
      })
      .eq("id", stampRequestId)
      .eq("status", "pending");

    if (error) {
      console.error("Error denying stamp request:", error);
      return NextResponse.json(
        { error: "Failed to deny stamp request" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Stamp request denied",
    });
  } catch (error) {
    console.error("Denial error:", error);
    return NextResponse.json(
      { error: "Failed to deny stamp" },
      { status: 500 },
    );
  }
}

// Snooze stamp request
async function snoozeStampRequest(supabase: any, stampRequestId: string) {
  try {
    const { error } = await supabase
      .from("stamp_requests")
      .update({
        status: "snoozed",
        snoozed_at: new Date().toISOString(),
      })
      .eq("id", stampRequestId)
      .eq("status", "pending");

    if (error) {
      console.error("Error snoozing stamp request:", error);
      return NextResponse.json(
        { error: "Failed to snooze stamp request" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Stamp request snoozed",
    });
  } catch (error) {
    console.error("Snooze error:", error);
    return NextResponse.json(
      { error: "Failed to snooze stamp" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Customer Onboarding API",
    endpoints: {
      POST: "Handle customer onboarding actions",
      supportedActions: [
        "register_new_customer",
        "request_first_stamp",
        "approve_stamp_request",
        "deny_stamp_request",
        "snooze_stamp_request",
      ],
    },
  });
}

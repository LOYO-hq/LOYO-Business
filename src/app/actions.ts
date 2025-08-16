"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        email: email,
      },
    },
  });

  console.log("After signUp", error);

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      // Create a new client with the user's session for RLS compliance
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { error: updateError } = await supabase.from("users").insert({
          id: user.id,
          name: fullName,
          full_name: fullName,
          email: email,
          user_id: user.id,
          token_identifier: user.id,
          created_at: new Date().toISOString(),
        });

        if (updateError) {
          console.error("Error updating user profile:", updateError);
        }
      }
    } catch (err) {
      console.error("Error in user profile creation:", err);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const businessRegistrationAction = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "You must be logged in to register a business",
    );
  }

  const businessName = formData.get("business_name")?.toString();
  const businessType = formData.get("business_type")?.toString();
  const address = formData.get("address")?.toString();
  const suburb = formData.get("suburb")?.toString();
  const state = formData.get("state")?.toString();
  const postcode = formData.get("postcode")?.toString();
  const phone = formData.get("phone")?.toString() || null;
  const website = formData.get("website")?.toString() || null;
  const description = formData.get("description")?.toString() || null;
  const planType = formData.get("plan_type")?.toString() || "trial";
  const abn = formData.get("abn")?.toString() || null;
  const acn = formData.get("acn")?.toString() || null;
  const logoUrl = formData.get("logo_url")?.toString() || null;
  const primaryContactName =
    formData.get("primary_contact_name")?.toString() || null;
  const primaryContactEmail =
    formData.get("primary_contact_email")?.toString() || null;
  const primaryContactPhone =
    formData.get("primary_contact_phone")?.toString() || null;
  const secondaryContactName =
    formData.get("secondary_contact_name")?.toString() || null;
  const secondaryContactEmail =
    formData.get("secondary_contact_email")?.toString() || null;
  const secondaryContactPhone =
    formData.get("secondary_contact_phone")?.toString() || null;

  if (
    !businessName ||
    !businessType ||
    !address ||
    !suburb ||
    !state ||
    !postcode ||
    !primaryContactName ||
    !primaryContactEmail
  ) {
    return encodedRedirect(
      "error",
      "/business-registration",
      "Please fill in all required fields",
    );
  }

  // Check if business already exists for this user
  const { data: existingBusiness } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existingBusiness) {
    // Business already exists, redirect to dashboard
    return redirect("/dashboard");
  }

  const { data: newBusiness, error } = await supabase
    .from("businesses")
    .insert({
      user_id: user.id,
      business_name: businessName,
      business_type: businessType,
      address,
      suburb,
      state,
      postcode,
      phone,
      website,
      description,
      plan_type: planType,
      abn,
      acn,
      logo_url: logoUrl,
      primary_contact_name: primaryContactName,
      primary_contact_email: primaryContactEmail,
      primary_contact_phone: primaryContactPhone,
      secondary_contact_name: secondaryContactName,
      secondary_contact_email: secondaryContactEmail,
      secondary_contact_phone: secondaryContactPhone,
    })
    .select()
    .single();

  if (error) {
    console.error("Error registering business:", error);
    return encodedRedirect(
      "error",
      "/business-registration",
      "Failed to register business. Please try again.",
    );
  }

  // Ensure the business was created successfully before redirecting
  if (!newBusiness) {
    return encodedRedirect(
      "error",
      "/business-registration",
      "Failed to create business record. Please try again.",
    );
  }

  return redirect("/dashboard");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const fetchPendingStampRequests = async (businessId: string) => {
  const supabase = await createClient();

  // First, try to fetch from loyo_stamp_requests table (new PWA customers)
  const { data: loyoRequests, error: loyoError } = await supabase
    .from("loyo_stamp_requests")
    .select(
      `
      *,
      loyo_pwa_customers!inner(
        id,
        name,
        email,
        phone
      ),
      stamp_cards!inner(
        id,
        name,
        stamps_required,
        reward_description
      )
    `,
    )
    .eq("business_id", businessId)
    .eq("status", "pending")
    .order("requested_at", { ascending: false });

  // Also fetch from the original stamp_requests table (legacy customers)
  const { data: legacyRequests, error: legacyError } = await supabase
    .from("stamp_requests")
    .select(
      `
      *,
      customer_stamps!inner(
        id,
        stamp_card_id,
        customers!inner(
          id,
          name,
          email,
          phone,
          avatar_url
        )
      )
    `,
    )
    .eq("business_id", businessId)
    .eq("status", "pending")
    .order("requested_at", { ascending: false });

  let allRequests: any[] = [];

  // Process LOYO PWA requests
  if (loyoRequests && loyoRequests.length > 0) {
    const processedLoyoRequests = loyoRequests.map((request) => ({
      ...request,
      customers: {
        id: request.loyo_pwa_customers.id,
        name: request.loyo_pwa_customers.name,
        email: request.loyo_pwa_customers.email,
        phone: request.loyo_pwa_customers.phone,
        avatar_url: null,
      },
      stamp_cards: request.stamp_cards,
      source: "loyo_pwa",
    }));
    allRequests = [...allRequests, ...processedLoyoRequests];
  }

  // Process legacy requests
  if (legacyRequests && legacyRequests.length > 0) {
    const processedLegacyRequests = await Promise.all(
      legacyRequests.map(async (request) => {
        const { data: stampCard } = await supabase
          .from("stamp_cards")
          .select("id, name, stamps_required, reward_description")
          .eq("id", request.customer_stamps.stamp_card_id)
          .single();

        return {
          ...request,
          stamp_cards: stampCard,
          customers: request.customer_stamps.customers,
          source: "legacy",
        };
      }),
    );
    allRequests = [...allRequests, ...processedLegacyRequests];
  }

  // Sort all requests by requested_at date
  allRequests.sort((a, b) => {
    const dateA = new Date(a.requested_at || a.created_at).getTime();
    const dateB = new Date(b.requested_at || b.created_at).getTime();
    return dateB - dateA;
  });

  return allRequests;
};

export const approveStampRequest = async (
  requestId: string,
  source?: string,
) => {
  const supabase = await createClient();

  try {
    // Determine which table to use based on source or try both
    let stampRequest: any = null;
    let isLoyoRequest = false;

    // First try loyo_stamp_requests table
    const { data: loyoRequest, error: loyoError } = await supabase
      .from("loyo_stamp_requests")
      .select("*")
      .eq("id", requestId)
      .eq("status", "pending")
      .single();

    if (loyoRequest && !loyoError) {
      stampRequest = loyoRequest;
      isLoyoRequest = true;
    } else {
      // Try legacy stamp_requests table
      const { data: legacyRequest, error: legacyError } = await supabase
        .from("stamp_requests")
        .select(
          `
          *,
          customer_stamps!inner(
            id,
            stamps_earned,
            stamp_card_id
          )
        `,
        )
        .eq("id", requestId)
        .eq("status", "pending")
        .single();

      if (legacyRequest && !legacyError) {
        stampRequest = legacyRequest;
        isLoyoRequest = false;
      }
    }

    if (!stampRequest) {
      throw new Error("Stamp request not found");
    }

    // Update the appropriate stamp request table
    const tableName = isLoyoRequest ? "loyo_stamp_requests" : "stamp_requests";
    const { error: updateError } = await supabase
      .from(tableName)
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateError) {
      throw updateError;
    }

    // For legacy requests, update customer stamps count
    if (!isLoyoRequest && stampRequest.customer_stamps) {
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
      }
    }

    // For LOYO PWA requests, we might need to create or update customer stamp records
    if (isLoyoRequest) {
      // Check if customer_stamps record exists for this customer and stamp card
      const { data: existingStamps } = await supabase
        .from("customer_stamps")
        .select("*")
        .eq("customer_id", stampRequest.customer_id)
        .eq("stamp_card_id", stampRequest.stamp_card_id)
        .single();

      if (existingStamps) {
        // Update existing record
        const { error: updateStampsError } = await supabase
          .from("customer_stamps")
          .update({
            stamps_earned: (existingStamps.stamps_earned || 0) + 1,
            last_stamp_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingStamps.id);

        if (updateStampsError) {
          console.error("Error updating stamps:", updateStampsError);
        }
      } else {
        // Create new customer_stamps record
        const { error: createStampsError } = await supabase
          .from("customer_stamps")
          .insert({
            customer_id: stampRequest.customer_id,
            stamp_card_id: stampRequest.stamp_card_id,
            stamps_earned: 1,
            stamps_redeemed: 0,
            last_stamp_at: new Date().toISOString(),
          });

        if (createStampsError) {
          console.error("Error creating stamps record:", createStampsError);
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error approving stamp request:", error);
    return { success: false, error: "Failed to approve stamp request" };
  }
};

export const denyStampRequest = async (requestId: string, source?: string) => {
  const supabase = await createClient();

  try {
    // Try both tables to find the request
    let updated = false;

    // First try loyo_stamp_requests table
    const { error: loyoError } = await supabase
      .from("loyo_stamp_requests")
      .update({
        status: "denied",
        denied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .eq("status", "pending");

    if (!loyoError) {
      updated = true;
    } else {
      // Try legacy stamp_requests table
      const { error: legacyError } = await supabase
        .from("stamp_requests")
        .update({
          status: "denied",
          denied_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestId)
        .eq("status", "pending");

      if (!legacyError) {
        updated = true;
      }
    }

    if (!updated) {
      throw new Error("Stamp request not found or already processed");
    }

    return { success: true };
  } catch (error) {
    console.error("Error denying stamp request:", error);
    return { success: false, error: "Failed to deny stamp request" };
  }
};

export const fetchAllCustomers = async (businessId: string) => {
  const supabase = await createClient();

  // Fetch from both customer tables to get all customers
  const { data: legacyCustomers, error: legacyError } = await supabase
    .from("customers")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  const { data: loyoCustomers, error: loyoError } = await supabase
    .from("loyo_pwa_customers")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  let allCustomers: any[] = [];

  // Add legacy customers
  if (legacyCustomers && !legacyError) {
    allCustomers = [
      ...allCustomers,
      ...legacyCustomers.map((customer) => ({
        ...customer,
        source: "legacy",
      })),
    ];
  }

  // Add LOYO PWA customers
  if (loyoCustomers && !loyoError) {
    allCustomers = [
      ...allCustomers,
      ...loyoCustomers.map((customer) => ({
        ...customer,
        source: "loyo_pwa",
        avatar_url: null, // LOYO PWA customers don't have avatar_url
        is_vip: false, // Default VIP status for LOYO PWA customers
      })),
    ];
  }

  // Sort all customers by created_at date
  allCustomers.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });

  if (legacyError && loyoError) {
    console.error("Error fetching customers:", { legacyError, loyoError });
    return { customers: [] };
  }

  return {
    customers: allCustomers,
  };
};

export const updateCustomerVIPStatus = async (
  customerId: string,
  isVIP: boolean,
) => {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("customers")
      .update({ is_vip: isVIP })
      .eq("id", customerId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating VIP status:", error);
    return { success: false, error: "Failed to update VIP status" };
  }
};

export const deleteCustomer = async (customerId: string) => {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", customerId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { success: false, error: "Failed to delete customer" };
  }
};

export const getStampRequestsCount = async (businessId: string) => {
  const supabase = await createClient();

  // Count from both tables
  const { data: legacyData, error: legacyError } = await supabase
    .from("stamp_requests")
    .select("id", { count: "exact" })
    .eq("business_id", businessId)
    .eq("status", "approved");

  const { data: loyoData, error: loyoError } = await supabase
    .from("loyo_stamp_requests")
    .select("id", { count: "exact" })
    .eq("business_id", businessId)
    .eq("status", "approved");

  let totalCount = 0;

  if (!legacyError && legacyData) {
    totalCount += legacyData.length;
  }

  if (!loyoError && loyoData) {
    totalCount += loyoData.length;
  }

  if (legacyError && loyoError) {
    console.error("Error fetching stamp requests count:", {
      legacyError,
      loyoError,
    });
    return 0;
  }

  return totalCount;
};

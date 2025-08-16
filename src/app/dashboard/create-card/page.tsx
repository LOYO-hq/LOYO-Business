import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import StampCardDesigner from "@/components/stamp-card-designer";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function CreateCardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user has a business registered
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!business) {
    return redirect("/business-registration");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Stamp Card
            </h1>
            <p className="text-gray-600">
              Design your digital loyalty card with our intuitive canvas editor
            </p>
          </div>
          <StampCardDesigner business={business} />
        </div>
      </main>
    </>
  );
}

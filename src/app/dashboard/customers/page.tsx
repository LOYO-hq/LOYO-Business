"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import {
  Users,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  MoreVertical,
  Crown,
  Trash2,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../supabase/client";
import {
  fetchAllCustomers,
  updateCustomerVIPStatus,
  deleteCustomer,
} from "../../actions";

interface Business {
  id: string;
  business_name: string;
  logo_url?: string;
}

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  business_id: string;
  avatar_url?: string;
  is_vip?: boolean;
  created_at: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [filterBy, setFilterBy] = useState("all");

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

    // Fetch all customers
    const { customers: customerData } = await fetchAllCustomers(
      businessData.id,
    );
    setCustomers(customerData);
    setFilteredCustomers(customerData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  // Filter and search customers
  useEffect(() => {
    let filtered = customers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone?.includes(searchTerm),
      );
    }

    // Apply category filter
    if (filterBy === "new") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(
        (customer) => new Date(customer.created_at) > thirtyDaysAgo,
      );
    } else if (filterBy === "vip") {
      filtered = filtered.filter((customer) => customer.is_vip);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "created_at") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      return 0;
    });

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, sortBy, filterBy]);

  const handleVIPToggle = async (
    customerId: string,
    currentVIPStatus: boolean,
  ) => {
    const result = await updateCustomerVIPStatus(customerId, !currentVIPStatus);
    if (result.success) {
      // Refresh data
      await fetchData();
    } else {
      alert("Failed to update VIP status");
    }
  };

  const handleDeleteCustomer = async (
    customerId: string,
    customerName: string,
  ) => {
    if (
      confirm(
        `Are you sure you want to delete ${customerName}? This action cannot be undone.`,
      )
    ) {
      const result = await deleteCustomer(customerId);
      if (result.success) {
        // Refresh data
        await fetchData();
      } else {
        alert("Failed to delete customer");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!business) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const CustomerRow = ({ customer }: { customer: Customer }) => {
    const isNew = () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(customer.created_at) > thirtyDaysAgo;
    };

    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {customer.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{customer.name}</h3>
              {customer.is_vip && (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  VIP
                </Badge>
              )}
              {isNew() && (
                <Badge className="bg-green-100 text-green-800 text-xs">
                  New
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {customer.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{customer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(customer.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                handleVIPToggle(customer.id, customer.is_vip || false)
              }
            >
              <Crown className="w-4 h-4 mr-2" />
              {customer.is_vip ? "Remove VIP" : "Upgrade to VIP"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteCustomer(customer.id, customer.name)}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
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
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Customer Management
                </h1>
                <p className="text-gray-600 mt-1">
                  View and manage all your customers from both platforms
                </p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  New Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    customers.filter((c) => {
                      const thirtyDaysAgo = new Date();
                      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                      return new Date(c.created_at) > thirtyDaysAgo;
                    }).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  VIP Customers
                </CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customers.filter((c) => c.is_vip).length}
                </div>
                <p className="text-xs text-muted-foreground">Premium members</p>
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
                <div className="text-2xl font-bold">{customers.length}</div>
                <p className="text-xs text-muted-foreground">
                  All registered customers
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Customer Management */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Directory</CardTitle>
              <CardDescription>
                Manage all your customers with filtering and sorting options
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search customers by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="new">New Customers</SelectItem>
                    <SelectItem value="vip">VIP Customers</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Date Joined</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">
                    All Customers ({filteredCustomers.length})
                  </TabsTrigger>
                  <TabsTrigger value="new">
                    New Customers (
                    {
                      customers.filter((c) => {
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return new Date(c.created_at) > thirtyDaysAgo;
                      }).length
                    }
                    )
                  </TabsTrigger>
                  <TabsTrigger value="vip">
                    VIP Customers ({customers.filter((c) => c.is_vip).length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="border rounded-lg">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <CustomerRow key={customer.id} customer={customer} />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No customers found
                        </h3>
                        <p className="text-gray-600">
                          {searchTerm || filterBy !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "Customers will appear here once they register through your onboarding PWA"}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="new" className="mt-6">
                  <div className="border rounded-lg">
                    {customers.filter((c) => {
                      const thirtyDaysAgo = new Date();
                      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                      return new Date(c.created_at) > thirtyDaysAgo;
                    }).length > 0 ? (
                      customers
                        .filter((c) => {
                          const thirtyDaysAgo = new Date();
                          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                          return new Date(c.created_at) > thirtyDaysAgo;
                        })
                        .map((customer) => (
                          <CustomerRow key={customer.id} customer={customer} />
                        ))
                    ) : (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No new customers
                        </h3>
                        <p className="text-gray-600">
                          New customers from the last 30 days will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="vip" className="mt-6">
                  <div className="border rounded-lg">
                    {customers.filter((c) => c.is_vip).length > 0 ? (
                      customers
                        .filter((c) => c.is_vip)
                        .map((customer) => (
                          <CustomerRow key={customer.id} customer={customer} />
                        ))
                    ) : (
                      <div className="text-center py-12">
                        <Crown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No VIP customers yet
                        </h3>
                        <p className="text-gray-600">
                          Upgrade customers to VIP status to see them here
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

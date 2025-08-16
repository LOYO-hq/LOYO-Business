"use client";

import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { businessRegistrationAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { createClient } from "../../../../supabase/client";
import { UrlProvider } from "@/components/url-provider";
import {
  Building2,
  CreditCard,
  MapPin,
  Phone,
  Globe,
  FileText,
  ChevronRight,
  ChevronLeft,
  User,
  Clock,
  Users,
  Target,
  Upload,
  X,
  Plus,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  // Step 1: Business Basics
  business_name: string;
  business_type: string;
  description: string;

  // Step 2: Business Details
  website: string;
  logo: File | null;
  abn: string;
  acn: string;
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_phone: string;
  secondary_contact_name: string;
  secondary_contact_email: string;
  secondary_contact_phone: string;
  add_secondary_contact: boolean;

  // Step 3: Location
  address: string;
  suburb: string;
  state: string;
  postcode: string;

  // Step 4: Contact (removed - moved to Business Details)
  phone: string;
  social_media: string;

  // Step 5: Plan
  plan_type: string;
}

const STEPS = [
  { id: 1, title: "Business Basics", icon: Building2 },
  { id: 2, title: "Business Details", icon: FileText },
  { id: 3, title: "Location", icon: MapPin },
  { id: 4, title: "Contact Info", icon: Phone },
  { id: 5, title: "Choose Plan", icon: CreditCard },
];

const BUSINESS_TYPES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Cafe" },
  { value: "bakery", label: "Bakery" },
  { value: "bar_pub", label: "Bar/Pub" },
  { value: "fast_food", label: "Fast Food" },
  { value: "food_truck", label: "Food Truck" },
  { value: "retail_clothing", label: "Clothing Store" },
  { value: "retail_electronics", label: "Electronics Store" },
  { value: "retail_books", label: "Bookstore" },
  { value: "retail_jewelry", label: "Jewelry Store" },
  { value: "retail_sports", label: "Sports Store" },
  { value: "retail_home", label: "Home & Garden" },
  { value: "retail_pharmacy", label: "Pharmacy" },
  { value: "retail_grocery", label: "Grocery Store" },
  { value: "salon_hair", label: "Hair Salon" },
  { value: "salon_beauty", label: "Beauty Salon" },
  { value: "salon_nail", label: "Nail Salon" },
  { value: "spa", label: "Spa" },
  { value: "barbershop", label: "Barbershop" },
  { value: "fitness_gym", label: "Gym" },
  { value: "fitness_yoga", label: "Yoga Studio" },
  { value: "fitness_pilates", label: "Pilates Studio" },
  { value: "fitness_martial_arts", label: "Martial Arts" },
  { value: "fitness_dance", label: "Dance Studio" },
  { value: "automotive_repair", label: "Auto Repair" },
  { value: "automotive_wash", label: "Car Wash" },
  { value: "automotive_parts", label: "Auto Parts" },
  { value: "automotive_dealership", label: "Car Dealership" },
  { value: "healthcare_dental", label: "Dental Practice" },
  { value: "healthcare_medical", label: "Medical Practice" },
  { value: "healthcare_veterinary", label: "Veterinary Clinic" },
  { value: "healthcare_optometry", label: "Optometry" },
  { value: "healthcare_physiotherapy", label: "Physiotherapy" },
  { value: "professional_accounting", label: "Accounting" },
  { value: "professional_legal", label: "Legal Services" },
  { value: "professional_real_estate", label: "Real Estate" },
  { value: "professional_consulting", label: "Consulting" },
  { value: "professional_marketing", label: "Marketing Agency" },
  { value: "entertainment_cinema", label: "Cinema" },
  { value: "entertainment_gaming", label: "Gaming Center" },
  { value: "entertainment_bowling", label: "Bowling Alley" },
  { value: "entertainment_arcade", label: "Arcade" },
  { value: "hospitality_hotel", label: "Hotel" },
  { value: "hospitality_motel", label: "Motel" },
  { value: "hospitality_bed_breakfast", label: "Bed & Breakfast" },
  { value: "education_tutoring", label: "Tutoring" },
  { value: "education_language", label: "Language School" },
  { value: "education_music", label: "Music School" },
  { value: "education_driving", label: "Driving School" },
  { value: "other", label: "Other" },
];

interface BusinessRegistrationProps {
  searchParams: Message;
}

export default function BusinessRegistration({
  searchParams,
}: BusinessRegistrationProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    business_name: "",
    business_type: "",
    description: "",
    website: "",
    logo: null,
    abn: "",
    acn: "",
    primary_contact_name: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    secondary_contact_name: "",
    secondary_contact_email: "",
    secondary_contact_phone: "",
    add_secondary_contact: false,
    address: "",
    suburb: "",
    state: "",
    postcode: "",
    phone: "",
    social_media: "",
    plan_type: "trial",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize Google Places API
    const initializeGoogleMaps = () => {
      if (
        typeof window !== "undefined" &&
        window.google &&
        window.google.maps &&
        window.google.maps.places
      ) {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
        const mapDiv = document.createElement("div");
        const map = new window.google.maps.Map(mapDiv);
        placesService.current = new window.google.maps.places.PlacesService(
          map,
        );
      }
    };

    // Check if Google Maps is already loaded
    if (window.google) {
      initializeGoogleMaps();
    } else {
      // Wait for Google Maps to load
      const checkGoogleMaps = setInterval(() => {
        if (window.google) {
          initializeGoogleMaps();
          clearInterval(checkGoogleMaps);
        }
      }, 100);

      // Clean up interval after 10 seconds
      setTimeout(() => {
        clearInterval(checkGoogleMaps);
      }, 10000);
    }

    // Get user info from auth and prefill contact name
    const getUserInfo = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setFormData((prev) => ({
          ...prev,
          primary_contact_name: user.user_metadata.full_name,
          primary_contact_email: user.email || "",
        }));
      }
    };
    getUserInfo();
  }, []);

  const handleAddressSearch = (query: string) => {
    if (!query || query.length < 3 || !autocompleteService.current) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const request = {
      input: query,
      componentRestrictions: { country: "au" },
      types: ["address"],
    };

    autocompleteService.current.getPlacePredictions(
      request,
      (predictions: any[], status: any) => {
        if (
          status === window.google?.maps?.places?.PlacesServiceStatus?.OK &&
          predictions
        ) {
          // Get user's location for distance sorting
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const userLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };

                // Sort predictions by distance (this is a simplified approach)
                const sortedPredictions = predictions.sort((a, b) => {
                  // In a real implementation, you'd calculate actual distances
                  // For now, we'll prioritize based on structured formatting
                  return a.structured_formatting.main_text.localeCompare(
                    b.structured_formatting.main_text,
                  );
                });

                setAddressSuggestions(sortedPredictions.slice(0, 5));
                setShowSuggestions(true);
              },
              () => {
                // Fallback if geolocation fails
                setAddressSuggestions(predictions.slice(0, 5));
                setShowSuggestions(true);
              },
            );
          } else {
            setAddressSuggestions(predictions.slice(0, 5));
            setShowSuggestions(true);
          }
        } else {
          setAddressSuggestions([]);
          setShowSuggestions(false);
        }
      },
    );
  };

  const handleAddressSelect = (prediction: any) => {
    if (!placesService.current) return;

    const request = {
      placeId: prediction.place_id,
      fields: ["address_components", "formatted_address"],
    };

    placesService.current.getDetails(request, (place: any, status: any) => {
      if (status === window.google?.maps?.places?.PlacesServiceStatus?.OK) {
        const addressComponents = place.address_components;
        let streetNumber = "";
        let route = "";
        let suburb = "";
        let state = "";
        let postcode = "";

        addressComponents.forEach((component: any) => {
          const types = component.types;
          if (types.includes("street_number")) {
            streetNumber = component.long_name;
          } else if (types.includes("route")) {
            route = component.long_name;
          } else if (
            types.includes("locality") ||
            types.includes("sublocality_level_1")
          ) {
            suburb = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            state = component.short_name;
          } else if (types.includes("postal_code")) {
            postcode = component.long_name;
          }
        });

        const fullAddress = `${streetNumber} ${route}`.trim();

        setFormData((prev) => ({
          ...prev,
          address: fullAddress,
          suburb: suburb,
          state: state,
          postcode: postcode,
        }));

        setShowSuggestions(false);
        setAddressSuggestions([]);
      }
    });
  };

  const updateFormData = (
    field: keyof FormData,
    value: string | boolean | File | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      updateFormData("logo", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    updateFormData("logo", null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      updateFormData("logo", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    try {
      await businessRegistrationAction(formDataObj);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.business_name && formData.business_type;
      case 2:
        return formData.primary_contact_name && formData.primary_contact_email;
      case 3:
        return (
          formData.address &&
          formData.suburb &&
          formData.state &&
          formData.postcode
        );
      case 4:
        return true; // Contact info is optional
      case 5:
        return formData.plan_type;
      default:
        return false;
    }
  };

  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Register Your Business
            </h1>
            <p className="text-xl text-gray-600">
              Tell us about your business to get started with LOYO
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        isActive
                          ? "border-blue-600 bg-blue-600 text-white"
                          : isCompleted
                            ? "border-green-600 bg-green-600 text-white"
                            : "border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="ml-2 hidden sm:block">
                      <p
                        className={`text-sm font-medium ${
                          isActive
                            ? "text-blue-600"
                            : isCompleted
                              ? "text-green-600"
                              : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`w-8 h-0.5 mx-4 ${
                          isCompleted ? "bg-green-600" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <UrlProvider>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Business Basics */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Business Basics
                    </CardTitle>
                    <CardDescription>
                      Let's start with the fundamentals of your business
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="business_name"
                        className="text-sm font-medium"
                      >
                        Business Name *
                      </Label>
                      <Input
                        id="business_name"
                        name="business_name"
                        type="text"
                        placeholder="Your Business Name"
                        value={formData.business_name}
                        onChange={(e) =>
                          updateFormData("business_name", e.target.value)
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="business_type"
                        className="text-sm font-medium"
                      >
                        Business Type *
                      </Label>
                      <Select
                        name="business_type"
                        value={formData.business_type}
                        onValueChange={(value) =>
                          updateFormData("business_type", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your business type" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {BUSINESS_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Business Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Tell us about your business, what makes it special..."
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                          updateFormData("description", e.target.value)
                        }
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Business Details */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Business Details
                    </CardTitle>
                    <CardDescription>
                      Additional business information and contact details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Business Website */}
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-medium">
                        Business Website URL
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="https://yourbusiness.com.au"
                        value={formData.website}
                        onChange={(e) =>
                          updateFormData("website", e.target.value)
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Business Logo
                      </Label>
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {logoPreview ? (
                          <div className="relative inline-block">
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="max-w-32 max-h-32 object-contain mx-auto"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeLogo();
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-8 h-8 mx-auto text-gray-400" />
                            <p className="text-gray-600">
                              Drag and drop your logo here, or click to browse
                            </p>
                            <p className="text-sm text-gray-500">
                              PNG, JPG up to 5MB
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>

                    {/* ABN/ACN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="abn" className="text-sm font-medium">
                          ABN (Australian Business Number)
                        </Label>
                        <Input
                          id="abn"
                          name="abn"
                          type="text"
                          placeholder="12 345 678 901"
                          value={formData.abn}
                          onChange={(e) =>
                            updateFormData("abn", e.target.value)
                          }
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="acn" className="text-sm font-medium">
                          ACN (Australian Company Number)
                        </Label>
                        <Input
                          id="acn"
                          name="acn"
                          type="text"
                          placeholder="123 456 789"
                          value={formData.acn}
                          onChange={(e) =>
                            updateFormData("acn", e.target.value)
                          }
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Primary Contact */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Primary Contact
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="primary_contact_name"
                            className="text-sm font-medium"
                          >
                            Name *
                          </Label>
                          <Input
                            id="primary_contact_name"
                            name="primary_contact_name"
                            type="text"
                            placeholder="Contact name"
                            value={formData.primary_contact_name}
                            onChange={(e) =>
                              updateFormData(
                                "primary_contact_name",
                                e.target.value,
                              )
                            }
                            required
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="primary_contact_email"
                            className="text-sm font-medium"
                          >
                            Email *
                          </Label>
                          <Input
                            id="primary_contact_email"
                            name="primary_contact_email"
                            type="email"
                            placeholder="contact@business.com"
                            value={formData.primary_contact_email}
                            onChange={(e) =>
                              updateFormData(
                                "primary_contact_email",
                                e.target.value,
                              )
                            }
                            required
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="primary_contact_phone"
                            className="text-sm font-medium"
                          >
                            Phone
                          </Label>
                          <Input
                            id="primary_contact_phone"
                            name="primary_contact_phone"
                            type="tel"
                            placeholder="(02) 1234 5678"
                            value={formData.primary_contact_phone}
                            onChange={(e) =>
                              updateFormData(
                                "primary_contact_phone",
                                e.target.value,
                              )
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Add Secondary Contact Option */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="add_secondary_contact"
                          checked={formData.add_secondary_contact}
                          onChange={(e) =>
                            updateFormData(
                              "add_secondary_contact",
                              e.target.checked,
                            )
                          }
                          className="w-4 h-4 text-blue-600"
                        />
                        <Label
                          htmlFor="add_secondary_contact"
                          className="text-sm font-medium cursor-pointer"
                        >
                          Add another contact person
                        </Label>
                      </div>

                      {formData.add_secondary_contact && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-900">
                            Secondary Contact
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="secondary_contact_name"
                                className="text-sm font-medium"
                              >
                                Name
                              </Label>
                              <Input
                                id="secondary_contact_name"
                                name="secondary_contact_name"
                                type="text"
                                placeholder="Contact name"
                                value={formData.secondary_contact_name}
                                onChange={(e) =>
                                  updateFormData(
                                    "secondary_contact_name",
                                    e.target.value,
                                  )
                                }
                                className="w-full"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor="secondary_contact_email"
                                className="text-sm font-medium"
                              >
                                Email
                              </Label>
                              <Input
                                id="secondary_contact_email"
                                name="secondary_contact_email"
                                type="email"
                                placeholder="contact@business.com"
                                value={formData.secondary_contact_email}
                                onChange={(e) =>
                                  updateFormData(
                                    "secondary_contact_email",
                                    e.target.value,
                                  )
                                }
                                className="w-full"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor="secondary_contact_phone"
                                className="text-sm font-medium"
                              >
                                Phone
                              </Label>
                              <Input
                                id="secondary_contact_phone"
                                name="secondary_contact_phone"
                                type="tel"
                                placeholder="(02) 1234 5678"
                                value={formData.secondary_contact_phone}
                                onChange={(e) =>
                                  updateFormData(
                                    "secondary_contact_phone",
                                    e.target.value,
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Location */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Business Location
                    </CardTitle>
                    <CardDescription>
                      Where is your business located?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2 relative">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Street Address *
                      </Label>
                      <Input
                        ref={addressInputRef}
                        id="address"
                        name="address"
                        type="text"
                        placeholder="Start typing your address..."
                        value={formData.address}
                        onChange={(e) => {
                          updateFormData("address", e.target.value);
                          handleAddressSearch(e.target.value);
                        }}
                        onBlur={() => {
                          // Delay hiding suggestions to allow for selection
                          setTimeout(() => setShowSuggestions(false), 200);
                        }}
                        onFocus={() => {
                          if (addressSuggestions.length > 0) {
                            setShowSuggestions(true);
                          }
                        }}
                        required
                        className="w-full"
                      />

                      {showSuggestions && addressSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                          {addressSuggestions.map((suggestion, index) => (
                            <div
                              key={suggestion.place_id}
                              className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => handleAddressSelect(suggestion)}
                            >
                              <div className="font-medium text-gray-900">
                                {suggestion.structured_formatting.main_text}
                              </div>
                              <div className="text-sm text-gray-600">
                                {
                                  suggestion.structured_formatting
                                    .secondary_text
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="suburb" className="text-sm font-medium">
                          Suburb *
                        </Label>
                        <Input
                          id="suburb"
                          name="suburb"
                          type="text"
                          placeholder="Suburb"
                          value={formData.suburb}
                          onChange={(e) =>
                            updateFormData("suburb", e.target.value)
                          }
                          required
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-medium">
                          State *
                        </Label>
                        <Select
                          name="state"
                          value={formData.state}
                          onValueChange={(value) =>
                            updateFormData("state", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NSW">NSW</SelectItem>
                            <SelectItem value="VIC">VIC</SelectItem>
                            <SelectItem value="QLD">QLD</SelectItem>
                            <SelectItem value="WA">WA</SelectItem>
                            <SelectItem value="SA">SA</SelectItem>
                            <SelectItem value="TAS">TAS</SelectItem>
                            <SelectItem value="ACT">ACT</SelectItem>
                            <SelectItem value="NT">NT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="postcode"
                          className="text-sm font-medium"
                        >
                          Postcode *
                        </Label>
                        <Input
                          id="postcode"
                          name="postcode"
                          type="text"
                          placeholder="2000"
                          value={formData.postcode}
                          onChange={(e) =>
                            updateFormData("postcode", e.target.value)
                          }
                          required
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Additional Information */}
              {currentStep === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Additional Information
                    </CardTitle>
                    <CardDescription>
                      Optional additional details about your business
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Business Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="(02) 1234 5678"
                          value={formData.phone}
                          onChange={(e) =>
                            updateFormData("phone", e.target.value)
                          }
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="social_media"
                          className="text-sm font-medium"
                        >
                          Social Media
                        </Label>
                        <Input
                          id="social_media"
                          name="social_media"
                          type="text"
                          placeholder="Instagram, Facebook, or other social media handles"
                          value={formData.social_media}
                          onChange={(e) =>
                            updateFormData("social_media", e.target.value)
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 5: Plan Selection */}
              {currentStep === 5 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Choose Your Plan
                    </CardTitle>
                    <CardDescription>
                      Start with a 30-day free trial, then choose your plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div
                        className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                          formData.plan_type === "trial"
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => updateFormData("plan_type", "trial")}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <input
                            type="radio"
                            id="trial"
                            name="plan_type"
                            value="trial"
                            checked={formData.plan_type === "trial"}
                            onChange={(e) =>
                              updateFormData("plan_type", e.target.value)
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <Label
                            htmlFor="trial"
                            className="text-lg font-semibold cursor-pointer"
                          >
                            30-Day Free Trial
                          </Label>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Try all features free for 30 days. No credit card
                          required.
                        </p>
                        <div className="text-2xl font-bold text-blue-600">
                          A$0
                          <span className="text-sm font-normal text-gray-600">
                            /month
                          </span>
                        </div>
                      </div>

                      <div
                        className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                          formData.plan_type === "annual"
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => updateFormData("plan_type", "annual")}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <input
                            type="radio"
                            id="annual"
                            name="plan_type"
                            value="annual"
                            checked={formData.plan_type === "annual"}
                            onChange={(e) =>
                              updateFormData("plan_type", e.target.value)
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <Label
                            htmlFor="annual"
                            className="text-lg font-semibold cursor-pointer"
                          >
                            Annual Plan (20% off)
                          </Label>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Save 20% with annual billing. Includes all premium
                          features.
                        </p>
                        <div className="text-2xl font-bold text-gray-900">
                          A$47
                          <span className="text-sm font-normal text-gray-600">
                            /month
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Billed annually at A$564
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex gap-4">
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ← Back to Dashboard
                  </Link>

                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                  )}
                </div>

                <div className="flex gap-4">
                  {currentStep < STEPS.length ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 px-8 py-3 text-lg flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!isStepValid() || isSubmitting}
                      className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 px-8 py-3 text-lg"
                    >
                      {isSubmitting
                        ? "Registering..."
                        : "Complete Registration"}
                    </Button>
                  )}
                </div>
              </div>

              <FormMessage message={searchParams} />
            </form>
          </UrlProvider>
        </div>
      </div>

      {/* Google Places API Script */}
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`}
        async
        defer
      />
    </>
  );
}

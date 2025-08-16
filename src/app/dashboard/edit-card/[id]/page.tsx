"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../../../supabase/client";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

export default function EditStampCard() {
  const params = useParams();
  const router = useRouter();
  const [stampCard, setStampCard] = useState<StampCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stamps_required: 10,
    reward_description: "",
    background_color: "#ffffff",
    is_active: true,
  });

  useEffect(() => {
    const fetchStampCard = async () => {
      if (!params.id) return;

      const supabase = createClient();

      try {
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
        setFormData({
          name: cardData.name || "",
          description: cardData.description || "",
          stamps_required: cardData.stamps_required || 10,
          reward_description: cardData.reward_description || "",
          background_color: cardData.background_color || "#ffffff",
          is_active: cardData.is_active ?? true,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load stamp card");
        setLoading(false);
      }
    };

    fetchStampCard();
  }, [params.id]);

  const handleSave = async () => {
    if (!stampCard) return;

    setSaving(true);
    const supabase = createClient();

    try {
      const { error: updateError } = await supabase
        .from("stamp_cards")
        .update({
          name: formData.name,
          description: formData.description,
          stamps_required: formData.stamps_required,
          reward_description: formData.reward_description,
          background_color: formData.background_color,
          is_active: formData.is_active,
        })
        .eq("id", stampCard.id);

      if (updateError) {
        throw updateError;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Error updating stamp card:", err);
      setError("Failed to update stamp card");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!stampCard) return;

    if (
      !confirm(
        "Are you sure you want to delete this stamp card? This action cannot be undone.",
      )
    ) {
      return;
    }

    setSaving(true);
    const supabase = createClient();

    try {
      const { error: deleteError } = await supabase
        .from("stamp_cards")
        .delete()
        .eq("id", stampCard.id);

      if (deleteError) {
        throw deleteError;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Error deleting stamp card:", err);
      setError("Failed to delete stamp card");
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">
            {error || "Stamp card not found"}
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Stamp Card
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Card Settings</CardTitle>
              <CardDescription>
                Customize your stamp card details and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Card Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter card name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter card description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stamps_required">Stamps Required</Label>
                <Input
                  id="stamps_required"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.stamps_required}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stamps_required: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward_description">Reward Description</Label>
                <Textarea
                  id="reward_description"
                  value={formData.reward_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reward_description: e.target.value,
                    })
                  }
                  placeholder="Describe the reward customers will receive"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="background_color">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="background_color"
                    type="color"
                    value={formData.background_color}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        background_color: e.target.value,
                      })
                    }
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.background_color}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        background_color: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Card is active</Label>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                See how your stamp card will look to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm mx-auto">
                <div
                  className="bg-white rounded-2xl shadow-lg p-6 border-2"
                  style={{
                    backgroundColor: formData.background_color,
                    borderColor:
                      formData.background_color !== "#ffffff"
                        ? formData.background_color
                        : "#e5e7eb",
                  }}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {formData.name || "Card Name"}
                    </h3>
                    {formData.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {formData.description}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="grid grid-cols-5 gap-2 justify-center">
                      {Array.from(
                        { length: formData.stamps_required },
                        (_, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center"
                          >
                            <span className="text-xs text-gray-400">
                              {index + 1}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="text-center bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      Reward
                    </h4>
                    <p className="text-xs text-gray-700">
                      {formData.reward_description || "Reward description"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

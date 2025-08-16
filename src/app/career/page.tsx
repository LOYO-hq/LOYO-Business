"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Briefcase,
  Code,
  Megaphone,
  Send,
  Users,
  Zap,
} from "lucide-react";

export default function CareerPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    portfolio: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    {
      id: "developer",
      title: "Full Stack Developer",
      icon: <Code className="w-8 h-8" />,
      description:
        "Help us build the future of digital loyalty programs with React, Next.js, and Supabase.",
      requirements: [
        "3+ years experience with React/Next.js",
        "Experience with TypeScript and Tailwind CSS",
        "Knowledge of Supabase or similar backend services",
        "Passion for creating great user experiences",
      ],
    },
    {
      id: "marketing",
      title: "Social Media Marketer",
      icon: <Megaphone className="w-8 h-8" />,
      description:
        "Drive growth and engagement across social platforms to help small businesses discover LOYO.",
      requirements: [
        "2+ years experience in social media marketing",
        "Experience with content creation and community management",
        "Knowledge of social media analytics and advertising",
        "Understanding of small business challenges",
      ],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      alert("Please select a role you're interested in.");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Application Submitted!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your interest in joining the LOYO team. We'll review
            your application and get back to you soon.
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="w-full border-b border-blue-200 bg-white/95 backdrop-blur-md py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="/images/loyo-logo-new.png"
              alt="LOYO Logo"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              LOYO
            </span>
          </Link>
          <Link href="/">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join the LOYO Team
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help us revolutionize how small businesses connect with their
              customers through innovative digital loyalty solutions.
            </p>
          </div>

          {/* Company Values */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Small Business Focus
              </h3>
              <p className="text-gray-600 text-sm">
                We're passionate about empowering small businesses to compete
                with larger competitors.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Innovation First
              </h3>
              <p className="text-gray-600 text-sm">
                We constantly push boundaries to create solutions that make a
                real difference.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Remote-First</h3>
              <p className="text-gray-600 text-sm">
                Work from anywhere while building something meaningful with a
                global team.
              </p>
            </div>
          </div>

          {/* Open Positions */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Open Positions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`bg-white rounded-2xl shadow-lg border-2 p-6 cursor-pointer transition-all ${
                    selectedRole === role.id
                      ? "border-blue-500 shadow-xl"
                      : "border-blue-100 hover:border-blue-300 hover:shadow-xl"
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <div className="text-blue-600">{role.icon}</div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {role.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{role.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Requirements:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {role.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Express Your Interest
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience *</Label>
                <Input
                  id="experience"
                  name="experience"
                  type="text"
                  required
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g., 3 years"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio/LinkedIn URL</Label>
                <Input
                  id="portfolio"
                  name="portfolio"
                  type="url"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="https://your-portfolio.com or LinkedIn profile"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Why do you want to join LOYO? *</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your passion for helping small businesses and what you'd bring to the team..."
                  rows={6}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !selectedRole}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-3"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>

              {!selectedRole && (
                <p className="text-sm text-red-600 text-center">
                  Please select a position above before submitting your
                  application.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

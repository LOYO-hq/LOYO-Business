import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
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
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600">Last updated: January 2024</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 mb-6">
              We collect information you provide directly to us, such as when
              you create an account, register your business, or contact us for
              support. This may include:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Name and contact information (email, phone number)</li>
              <li>Business information (business name, address, type)</li>
              <li>
                Payment information (processed securely through third-party
                providers)
              </li>
              <li>Usage data and analytics</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-6">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to improve user experience</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Information Sharing
            </h2>
            <p className="text-gray-700 mb-6">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties except:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>With your explicit consent</li>
              <li>
                To trusted service providers who assist in operating our
                platform
              </li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-700 mb-6">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. This includes:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Secure hosting infrastructure</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Customer Data
            </h2>
            <p className="text-gray-700 mb-6">
              When you use LOYO to manage customer loyalty programs, you may
              collect customer data. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Obtaining appropriate consent from your customers</li>
              <li>
                Complying with applicable privacy laws in your jurisdiction
              </li>
              <li>Providing clear privacy notices to your customers</li>
              <li>Handling customer data requests appropriately</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Cookies and Tracking
            </h2>
            <p className="text-gray-700 mb-6">
              We use cookies and similar technologies to enhance your
              experience, analyze usage, and provide personalized content. You
              can control cookie settings through your browser preferences.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Your Rights
            </h2>
            <p className="text-gray-700 mb-6">
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. International Transfers
            </h2>
            <p className="text-gray-700 mb-6">
              Your information may be transferred to and processed in countries
              other than your own. We ensure appropriate safeguards are in place
              to protect your information during such transfers.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Children's Privacy
            </h2>
            <p className="text-gray-700 mb-6">
              Our services are not intended for children under 13. We do not
              knowingly collect personal information from children under 13. If
              we become aware of such collection, we will delete the information
              promptly.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Changes to This Policy
            </h2>
            <p className="text-gray-700 mb-6">
              We may update this privacy policy from time to time. We will
              notify you of any material changes by posting the new policy on
              this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Contact Us
            </h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about this privacy policy or our data
              practices, please contact us through our
              <Link href="/contact" className="text-blue-600 hover:underline">
                {" "}
                contact page
              </Link>{" "}
              or reach out to our support team.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-gray-900 mb-2">
                Questions about your privacy?
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                We're committed to protecting your privacy and being transparent
                about our data practices. If you have any concerns or questions,
                don't hesitate to reach out.
              </p>
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

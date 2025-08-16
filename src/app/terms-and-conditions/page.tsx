import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsAndConditionsPage() {
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
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms and Conditions
            </h1>
            <p className="text-xl text-gray-600">Last updated: January 2024</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-6">
              By accessing and using LOYO (&quot;the Service&quot;), you accept
              and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do
              not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 mb-6">
              LOYO is a digital loyalty card management platform that enables
              businesses to create, manage, and track customer loyalty programs
              through digital stamp cards, QR codes, and analytics tools.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. User Accounts
            </h2>
            <p className="text-gray-700 mb-6">
              To use certain features of the Service, you must register for an
              account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>
                Accept responsibility for all activities under your account
              </li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Acceptable Use
            </h2>
            <p className="text-gray-700 mb-6">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful, offensive, or inappropriate content</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the Service for fraudulent or deceptive practices</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Business Use and Compliance
            </h2>
            <p className="text-gray-700 mb-6">
              As a business user, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Comply with all applicable consumer protection laws</li>
              <li>Honor all loyalty program commitments made to customers</li>
              <li>Obtain necessary consents for customer data collection</li>
              <li>Provide clear terms for your loyalty programs</li>
              <li>Not engage in misleading or deceptive practices</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Payment Terms
            </h2>
            <p className="text-gray-700 mb-6">
              Subscription fees are billed in advance on a monthly or annual
              basis. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Pay all fees when due</li>
              <li>Provide current and accurate billing information</li>
              <li>Notify us of any billing disputes within 30 days</li>
              <li>
                Accept that fees are non-refundable except as required by law
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-gray-700 mb-6">
              The Service and its original content, features, and functionality
              are owned by LOYO and are protected by international copyright,
              trademark, patent, trade secret, and other intellectual property
              laws.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. User Content
            </h2>
            <p className="text-gray-700 mb-6">
              You retain ownership of content you create using the Service. By
              using the Service, you grant us a non-exclusive, worldwide,
              royalty-free license to use, reproduce, and display your content
              solely for the purpose of providing the Service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Privacy and Data Protection
            </h2>
            <p className="text-gray-700 mb-6">
              Your privacy is important to us. Please review our Privacy Policy,
              which also governs your use of the Service, to understand our
              practices.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Service Availability
            </h2>
            <p className="text-gray-700 mb-6">
              We strive to maintain high service availability but cannot
              guarantee uninterrupted access. We may temporarily suspend the
              Service for maintenance, updates, or other operational reasons.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Termination
            </h2>
            <p className="text-gray-700 mb-6">
              Either party may terminate this agreement at any time. Upon
              termination:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Your access to the Service will cease</li>
              <li>You remain responsible for any outstanding fees</li>
              <li>
                We may delete your account and data after a reasonable period
              </li>
              <li>
                Provisions that should survive termination will remain in effect
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Disclaimers
            </h2>
            <p className="text-gray-700 mb-6">
              The Service is provided &quot;as is&quot; without warranties of
              any kind. We disclaim all warranties, express or implied,
              including but not limited to merchantability, fitness for a
              particular purpose, and non-infringement.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-6">
              To the maximum extent permitted by law, LOYO shall not be liable
              for any indirect, incidental, special, consequential, or punitive
              damages, or any loss of profits or revenues.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              14. Indemnification
            </h2>
            <p className="text-gray-700 mb-6">
              You agree to indemnify and hold harmless LOYO from any claims,
              damages, or expenses arising from your use of the Service or
              violation of these terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              15. Governing Law
            </h2>
            <p className="text-gray-700 mb-6">
              These terms shall be governed by and construed in accordance with
              the laws of Australia, without regard to its conflict of law
              provisions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              16. Changes to Terms
            </h2>
            <p className="text-gray-700 mb-6">
              We reserve the right to modify these terms at any time. We will
              notify users of material changes via email or through the Service.
              Continued use after changes constitutes acceptance.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              17. Contact Information
            </h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about these Terms and Conditions, please
              contact us through our
              <Link href="/contact" className="text-blue-600 hover:underline">
                {" "}
                contact page
              </Link>
              .
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-gray-900 mb-2">
                Questions about these terms?
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                We want to ensure you understand your rights and obligations. If
                you have any questions about these terms, please don't hesitate
                to reach out.
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

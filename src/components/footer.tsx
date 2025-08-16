import Link from "next/link";
import {
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Heart,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-600/10 to-teal-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-teal-600/10 to-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        {/* Top section with brand and CTA */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="text-4xl font-bold text-white tracking-wider">
              LOYO
            </div>
          </div>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Empowering small businesses to build lasting customer relationships
            through innovative digital loyalty solutions.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 font-medium group shadow-lg"
          >
            Start Your Free Trial
            <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          {/* Support Column */}
          <div className="text-center">
            <h3 className="font-bold mb-6 text-white text-lg">Support</h3>
            <ul className="space-y-3">
              {[
                { name: "Getting Started", href: "#" },
                { name: "Contact Support", href: "/contact" },
                { name: "Community", href: "/community" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-blue-200 hover:text-teal-300 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="text-center">
            <h3 className="font-bold mb-6 text-white text-lg">Company</h3>
            <ul className="space-y-3">
              {[
                { name: "Careers", href: "/career" },
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Terms of Service", href: "/terms-and-conditions" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-blue-200 hover:text-teal-300 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="text-center">
            <h3 className="font-bold mb-6 text-white text-lg">Resources</h3>
            <ul className="space-y-3">
              {[
                { name: "How It Works", href: "#process" },
                { name: "Features", href: "#features" },
                { name: "Pricing", href: "#pricing" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-blue-200 hover:text-teal-300 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-blue-800">
          <div className="flex items-center gap-2 text-blue-300 mb-4 md:mb-0">
            <span>© {currentYear} LOYO. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="text-sm text-blue-300 mr-4">Follow us:</span>
            {[
              { icon: Twitter, href: "#", label: "Twitter" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Instagram, href: "#", label: "Instagram" },
              { icon: Mail, href: "mailto:hello@loyo.app", label: "Email" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-10 h-10 bg-blue-800/50 rounded-lg flex items-center justify-center text-blue-300 hover:text-teal-300 hover:bg-blue-700/50 transition-all duration-200 hover:scale-110"
              >
                <span className="sr-only">{social.label}</span>
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

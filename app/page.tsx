import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Wallet,
  Send,
  ArrowDownUp,
  Shield,
  Clock,
  Globe,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Hero Section */}
      <section className="py-24 px-4 bg-white dark:bg-black relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 bg-grid-white/[0.1] -z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/20 dark:to-black/40 -z-10"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-white">
              <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-sm font-medium">
                  Move Agent Kit Integration
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
                Fast & Secure{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Blockchain
                </span>{" "}
                Payments
              </h1>

              <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
                Send and receive payments on the Aptos blockchain through
                Telegram. Seamless, secure, and built for everyone.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/wallet" className="flex items-center">
                    Launch App <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <a
                    href="https://t.me/OgPulser_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2a10 10 0 110 20 10 10 0 010-20zm2.93 14.66c.15-.22.18-.39.09-.48-.16-.16-.64-.06-1.3.29-.67.36-.89.42-1.07.36-.33-.11-.6-1.35-.6-2.29 0-1.89.93-3.33 1.95-3.33.38 0 .79.25 1.06.71.19.32.25.68.25 1.15 0 .61-.09 1.1-.16 1.22-.1.16-.17.32-.17.42 0 .14.11.29.34.29.41 0 .78-.34 1.03-.87.25-.53.35-1.23.35-1.97 0-1.14-.44-2.07-1.13-2.73-.69-.66-1.69-1.05-2.8-1.05-2.15 0-3.89 1.74-3.89 3.89s1.74 3.89 3.89 3.89c.88 0 1.64-.29 2.26-.79zm-2.93-9.66a1 1 0 100 2 1 1 0 000-2z" />
                    </svg>
                    Open in Telegram
                  </a>
                </Button>
              </div>

              <div className="mt-10 flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center text-xs font-medium text-gray-800"
                    >
                      {i !== 4 ? i : "9+"}
                    </div>
                  ))}
                </div>
                <span>Join 10,000+ users already using Pulse Pay</span>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gray-200 dark:bg-gray-700 opacity-70 blur-lg"></div>
                <div className="relative bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-2xl">
                  <div className="absolute right-3 top-3 p-1.5 bg-green-500 dark:bg-green-600 rounded-full text-xs text-white px-2 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-white mr-1 animate-pulse"></span>
                    Live
                  </div>

                  <Image
                    src="/image/unique-crypto-visualization.svg"
                    alt="Dashboard Preview"
                    className="rounded-lg shadow-sm w-full"
                    width={600}
                    height={400}
                  />

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          Current Balance
                        </p>
                        <p className="font-bold text-lg">128.45 APT</p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/50 dark:hover:bg-blue-900 dark:text-blue-300"
                    >
                      Send <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
              <span>Powered by Move Agent Kit</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
              Experience blockchain payments that are as easy as sending a text
              message.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="bg-blue-100 dark:bg-blue-900/50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Wallet className="text-blue-600 dark:text-blue-400 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Integration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                End-to-end encryption with secure wallet connection. Your
                private keys remain under your control.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="bg-sky-100 dark:bg-sky-900/50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Send className="text-sky-600 dark:text-sky-400 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Transfers</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Send tokens to any Aptos address with simple Telegram commands
                or through our intuitive interface.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="bg-green-100 dark:bg-green-900/50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <ArrowDownUp className="text-green-600 dark:text-green-400 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Transaction History</h3>
              <p className="text-gray-600 dark:text-gray-400">
                View your complete transaction history with detailed information
                and real-time updates.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="bg-amber-100 dark:bg-amber-900/50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="text-amber-600 dark:text-amber-400 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Security First</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enterprise-grade security with no access to your private keys
                and built-in protection features.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="bg-red-100 dark:bg-red-900/50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="text-red-600 dark:text-red-400 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Updates</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get instant notifications about transactions and account
                activities directly via Telegram.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="text-indigo-600 dark:text-indigo-400 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-platform</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access your wallet seamlessly from both our web interface and
                Telegram bot wherever you are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-white dark:bg-black border-t border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
              <span>Simple & Intuitive</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
              Experience the simplicity of blockchain payments in just three
              easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-sky-500 hidden md:block"></div>

            {/* Step 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative z-10">
              <div className="bg-gradient-to-br from-blue-500 to-sky-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Connect Your Wallet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Securely link your Aptos wallet to your Telegram account through
                our website in seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative z-10 md:mt-12">
              <div className="bg-gradient-to-br from-blue-500 to-sky-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Send Commands</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Use simple natural language commands in Telegram to check
                balance, send tokens, or view activity.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative z-10">
              <div className="bg-gradient-to-br from-blue-500 to-sky-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Manage Anywhere</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access your full wallet dashboard on our web app for advanced
                management and detailed insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-4">
              <span>User Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
              See what our users have to say about their experience with Pulse
              Pay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-500"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Alex Johnson</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Developer
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                &quot;Pulse Pay completely transformed how I use cryptocurrency.
                Being able to send APT directly through Telegram is
                amazing!&quot;
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-500"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Sarah Williams</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Entrepreneur
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                &quot;The integration between web and Telegram is seamless. I
                use it daily for my business transactions.&quot;
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-500"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Michael Chen</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Student
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                &quot;As someone new to crypto, Pulse Pay made it incredibly
                easy to get started. The security features are impressive!&quot;
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white dark:bg-black relative overflow-hidden border-t border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 bg-grid-white/[0.05] -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 dark:bg-blue-700 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-400 dark:bg-sky-700 rounded-full opacity-20 blur-3xl"></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-sm font-medium text-white">
              Get Started Today
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Ready to experience the future of payments?
          </h2>

          <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
            Join thousands of users who are already enjoying the simplicity of
            blockchain payments through Telegram.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-white/90 text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/dashboard">Launch Web App</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8"
            >
              <a
                href="https://t.me/OgPulser_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2a10 10 0 110 20 10 10 0 010-20zm2.93 14.66c.15-.22.18-.39.09-.48-.16-.16-.64-.06-1.3.29-.67.36-.89.42-1.07.36-.33-.11-.6-1.35-.6-2.29 0-1.89.93-3.33 1.95-3.33.38 0 .79.25 1.06.71.19.32.25.68.25 1.15 0 .61-.09 1.1-.16 1.22-.1.16-.17.32-.17.42 0 .14.11.29.34.29.41 0 .78-.34 1.03-.87.25-.53.35-1.23.35-1.97 0-1.14-.44-2.07-1.13-2.73-.69-.66-1.69-1.05-2.8-1.05-2.15 0-3.89 1.74-3.89 3.89s1.74 3.89 3.89 3.89c.88 0 1.64-.29 2.26-.79zm-2.93-9.66a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
                Open in Telegram
              </a>
            </Button>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 text-white/70 flex justify-center space-x-8">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              <span>End-to-end encryption</span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No private key access</span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>100% Move Agent Kit powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-white dark:bg-black text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center mr-3">
                  <span className="font-bold text-lg">P</span>
                </div>
                <h3 className="text-xl font-bold">Pulse Pay</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Secure, fast, and easy payments on the Aptos blockchain through
                Telegram.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2a10 10 0 110 20 10 10 0 010-20zm2.93 14.66c.15-.22.18-.39.09-.48-.16-.16-.64-.06-1.3.29-.67.36-.89.42-1.07.36-.33-.11-.6-1.35-.6-2.29 0-1.89.93-3.33 1.95-3.33.38 0 .79.25 1.06.71.19.32.25.68.25 1.15 0 .61-.09 1.1-.16 1.22-.1.16-.17.32-.17.42 0 .14.11.29.34.29.41 0 .78-.34 1.03-.87.25-.53.35-1.23.35-1.97 0-1.14-.44-2.07-1.13-2.73-.69-.66-1.69-1.05-2.8-1.05-2.15 0-3.89 1.74-3.89 3.89s1.74 3.89 3.89 3.89c.88 0 1.64-.29 2.26-.79zm-2.93-9.66a1 1 0 100 2 1 1 0 000-2z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/disclaimer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Connect</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://t.me/OgPulser_bot"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2a10 10 0 110 20 10 10 0 010-20zm2.93 14.66c.15-.22.18-.39.09-.48-.16-.16-.64-.06-1.3.29-.67.36-.89.42-1.07.36-.33-.11-.6-1.35-.6-2.29 0-1.89.93-3.33 1.95-3.33.38 0 .79.25 1.06.71.19.32.25.68.25 1.15 0 .61-.09 1.1-.16 1.22-.1.16-.17.32-.17.42 0 .14.11.29.34.29.41 0 .78-.34 1.03-.87.25-.53.35-1.23.35-1.97 0-1.14-.44-2.07-1.13-2.73-.69-.66-1.69-1.05-2.8-1.05-2.15 0-3.89 1.74-3.89 3.89s1.74 3.89 3.89 3.89c.88 0 1.64-.29 2.26-.79zm-2.93-9.66a1 1 0 100 2 1 1 0 000-2z" />
                    </svg>
                    Telegram
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/your_twitter"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/your_github"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@pulsepay.com"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Email Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400">
            <div className="flex justify-center space-x-6 mb-6">
              <span className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Secure & Encrypted
              </span>
              <span className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Licensed Service
              </span>
              <span className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Fast Transactions
              </span>
            </div>
            <p>
              &copy; {new Date().getFullYear()} Pulse Pay. All rights reserved.
            </p>
            <p className="mt-2 text-sm">Powered by Move Agent Kit.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

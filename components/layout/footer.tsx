// src/components/layout/footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-16 px-4 bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-3">
                <span className="font-bold text-lg">P</span>
              </div>
              <h3 className="text-xl font-bold">Pulse Pay</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Secure, fast, and easy payments on the Aptos blockchain through Telegram.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<TwitterIcon />} />
              <SocialLink href="#" icon={<TelegramIcon />} />
              <SocialLink href="#" icon={<GithubIcon />} />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <FooterLinks 
              links={[
                { href: '/', label: 'Home' },
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' }
              ]} 
            />
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Legal</h4>
            <FooterLinks 
              links={[
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/cookies', label: 'Cookie Policy' },
                { href: '/disclaimer', label: 'Disclaimer' }
              ]} 
            />
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://t.me/OgPulser_bot" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <TelegramIcon className="h-5 w-5 mr-2" />
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://twitter.com/your_twitter" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <TwitterIcon className="h-5 w-5 mr-2" />
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://github.com/your_github" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <GithubIcon className="h-5 w-5 mr-2" />
                  GitHub
                </a>
              </li>
              <li>
                <a href="mailto:contact@pulsepay.com" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <EmailIcon className="h-5 w-5 mr-2" />
                  Email Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <FooterBottom />
      </div>
    </footer>
  );
}

function FooterLinks({ links }: { links: Array<{ href: string; label: string }> }) {
  return (
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <Link 
            href={link.href} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a href={href} className="text-gray-400 hover:text-white transition-colors">
      {icon}
    </a>
  );
}

function FooterBottom() {
  return (
    <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500">
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        <span className="flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Secure & Encrypted
        </span>
        <span className="flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Licensed Service
        </span>
        <span className="flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Fast Transactions
        </span>
      </div>
      <p>&copy; {new Date().getFullYear()} Pulse Pay. All rights reserved.</p>
      <p className="mt-2 text-sm">Powered by Move Agent Kit.</p>
    </div>
  );
}

// Social Icons
function TwitterIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
    </svg>
  );
}

function TelegramIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2a10 10 0 110 20 10 10 0 010-20zm2.93 14.66c.15-.22.18-.39.09-.48-.16-.16-.64-.06-1.3.29-.67.36-.89.42-1.07.36-.33-.11-.6-1.35-.6-2.29 0-1.89.93-3.33 1.95-3.33.38 0 .79.25 1.06.71.19.32.25.68.25 1.15 0 .61-.09 1.1-.16 1.22-.1.16-.17.32-.17.42 0 .14.11.29.34.29.41 0 .78-.34 1.03-.87.25-.53.35-1.23.35-1.97 0-1.14-.44-2.07-1.13-2.73-.69-.66-1.69-1.05-2.8-1.05-2.15 0-3.89 1.74-3.89 3.89s1.74 3.89 3.89 3.89c.88 0 1.64-.29 2.26-.79zm-2.93-9.66a1 1 0 100 2 1 1 0 000-2z"/>
    </svg>
  );
}

function GithubIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function EmailIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
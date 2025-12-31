import { motion } from 'framer-motion'

const TermsAndConditions = () => {
  return (
    <div className="w-full min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-8 md:p-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            TTelGo eSIM – Terms & Conditions
          </h1>

          <div className="prose prose-lg max-w-none mt-8">
            <div className="mb-8 p-4 bg-gray-100 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Company Information</h2>
              <p className="text-gray-700">
                TTelGo eSIM is operated by TikTel Ltd, a company incorporated under the laws of England and Wales, with license number 16154601, and registered office at 71–75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.
              </p>
              <p className="text-gray-700 mt-4">
                By accessing or using TTelGo eSIM services, you confirm that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree, you must not use the service.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Service Overview</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>TTelGo eSIM provides prepaid digital SIM profiles enabling mobile data usage abroad without requiring a physical SIM card.</li>
                <li>Services are offered subject to availability and may vary depending on device compatibility and local network coverage.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Registration & Eligibility</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Users must register via the TTelGo mobile application or website.</li>
                <li>By registering, you agree to comply with these Terms & Conditions and any operational rules or policies published by TikTel Ltd.</li>
                <li>You must be at least 18 years old or have parental consent to use the service.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Privacy & Data Protection</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>TikTel Ltd complies with the UK GDPR and Data Protection Act 2018.</li>
                <li>Personal data collected during registration and usage will be processed lawfully, securely, and only for service provision, customer support, and product improvement.</li>
                <li>You may request correction or deletion of your personal data at any time by contacting support@ttelgo.com.</li>
                <li>We may collect technical information (device type, operating system, IP address, usage logs) to improve service reliability.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Intellectual Property</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>All trademarks, logos, and intellectual property associated with TTelGo eSIM remain the property of TikTel Ltd.</li>
                <li>You may not reproduce, distribute, or use our branding or copyrighted materials without prior written consent.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Account & Activation</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Activation requires installation of the TTelGo eSIM profile on a compatible device.</li>
                <li>Device compatibility must be checked before purchase; refunds will not be issued for incompatible devices.</li>
                <li>Accounts may be deactivated if unused for more than 90 days without a valid data package.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Charges & Payments</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Payments are processed securely via third-party providers (e.g., Stripe) in GBP or USD.</li>
                <li>All transactions comply with PCI DSS Level 1 standards.</li>
                <li>By purchasing, you agree to pay applicable bundle charges and taxes.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Termination</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You may terminate the service at any time.</li>
                <li>TikTel Ltd may suspend or terminate accounts for misuse, unlawful activity, or breach of these Terms.</li>
                <li>No refunds are provided for unused data or subscription periods upon termination.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You agree to use TTelGo eSIM lawfully and not for fraudulent, abusive, or harmful purposes.</li>
                <li>You are responsible for ensuring your device is unlocked and compatible.</li>
                <li>You must notify us immediately if your device is lost or stolen.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Indemnity</h2>
              <p className="text-gray-700">
                You agree to indemnify TikTel Ltd against claims, damages, or liabilities arising from misuse of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>TikTel Ltd is not liable for indirect losses such as lost profits, business interruption, or reputational damage.</li>
                <li>Liability is limited to the total amount paid by you in the 12 months preceding the claim.</li>
                <li>This does not exclude liability for death or personal injury caused by negligence.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Modifications</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>TikTel Ltd reserves the right to amend these Terms & Conditions or discontinue services with notice provided via the app or website.</li>
                <li>Continued use of the service after changes constitutes acceptance.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law & Jurisdiction</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>These Terms & Conditions are governed by the laws of England & Wales.</li>
                <li>Any disputes shall be subject to the exclusive jurisdiction of the courts of London.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Third-Party Services</h2>
              <p className="text-gray-700">
                Access to third-party websites or resources is at your own risk. TikTel Ltd is not responsible for their content or reliability.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Force Majeure</h2>
              <p className="text-gray-700">
                TikTel Ltd shall not be liable for service interruptions caused by events beyond its reasonable control (e.g., natural disasters, technical failures, regulatory changes).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Warranties</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Services are provided with reasonable skill and care.</li>
                <li>No guarantee is made regarding uninterrupted availability or compatibility with all devices.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Referral & Rewards Program</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Users may earn rewards for referring new customers, subject to program rules published within the app.</li>
                <li>Rewards are non-transferable and may be amended or withdrawn at TikTel Ltd's discretion.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">17. Complaints</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>For questions, concerns, or complaints, please contact support@ttelgo.com.</li>
                <li>We aim to resolve disputes amicably and in compliance with UK consumer protection laws.</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TermsAndConditions


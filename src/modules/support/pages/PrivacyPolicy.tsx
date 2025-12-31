import { motion } from 'framer-motion'

const PrivacyPolicy = () => {
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
            TTelGo eSIM Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none mt-8">
            <div className="mb-8 p-4 bg-gray-100 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Company Information</h2>
              <p className="text-gray-700">
                TTelGo eSIM is operated by TikTel Ltd, a company incorporated under the laws of England and Wales, with license number 16154601, and registered office at 71–75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.
              </p>
              <p className="text-gray-700 mt-4">
                By accessing or using TTelGo eSIM, you acknowledge that you have read and understood this Privacy Policy and agree to the collection and use of your information as described herein.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Commitment to Privacy</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>TikTel Ltd is committed to safeguarding your personal information.</li>
                <li>We employ industry-standard security technologies and procedures to protect your data against unauthorized access, use, or disclosure.</li>
                <li>While we take all reasonable steps to secure your information, no system is completely immune to risk, and we cannot guarantee absolute security.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Registration Data:</strong> Information you provide when creating an account (e.g., name, email address, payment details).</li>
                <li><strong>Usage Data:</strong> Technical information such as device type, operating system, IP address, and logs of how you use TTelGo eSIM.</li>
                <li><strong>Communications:</strong> Feedback, support requests, or other interactions with our team.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>To provide and maintain TTelGo eSIM services.</li>
                <li>To contact you regarding service updates, feedback requests, or new product offerings.</li>
                <li>To troubleshoot issues, analyze usage patterns, and improve service performance.</li>
                <li>To comply with legal obligations under UK law.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Deletion & Account Management</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You may request adjustment or deletion of your personal data at any time.</li>
                <li>Account deletion can be initiated directly through the TTelGo app:
                  <ol className="list-decimal pl-6 mt-2 space-y-1">
                    <li>Navigate to the "Delete Account" screen.</li>
                    <li>Enter your registered email address.</li>
                    <li>Confirm the deletion request by pressing "Delete."</li>
                  </ol>
                </li>
                <li>Please note: deleting your TTelGo account does not automatically deactivate your active eSIM profile. You may continue to use your eSIM line until its validity period expires.</li>
                <li>For assistance, contact support@ttelgo.com.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>We retain your personal data only for as long as necessary to provide services or comply with legal requirements.</li>
                <li>Once retention is no longer required, your data will be securely deleted or anonymized.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Sharing of Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>TikTel Ltd does not sell or rent your personal information.</li>
                <li>Data may be shared with trusted third-party service providers (e.g., payment processors) solely for the purpose of delivering services.</li>
                <li>Any sharing complies with UK GDPR requirements and contractual safeguards.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                Under UK GDPR, you have the following rights:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong>Correction:</strong> Request updates or corrections to inaccurate information.</li>
                <li><strong>Deletion:</strong> Request erasure of your personal data.</li>
                <li><strong>Restriction:</strong> Request limits on how we process your data.</li>
                <li><strong>Portability:</strong> Request transfer of your data to another provider.</li>
                <li><strong>Objection:</strong> Object to certain types of processing, including direct marketing.</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Requests can be made by contacting support@ttelgo.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Policy Updates</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>This Privacy Policy may be revised from time to time.</li>
                <li>Any changes will be communicated via the TTelGo app or website.</li>
                <li>Continued use of the service after notification constitutes acceptance of the updated policy.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Responsibility for Accuracy</h2>
              <p className="text-gray-700">
                You are responsible for ensuring that the personal information you provide is accurate and up to date.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy


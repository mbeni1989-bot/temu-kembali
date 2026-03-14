export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b">
        <div className="container py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="container py-8 max-w-4xl prose prose-slate dark:prose-invert">
        <h2>1. Information We Collect</h2>
        
        <h3>1.1 Information You Provide</h3>
        <p>When you use Temu Kembali, we collect information you provide directly, including:</p>
        <ul>
          <li>Account information (name, email address, phone number)</li>
          <li>Profile information (avatar, location)</li>
          <li>Verification documents (government-issued ID for claims)</li>
          <li>Report content (descriptions, images, location data)</li>
          <li>Communications with other users and support team</li>
        </ul>

        <h3>1.2 Automatically Collected Information</h3>
        <p>We automatically collect certain information when you use the Service:</p>
        <ul>
          <li>Device information (browser type, operating system, IP address)</li>
          <li>Usage data (pages visited, features used, time spent)</li>
          <li>Location data (if you grant permission)</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information for:</p>
        <ul>
          <li>Providing and improving the Service</li>
          <li>Verifying user identity and preventing fraud</li>
          <li>Facilitating connections between users</li>
          <li>Sending notifications about matches and claims</li>
          <li>Analyzing usage patterns to improve user experience</li>
          <li>Complying with legal obligations</li>
          <li>Enforcing our Terms of Service</li>
        </ul>

        <h2>3. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your data:
        </p>
        <ul>
          <li>HTTPS encryption for all data transmission</li>
          <li>AES-256 encryption for sensitive data (phone numbers, ID documents)</li>
          <li>Secure authentication using OAuth 2.0</li>
          <li>Regular security audits and updates</li>
          <li>Rate limiting to prevent abuse</li>
        </ul>

        <h2>4. Information Sharing</h2>
        
        <h3>4.1 Public Information</h3>
        <p>The following information is publicly visible on your reports:</p>
        <ul>
          <li>Report title and description</li>
          <li>Images you upload</li>
          <li>General location (city/province)</li>
          <li>Your name and verification status</li>
        </ul>

        <h3>4.2 Private Information</h3>
        <p>The following information is kept private and only shared in specific circumstances:</p>
        <ul>
          <li>Email address (not shown publicly)</li>
          <li>Phone number (only shown to verified claimants)</li>
          <li>Full address (only shown after successful claim)</li>
          <li>ID documents (only for verification purposes)</li>
        </ul>

        <h3>4.3 Third-Party Sharing</h3>
        <p>We do not sell your personal information. We may share data with:</p>
        <ul>
          <li>Service providers (hosting, analytics, payment processing)</li>
          <li>Law enforcement when required by law</li>
          <li>Other users as necessary to facilitate the Service</li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>
          We retain your data for as long as your account is active or as needed to provide the Service.
          You can request deletion of your account and data at any time through the Settings page.
        </p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Export your data</li>
          <li>Opt-out of certain data collection</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2>7. Children's Privacy</h2>
        <p>
          The Service is not intended for users under 13 years of age. We do not knowingly collect
          personal information from children under 13. If you believe we have collected such information,
          please contact us immediately.
        </p>

        <h2>8. International Data Transfers</h2>
        <p>
          Your data may be transferred to and processed in countries other than your own.
          We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
        </p>

        <h2>9. Cookies and Tracking</h2>
        <p>
          We use cookies and similar technologies to enhance your experience. You can control cookie
          preferences through your browser settings, but some features may not function properly if cookies are disabled.
        </p>

        <h2>10. Changes to Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of significant changes
          by posting a notice on the Service or sending an email. Your continued use of the Service after
          changes constitutes acceptance of the updated policy.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or our data practices, please contact us
          through the contact form on our website.
        </p>

        <h2>12. GDPR Compliance (EU Users)</h2>
        <p>
          For users in the European Union, we comply with the General Data Protection Regulation (GDPR).
          You have additional rights including the right to data portability and the right to lodge a
          complaint with a supervisory authority.
        </p>
      </div>
    </div>
  );
}


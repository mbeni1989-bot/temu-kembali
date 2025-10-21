export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b">
        <div className="container py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="container py-8 max-w-4xl prose prose-slate dark:prose-invert">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Temu Kembali ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
          If you do not agree to these Terms of Service, please do not use the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Temu Kembali is a digital platform that connects people who have lost items, pets, vehicles, or are searching for missing persons
          with those who have found them. The Service acts as a facilitator and does not guarantee the recovery of lost items or persons.
        </p>

        <h2>3. User Responsibilities</h2>
        <p>Users agree to:</p>
        <ul>
          <li>Provide accurate and truthful information in all reports</li>
          <li>Not use the Service for illegal activities or fraud</li>
          <li>Respect the privacy and rights of other users</li>
          <li>Not post content that is offensive, defamatory, or violates intellectual property rights</li>
          <li>Verify the identity of claimants before releasing items or providing sensitive information</li>
        </ul>

        <h2>4. Report Limitations</h2>
        <p>
          To prevent spam and abuse, users are limited to creating 3 reports per day and 7 reports per month.
          Users may upload a maximum of 3 images per report.
        </p>

        <h2>5. Verification Requirements</h2>
        <p>
          Users must verify their email address before using the Service. For claiming items or persons, users must provide
          additional verification including phone number and government-issued ID (KTP/SIM).
        </p>

        <h2>6. Content Moderation</h2>
        <p>
          We reserve the right to remove any content that violates these Terms of Service or is deemed inappropriate.
          Users can report inappropriate content, which will be reviewed by our moderation team.
        </p>

        <h2>7. Liability Disclaimer</h2>
        <p>
          Temu Kembali is a platform service only. We are not responsible for:
        </p>
        <ul>
          <li>The accuracy of information posted by users</li>
          <li>Disputes between users regarding claims or ownership</li>
          <li>Loss, damage, or injury resulting from meetings arranged through the Service</li>
          <li>Fraudulent activities by users</li>
        </ul>

        <h2>8. Safety Guidelines</h2>
        <p>Users are advised to:</p>
        <ul>
          <li>Meet in public places when exchanging items</li>
          <li>Bring a friend or family member to meetings</li>
          <li>Verify the identity of the other party before meetings</li>
          <li>Report suspicious behavior to authorities</li>
        </ul>

        <h2>9. Intellectual Property</h2>
        <p>
          Users retain ownership of content they post. By posting content, users grant Temu Kembali a non-exclusive,
          worldwide license to use, display, and distribute the content for the purpose of operating the Service.
        </p>

        <h2>10. Termination</h2>
        <p>
          We reserve the right to terminate or suspend access to the Service for users who violate these Terms of Service,
          without prior notice or liability.
        </p>

        <h2>11. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms of Service at any time. Users will be notified of significant changes.
          Continued use of the Service after changes constitutes acceptance of the new terms.
        </p>

        <h2>12. Governing Law</h2>
        <p>
          These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction
          in which Temu Kembali operates.
        </p>

        <h2>13. Contact Information</h2>
        <p>
          For questions about these Terms of Service, please contact us through the contact form on our website.
        </p>
      </div>
    </div>
  );
}


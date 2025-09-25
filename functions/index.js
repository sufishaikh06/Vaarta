
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();
const db = admin.firestore();

// Set API key from Firebase config. The key should be set in your Firebase project environment.
// Run: firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
sgMail.setApiKey(functions.config().sendgrid.key);

/**
 * Cloud Function to send email when a new application is created.
 */
exports.sendApplicationEmail = functions.firestore
  .document("applications/{appId}")
  .onCreate(async (snap, context) => {
    const application = snap.data();
    const appId = context.params.appId;

    try {
      // 1. Fetch student's name from 'users' collection
      const studentRef = db.collection("users").doc(application.student_id);
      const studentDoc = await studentRef.get();
      const studentName = studentDoc.exists ? studentDoc.data().name : "A Student";

      // 2. Get faculty's email and name directly from the application document
      const facultyEmail = application.faculty_email;
      const facultyName = application.faculty_name || "Faculty Member";
      
      if (!facultyEmail) {
        console.error("Faculty email is missing in the application document:", appId);
        await db.collection("applications").doc(appId).update({ status: "failed", error: "Recipient email not found." });
        return;
      }

      // 3. Compose email
      const msg = {
        to: facultyEmail,
        from: "noreply@vaartabot.com", // This must be a verified sender in your SendGrid account
        subject: `New Application from ${studentName}`,
        text: `
          Dear ${facultyName},

          You have received a new application from ${studentName} (ID: ${application.student_id}).

          Application Content:
          --------------------
          ${application.content}
          --------------------

          Please log in to the VaartaBot system to review and take action.
        `,
        html: `
          <p>Dear ${facultyName},</p>
          <p>You have received a new application from <strong>${studentName}</strong> (ID: ${application.student_id}).</p>
          <hr>
          <h3>Application Content:</h3>
          <p style="white-space: pre-wrap;">${application.content}</p>
          <hr>
          <p>Please log in to the VaartaBot system to review and take action.</p>
        `,
      };

      // 4. Send email via SendGrid
      await sgMail.send(msg);

      // 5. Update application status to "sent"
      await db.collection("applications").doc(appId).update({ status: "sent" });

      console.log(`Email for application ${appId} sent successfully to: ${facultyEmail}`);

    } catch (error) {
      console.error(`Error sending email for application ${appId}:`, error);
      // Update status to "failed" with an error message
      await db.collection("applications").doc(appId).update({ status: "failed", error: error.message });
    }
  });

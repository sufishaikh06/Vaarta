
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const { defineSecret } = require('firebase-functions/params');

// Define the SendGrid API Key as a secret
const sendgridApiKey = defineSecret('sendgrid_api_key');

admin.initializeApp();
const db = admin.firestore();


/**
 * Cloud Function to send email when a new application is created.
 */
exports.sendApplicationEmail = functions
  .runWith({ secrets: [sendgridApiKey] })
  .firestore.document("applications/{appId}")
  .onCreate(async (snap, context) => {
    // Set the API key at the start of the function execution
    sgMail.setApiKey(sendgridApiKey.value());
    
    const application = snap.data();
    const appId = context.params.appId;

    try {
      // 1. Fetch student's name from 'users' collection - using a fallback for robustness
      let studentName = "A Student"; // Default fallback
      if (application.student_id) {
          const studentRef = db.collection("users").doc(application.student_id);
          const studentDoc = await studentRef.get();
          if (studentDoc.exists && studentDoc.data().name) {
              studentName = studentDoc.data().name;
          }
      }


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

          You have received a new application from ${studentName}.

          Application Content:
          --------------------
          ${application.content}
          --------------------

          Please log in to the VaartaBot system to review and take action.
        `,
        html: `
          <p>Dear ${facultyName},</p>
          <p>You have received a new application from <strong>${studentName}</strong>.</p>
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


/**
 * A callable function to test SendGrid email sending.
 */
exports.sendTestEmail = functions
  .runWith({ secrets: [sendgridApiKey] })
  .https.onCall(async (data, context) => {
    sgMail.setApiKey(sendgridApiKey.value());

    const msg = {
      to: "priya.mehta@example.com",
      from: "noreply@vaartabot.com",
      subject: "VaartaBot Email Test",
      text: "This is a test email from your VaartaBot application to confirm SendGrid is working.",
      html: "<strong>This is a test email from your VaartaBot application to confirm SendGrid is working.</strong>",
    };

    try {
      await sgMail.send(msg);
      console.log("Test email sent successfully.");
      return { success: true, message: "Test email sent to priya.mehta@example.com!" };
    } catch (error) {
      console.error("Error sending test email:", error);
      return { success: false, message: `Failed to send test email: ${error.message}` };
    }
});

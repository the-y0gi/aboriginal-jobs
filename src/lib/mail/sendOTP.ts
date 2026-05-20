import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOTP = async (
    email: string,
    otp: string
) => {
    try {
        console.log("EMAIL_USER:", process.env.EMAIL_USER);

        console.log(
            "EMAIL_PASS EXISTS:",
            !!process.env.EMAIL_PASS
        );

        // Verify SMTP connection
        await transporter.verify();

        console.log("SMTP connected successfully");

        // Send email
        await transporter.sendMail({
            from: `"Aboriginal Jobs Canada" <${process.env.EMAIL_USER}>`,

            to: email,

            subject:
                "Aboriginal Jobs Canada | OTP Verification Code",

            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; text-align: center;">
            
            <h2 style="color: #333;">
              Welcome to Aboriginal Jobs Canada 🚀
            </h2>
            
            <p style="font-size: 16px; color: #555;">
              Use the OTP below to complete your verification
            </p>

            <div style="margin: 20px 0; font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #000;">
              ${otp}
            </div>

            <p style="color: #888;">
              This OTP is valid for <b>10 minutes</b>.
            </p>

            <hr style="margin: 20px 0;" />

            <p style="font-size: 12px; color: #aaa;">
              If you didn’t request this, you can safely ignore this email.
            </p>

            <p style="font-size: 12px; color: #aaa;">
              © ${new Date().getFullYear()} Aboriginal Jobs Canada
            </p>

          </div>
        </div>
      `,
        });

        console.log(
            "OTP email sent successfully"
        );
    } catch (error: any) {
        console.error(
            "FULL SMTP ERROR:",
            error
        );

        throw error;
    }
};
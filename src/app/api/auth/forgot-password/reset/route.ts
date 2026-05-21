import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Verification } from "@/lib/models/Verification";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        
        if (!mongoose.connection.db) {
            return NextResponse.json(
                { error: "Database connection error" },
                { status: 500 }
            );
        }

        const body = await request.json();
        const email = body.email?.toLowerCase().trim();
        const otp = body.otp?.trim();
        const newPassword = body.newPassword;

        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // Verify OTP
        const record = await Verification.findOne({
            identifier: email,
            purpose: "password_reset",
            verified: true,
        });

        if (!record) {
            return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
        }

        // Check expiry
        const verifiedAt = new Date(record.updatedAt || record.createdAt);
        if (Date.now() - verifiedAt.getTime() > 5 * 60 * 1000) {
            await Verification.deleteMany({ identifier: email, purpose: "password_reset" });
            return NextResponse.json({ error: "Verification expired" }, { status: 400 });
        }

        // Find user
        const db = mongoose.connection.db;
        const userCollection = db.collection("user");
        const user = await userCollection.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Hash password with bcrypt 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password in account collection
        const accountCollection = db.collection("account");
        
        // First check if account exists
        const existingAccount = await accountCollection.findOne({ 
            userId: user._id, 
            providerId: "email" 
        });

        let updateResult;
        if (existingAccount) {
            updateResult = await accountCollection.updateOne(
                { _id: existingAccount._id },
                { 
                    $set: { 
                        password: hashedPassword,
                        updatedAt: new Date()
                    } 
                }
            );
        } else {
            // Create new account if doesn't exist
            updateResult = await accountCollection.insertOne({
                userId: user._id,
                providerId: "email",
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        const sessionCollection = db.collection("session");
        await sessionCollection.deleteMany({ userId: user._id.toString() });

        await Verification.deleteMany({ identifier: email, purpose: "password_reset" });

        return NextResponse.json({
            success: true,
            message: "Password reset successfully! You can now login with your new password.",
        });
    } catch (error: any) {
        console.error("RESET ERROR:", error);
        return NextResponse.json(
            { error: error.message || "Failed to reset password" },
            { status: 500 }
        );
    }
}
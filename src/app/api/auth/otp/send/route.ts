import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/mongoose";

import { Verification } from "@/lib/models/Verification";

import { sendOTP } from "@/lib/mail/sendOTP";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        {
          error: "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    // Check existing Better Auth user
    const existingUser = await mongoose.connection
      .collection("user")
      .findOne({
        email,
      });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Account already exists. Please login instead.",
        },
        {
          status: 400,
        }
      );
    }

    // Generate OTP
    const otpCode = crypto.randomInt(100000, 1000000).toString();

    // Remove old OTPs
    await Verification.deleteMany({
      identifier: email,
    });

    // Save OTP
    await Verification.create({
      identifier: email,
      value: otpCode,
      verified: false,
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    });

    // Send Email
    await sendOTP(email, otpCode);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error: any) {
    console.error("OTP SEND ERROR:", error);

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to send OTP",
      },
      {
        status: 500,
      }
    );
  }
}
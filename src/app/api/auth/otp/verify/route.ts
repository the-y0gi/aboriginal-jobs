import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";

import { Verification } from "@/lib/models/Verification";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const normalizedEmail =
      body.email?.toLowerCase().trim();

    const otp = body.otp?.trim();

    // Validation
    if (!normalizedEmail || !otp) {
      return NextResponse.json(
        {
          error: "Email and OTP are required.",
        },
        {
          status: 400,
        }
      );
    }

    // Find latest OTP
    const record = await Verification.findOne({
      identifier: normalizedEmail,
    }).sort({
      createdAt: -1,
    });

    // OTP not found
    if (!record) {
      return NextResponse.json(
        {
          error: "No OTP found for this email.",
        },
        {
          status: 400,
        }
      );
    }

    // OTP expired
    if (record.expiresAt < new Date()) {
      await Verification.deleteMany({
        identifier: normalizedEmail,
      });

      return NextResponse.json(
        {
          error:
            "OTP expired. Please request a new one.",
        },
        {
          status: 400,
        }
      );
    }

    // Invalid OTP
    if (record.value !== otp) {
      return NextResponse.json(
        {
          error: "Invalid OTP.",
        },
        {
          status: 400,
        }
      );
    }

    // Mark OTP verified
    record.verified = true;

    await record.save();

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error(
      "OTP VERIFY ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to verify OTP.",
      },
      {
        status: 500,
      }
    );
  }
}
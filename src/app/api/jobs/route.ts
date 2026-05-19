import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Employer } from "@/lib/models/Employer";
import { Job } from "@/lib/models/Job";
import { getAuth } from "@/lib/auth/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const jobs = await Job.find({ status: "active" }).sort({ postedAt: -1 }).lean();
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    console.error("Fetch jobs error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Auth check
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    const {
      title,
      company,
      city,
      province,
      employmentType,
      salary,
      category,
      descriptionHtml,
      requirementsHtml,
      indigenousOwned,
      contactEmail,
    } = body;

    // Validation
    if (!title?.trim())
      return NextResponse.json({ error: "Job title is required." }, { status: 400 });
    if (!company?.trim())
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    if (!city?.trim())
      return NextResponse.json({ error: "City is required." }, { status: 400 });
    if (!province?.trim())
      return NextResponse.json({ error: "Province is required." }, { status: 400 });
    if (!employmentType?.trim())
      return NextResponse.json({ error: "Employment type is required." }, { status: 400 });
    if (!category?.trim())
      return NextResponse.json({ error: "Category is required." }, { status: 400 });
    if (!descriptionHtml?.trim())
      return NextResponse.json({ error: "Job description is required." }, { status: 400 });
    if (!contactEmail?.trim())
      return NextResponse.json({ error: "Contact email is required." }, { status: 400 });

    // Find or create employer
    let employerRecord = await Employer.findOne({ userId });

    if (!employerRecord) {
      employerRecord = await Employer.create({
        userId,
        orgName: company.trim(),
      });
    }

    // Employment type mapping
    const typeMap: Record<string, string> = {
      "Full-time": "Full-time",
      "Part-time": "Part-time",
      Contract: "Contract",
      "Casual / Seasonal": "Casual",
      Volunteer: "Contract",
    };

    const mappedType = typeMap[employmentType] || "Full-time";
    const location = [city.trim(), province.trim()].join(", ");

    // Create job
    const createdJob = await Job.create({
      employerId: employerRecord._id,
      title: title.trim(),
      company: company.trim(),
      location,
      province: province.trim(),
      salary: salary?.trim() || "",
      employmentType: mappedType,
      category: category.trim(),
      description: descriptionHtml.trim(),
      requirements: requirementsHtml?.trim() || "",
      status: "active",
      indigenousPreference: indigenousOwned ?? false,
    });

    return NextResponse.json(
      { success: true, jobId: createdJob._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

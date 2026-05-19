import { Schema, model, models } from "mongoose";

const JobSchema = new Schema(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    salary: String,
    employmentType: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Contract",
        "Temporary",
        "Casual",
        "Seasonal",
      ],
      default: "Full-time",
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: String,
    status: {
      type: String,
      enum: ["draft", "active", "closed", "expired"],
      default: "active",
    },
    indigenousPreference: {
      type: Boolean,
      default: true,
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

// IMPORTANT query indexes
JobSchema.index({ employerId: 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ province: 1 });
JobSchema.index({ category: 1 });
JobSchema.index({ postedAt: -1 });

export const Job = models.Job || model("Job", JobSchema);

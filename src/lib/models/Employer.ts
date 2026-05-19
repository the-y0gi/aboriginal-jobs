import { Schema, model, models } from "mongoose";

const EmployerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    orgName: {
      type: String,
      required: true,
      trim: true,
    },
    website: String,
    province: String,
    description: String,
    logoUrl: String,
  },
  {
    timestamps: true,
  }
);

EmployerSchema.index({ userId: 1 });
EmployerSchema.index({ orgName: 1 });

export const Employer = models.Employer || model("Employer", EmployerSchema);

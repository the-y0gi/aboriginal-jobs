import { Schema, model, models } from "mongoose";

const VerificationSchema = new Schema(
  {
    identifier: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

VerificationSchema.index({ identifier: 1 });

export const Verification =
  models.Verification || model("Verification", VerificationSchema);

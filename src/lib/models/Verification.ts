import { Schema, model, models } from "mongoose";

const VerificationSchema = new Schema(
  {
    identifier: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

VerificationSchema.index({
  identifier: 1,
});

VerificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const Verification =
  models.Verification ||
  model("Verification", VerificationSchema);
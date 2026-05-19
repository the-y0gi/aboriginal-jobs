import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    accountType: {
      type: String,
      enum: ["jobseeker", "employer"],
      default: "jobseeker",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });

export const User = models.User || model("User", UserSchema);

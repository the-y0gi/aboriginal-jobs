import { Schema, model, models } from "mongoose";

const SessionSchema = new Schema(
  {
    expiresAt: {
      type: Date,
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

SessionSchema.index({ token: 1 });
SessionSchema.index({ userId: 1 });

export const Session = models.Session || model("Session", SessionSchema);

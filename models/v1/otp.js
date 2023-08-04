const mongoose = require("mongoose");

const { Schema } = mongoose;

const otpSchema = Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    otp: { type: String, required: true, default: "000000" },
    expiry: { type: Number, required: true, default: 180 },
    attempts: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = (connection) => connection.model("otp", otpSchema);

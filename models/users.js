const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = Schema(
  {
    name: { type: String, required: true },
    displayName: { type: String, unique: true },
    email: { type: String, required: true, unique: true, trim: true },
    status: { type: String },
    photoURL: { type: String },
    authorized: { type: Boolean, default: false },
    password: { type: String, required: true, trim: true },
    salt: { type: String, required: true },
    agreeService: { type: Boolean, required: true },
    agreePrivacy: { type: Boolean, required: true },
    role: { type: String, required: true, default: "user" },
    point: { type: Number },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);

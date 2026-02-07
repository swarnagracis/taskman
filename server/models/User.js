const mongoose = require("mongoose");

/**
 * User collection (MongoDB: users)
 * Stores authentication and profile data. Referenced by Task.assignedTo and Task.createdBy.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [255, "Email cannot exceed 255 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // exclude from find() by default; use .select('+password') when needed
    },
    role: {
      type: String,
      enum: { values: ["admin", "member"], message: "Role must be admin or member" },
      default: "member",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false, transform: (doc, ret) => { delete ret.password; return ret; } },
  }
);

// Indexes for common queries
userSchema.index({ email: 1 }, { unique: true }); // login, register uniqueness
userSchema.index({ role: 1 }); // optional: filter users by role

module.exports = mongoose.model("User", userSchema);

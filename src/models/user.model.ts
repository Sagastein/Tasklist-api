// user.model.ts
import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import { Document } from "mongoose";
enum TypeRole {
  user = "user",
  admin = "admin",
}
export interface IUser extends Document {
  id: number;
  username: string;
  email: string;
  password: string;
  role: TypeRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: [TypeRole.user, TypeRole.admin],
      default: TypeRole.user,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  this.email = this.email.toLowerCase();
  next();
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this;
  return bcrypt.compare(candidatePassword, user.password);
};
userSchema.pre("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});
userSchema.pre("save", function (next) {
  const now = new Date();
  //format data

  this.updatedAt = now;
  next();
});

export const User = mongoose.model<IUser>("User", userSchema);

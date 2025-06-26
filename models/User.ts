import mongoose, { model, models, Schema } from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId; // Optional for new documents
  email: string;
  firstname: string;
  lastname: string;
  clerkId: string;
  isEmailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email must be unique"],
      lowercase: true,
      trim: true,
    },
    firstname: {
      type: String,
      required: [true, "fullname is required"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "fullname is required"],
      trim: true,
    },
    clerkId: {
      type: String,
      required: [true, "clerkId is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = models?.User || model<IUser>("User", userSchema);

export default User;

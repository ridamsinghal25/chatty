import mongoose, { model, models, Schema } from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId; // Optional for new documents
  email: string;
  name: string;
  clerkId: string;
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
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    clerkId: {
      type: String,
      required: [true, "clerkId is required"],
    },
  },
  { timestamps: true }
);

const User = models?.User || model<IUser>("User", userSchema);

export default User;

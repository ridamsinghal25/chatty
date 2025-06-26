import mongoose, { model, models, Schema } from "mongoose";

export interface IChat {
  _id?: mongoose.Types.ObjectId; // Optional for new documents
  userId: mongoose.Types.ObjectId;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const chatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Chat = models?.Chat || model<IChat>("Chat", chatSchema);

export default Chat;

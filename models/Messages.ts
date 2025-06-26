import mongoose, { model, models, Schema } from "mongoose";
import { CONTENT_TYPE_ENUM, ROLE_ENUM } from "../utils/constants.js";

// Enums
export enum Role {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export enum ContentType {
  TEXT = "text",
  IMAGE = "image",
}

export type MessageContent = {
  type: "text" | "image";
  text?: string;
  image?: string;
};

// Main Message Interface
export interface IMessage {
  _id?: mongoose.Types.ObjectId; // Optional for new documents
  chatId: mongoose.Types.ObjectId;
  role: Role;
  content: MessageContent[];
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    role: {
      type: String,
      enum: ROLE_ENUM,
      required: true,
    },
    content: [
      {
        type: {
          type: String,
          enum: CONTENT_TYPE_ENUM,
          required: true,
        },
        text: {
          type: String,
          required: function (this: any) {
            return this.type === "text";
          },
        },
        image: {
          type: String,
          required: function (this: any) {
            return this.type === "image";
          },
        },
      },
    ],
  },
  { timestamps: true }
);

const Message = models?.Message || model<IMessage>("Message", messageSchema);

export default Message;

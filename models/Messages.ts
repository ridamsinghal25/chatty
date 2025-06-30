import mongoose, { model, models, Schema } from "mongoose";
import { ROLE_ENUM } from "../utils/constants.js";

// Enums
export enum Role {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export type Attachment = {
  name?: string;
  url?: string;
  contentType?: string;
};

export type ForkedVersion = {
  version: number;
  messageId: mongoose.Types.ObjectId;
};

// Main Message Interface
export interface IMessage {
  _id?: mongoose.Types.ObjectId; // Optional for new documents
  chatId: mongoose.Types.ObjectId;
  role: Role;
  content: string;
  attachment: Attachment; // Optional, can be undefined
  forkMessageGroupId?: mongoose.Types.ObjectId;
  version?: number;
  active?: boolean;
  forkedVersions?: ForkedVersion[];
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
    content: {
      type: String,
      required: true,
    },
    attachment: {
      type: { name: String, url: String, contentType: String },
    },
    forkMessageGroupId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    version: {
      type: Number,
      default: 1,
    },
    active: {
      type: Boolean,
      default: true,
    },
    forkedVersions: {
      type: [
        {
          version: Number,
          messageId: Schema.Types.ObjectId,
        },
      ],
      default: undefined,
    },
  },

  { timestamps: true }
);

const Message = models?.Message || model<IMessage>("Message", messageSchema);

export default Message;

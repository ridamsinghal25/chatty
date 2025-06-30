export const ROLE_ENUM = ["user", "assistant", "system"];

export const CONTENT_TYPE_ENUM = ["text", "image"];

export const DB_NAME = "chatty";

export const ROUTES = {
  NEW_CHAT: "/",
  CHAT: "/c/:id",
};

export const API_ROUTES = {
  CHAT: "/api/chat",
  MESSAGE: "/api/message",
  EDIT_MESSAGE: "/api/edit-message",
  CLOUDINARY: "/api/cloudinary",
};

export const CONTEXT_WINDOW_SIZE = 15;

export const models = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Great for most tasks",
  },
  {
    id: "gpt-4o-mini",
    name: "o4-mini",
    description: "Fastest at advanced reasoning",
  },
  {
    id: "gpt-4.1-mini",
    name: "GPT-4.1-mini",
    description: "Fastest for everyday tasks",
  },
];

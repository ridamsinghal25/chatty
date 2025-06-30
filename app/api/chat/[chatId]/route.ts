import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/utils/connecToDB";
import { auth } from "@clerk/nextjs/server";
import Chat from "@/models/Chat";
import User from "@/models/User";
import Message from "@/models/Messages";
import mongoose from "mongoose";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const { userId } = await auth();

  if (!userId)
    return NextResponse.json(
      { success: false, message: "Unauthorized request" },
      { status: 401 }
    );

  // Connect to the database
  await connectToDB();

  const user = await User.findOne({
    clerkId: userId,
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 401 }
    );
  }

  try {
    const { chatId } = await params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid chat Id" },
        { status: 400 }
      );
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { status: 404 }
      );
    }

    const deleteMessages = await Message.deleteMany({
      chatId,
    });

    if (!deleteMessages.deletedCount) {
      return NextResponse.json(
        { success: false, message: "Failed to delete messages" },
        { status: 500 }
      );
    }

    const deleteChat = await Chat.findByIdAndDelete(chatId);

    if (!deleteChat) {
      return NextResponse.json(
        { success: false, message: "Failed to delete chat" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Chat deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while deleting chat: ", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete chat" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const { userId } = await auth();

  if (!userId)
    return NextResponse.json(
      { success: false, message: "Unauthorized request" },
      { status: 401 }
    );

  // Connect to the database
  await connectToDB();

  const user = await User.findOne({
    clerkId: userId,
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 401 }
    );
  }

  try {
    const { chatId } = await params;
    const { title } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid chat Id" },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Please provide a chat Id and title" },
        { status: 400 }
      );
    }

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: {
          title,
        },
      },
      { new: true }
    );

    if (!chat) {
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: chat, message: "Chat renamed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while renaming chat: ", error);
    return NextResponse.json(
      { success: false, message: "Failed to rename chat" },
      { status: 500 }
    );
  }
}

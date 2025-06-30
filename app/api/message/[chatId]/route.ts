import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/utils/connecToDB";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";
import Message, { Attachment } from "@/models/Messages";
import mongoose from "mongoose";

export async function GET(
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

    const messages = await Message.find({
      chatId,
    }).sort({ createdAt: 1 }); // sort by old chat messages first

    return NextResponse.json(
      { success: true, data: messages, message: "Chat messages fetched" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while getting chat messages: ", error);
    return NextResponse.json(
      { success: false, message: "Error while getting chat messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
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
    const formData = await request.formData();
    const role = formData.get("role") as string;
    const content = formData.get("content") as string;
    const forkMessageGroupId = formData.get("forkMessageGroupId") as string;
    const version = formData.get("version") as string;
    const attachments = formData.getAll("attachments") as Attachment[];

    const { chatId } = await params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid chat Id" },
        { status: 400 }
      );
    }

    if (!role || !content) {
      return NextResponse.json(
        { success: false, message: "Please provide a role and content" },
        { status: 400 }
      );
    }

    const message = await Message.create({
      chatId,
      role,
      content,
      attachments,
      forkMessageGroupId: forkMessageGroupId ? forkMessageGroupId : null,
      version: version ? parseInt(version) : 1,
    });

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Error while creating message" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: message, message: "Message created" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while creating message: ", error);
    return NextResponse.json(
      { success: false, message: "Error while creating message" },
      { status: 500 }
    );
  }
}

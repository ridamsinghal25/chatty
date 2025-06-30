import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/utils/connecToDB";
import { auth } from "@clerk/nextjs/server";
import Chat from "@/models/Chat";
import User from "@/models/User";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(request: NextRequest) {
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
    const { userQuery } = await request.json();

    if (!userQuery) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid query" },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Generate a concise and descriptive title (3 to 4 words) based on the following user query:\n\nUser query: "${userQuery}"\n\nTitle:`,
    });

    console.log("first title: ", text);

    const chat = await Chat.create({
      userId: user._id,
      title: text || "New Chat",
    });

    if (!chat) {
      return NextResponse.json(
        { success: false, message: "Failed to create chat" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: chat, message: "Chat created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while creating chat: ", error);
    return NextResponse.json(
      { success: false, message: "Failed to create chat" },
      { status: 500 }
    );
  }
}

export async function GET() {
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
    const chats = await Chat.find({
      userId: user._id,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json(
      { success: true, data: chats, message: "Chats fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while getting chats: ", error);
    return NextResponse.json(
      { success: false, message: "Failed to get chats" },
      { status: 500 }
    );
  }
}

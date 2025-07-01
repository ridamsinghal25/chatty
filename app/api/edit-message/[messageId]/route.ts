import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/utils/connecToDB";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";
import Message from "@/models/Messages";
import mongoose from "mongoose";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
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
    const { messageId } = await params;
    const { content } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid message Id" },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { success: false, message: "Please provide a content" },
        { status: 400 }
      );
    }

    const originalMessage = await Message.findById(messageId);

    if (!originalMessage) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    // Working on it for future version
    // let forkMessageGroupId;

    // if (originalMessage.forkMessageGroupId) {
    //   forkMessageGroupId = originalMessage.forkMessageGroupId;

    //   await Message.updateMany(
    //     {
    //       forkMessageGroupId: originalMessage.forkMessageGroupId,
    //       active: true,
    //       version: originalMessage.version,
    //     },
    //     {
    //       $set: {
    //         forkMessageGroupId: originalMessage.forkMessageGroupId,
    //         active: false,
    //       },
    //     }
    //   );
    // } else {
    //   forkMessageGroupId = new mongoose.Types.ObjectId().toString();

    //   const updatedOriginalMessage = await Message.findByIdAndUpdate(
    //     messageId,
    //     {
    //       $set: {
    //         forkMessageGroupId,
    //         active: false,
    //       },
    //     },
    //     { new: true }
    //   );

    //   if (!updatedOriginalMessage) {
    //     return NextResponse.json(
    //       { success: false, message: "Error while updating message" },
    //       { status: 500 }
    //     );
    //   }
    // }

    const message = await Message.create({
      chatId: originalMessage.chatId,
      role: originalMessage.role,
      content,
      attachments: originalMessage.attachments,
      version: originalMessage.version + 1,
    });

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Error while creating message" },
        { status: 500 }
      );
    }

    // Working on it for future versions
    /**
    const allVersions = await Message.find({
      chatId: originalMessage.chatId,
      forkMessageGroupId,
    })
      .select("_id version")
      .sort({ version: 1 });

    const forkedVersions = allVersions.map((m) => ({
      version: m.version,
      messageId: m._id,
    }));

    await Message.updateMany(
      {
        _id: {
          $in: allVersions.map((m) => m._id),
        },
      },
      {
        $set: {
          forkedVersions,
        },
      }
    );
    */
    return NextResponse.json(
      { success: true, data: message, message: "Message updated" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while editing message: ", error);
    return NextResponse.json(
      { success: false, message: "Error while editing message" },
      { status: 500 }
    );
  }
}

import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/utils/connecToDB";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Server-side function used to sign an Upload Widget upload.
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
    const body = await request.json();
    const { paramsToSign } = body;

    if (!process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { success: false, message: "Cloudinary API secret not found" },
        { status: 500 }
      );
    }

    const signature = await cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json(
      { signature, apikey: process.env.CLOUDINARY_API_KEY },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while signing cloudinary: ", error);
    return NextResponse.json(
      { success: false, message: "Error while signing cloudinary" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();

  if (!userId)
    return NextResponse.json(
      { success: false, message: "Unauthorized request" },
      { status: 401 }
    );

  try {
    const { publicId, resourceType } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid publicId" },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return NextResponse.json(
      { success: true, message: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while deleting image: ", error);
    return NextResponse.json(
      { success: false, message: "Error while deleting image" },
      { status: 500 }
    );
  }
}

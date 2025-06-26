import User from "@/models/User";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import connectToDB from "@/utils/connecToDB";

export async function POST(req: NextRequest) {
  try {
    const event = await verifyWebhook(req);

    const eventType = event.type;

    if (eventType === "user.created") {
      try {
        // Connect to the database
        await connectToDB();

        const { email_addresses, primary_email_address_id } = event.data;

        const primaryEmail = email_addresses.find(
          (email) => email.id === primary_email_address_id
        );

        if (!primaryEmail) {
          return new Response("Error occured - No primary email", {
            status: 400,
          });
        }

        // Create a new user
        const user = await User.create({
          clerkId: event.data.id,
          email: primaryEmail.email_address,
          name: event.data.first_name,
        });

        if (!user) {
          return new Response("Error occured - Failed to create user", {
            status: 400,
          });
        }

        console.log("New user created");
      } catch (error) {
        console.log('error in "webhook/register" route:', error);
        // Handle error in user creation
        return new Response("Error occured - Failed to create user", {
          status: 400,
        });
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}

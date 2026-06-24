import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { WelcomeEmail } from "@/components/emails/welcome-email";

const schema = z.object({
  email: z.email(),
});

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return NextResponse.json(
      { message: "Email delivery is not configured" },
      { status: 503 },
    );
  }

  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: "A valid email address is required" },
      { status: 400 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: parsed.data.email,
    subject: "Welcome to AddressBook",
    react: WelcomeEmail({ email: parsed.data.email }),
  });

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ id: data?.id });
}

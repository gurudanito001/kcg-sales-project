import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as jwt from 'jsonwebtoken';
import sendEmail from "@/services/sendEmail";

export async function POST(request: Request) {
  try {
    const data: {email: string} = await request.json();
    let user = await prisma.employee.findUnique({
      where: {email: data.email}
    })
    if(!user){
      return new NextResponse(JSON.stringify({message: `User with email Not Found!`}), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }); 
    }
    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      process.env.TOKEN_KEY as string,
      {
        expiresIn: "2h",
      }
    );
    //send email
    await sendEmail({email: user.email, url: `${process.env.BASE_URL}/auth/changePassword?token=${token}`, message: "reset your password"})

    return new NextResponse(JSON.stringify({message: `A Reset Password Link was sent to your email: ${user.email}`}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }); 
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}
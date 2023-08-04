

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

type LoginCredentials = {
  email: string
  password: string
}
export async function POST(request: Request) {
  try {
    const data: LoginCredentials = await request.json();
    // find user in database
    const user: any = await prisma.employee.findFirst({
      where: {email: data.email}
    });
    if (user && (await bcrypt.compare(data.password as string, user.password as string))) {
      
      // Create token
      const token = jwt.sign(
        { user_id: user.id, email: user.email },
        process.env.TOKEN_KEY as string,
        {
          expiresIn: "2h",
        }
      );
      // add token to user object
      user.token = token;
      // return new user
      delete user.password;
      return new NextResponse(JSON.stringify({message: "Login Successful", data: user}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }); 
    }
    
    return new NextResponse(JSON.stringify({message: "Invalid Email or Password"}), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }); 
    
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
}
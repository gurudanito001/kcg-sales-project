import { prisma } from "@/lib/prisma";
import { Prisma } from '@prisma/client'
import { NextResponse } from "next/server";
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

type TokenData = {
  email: string,
  user_id: string
}

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    const data: {password: string, confirmPassword: string} = await request.json();
    if(data.password !== data.confirmPassword){
      return new NextResponse(JSON.stringify({message: "Passwords do not match"}), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }); 
    }
    if(process.env.TOKEN_KEY){
      let {user_id, email} = await jwt.verify(token, process.env.TOKEN_KEY) as TokenData;
      const user = await prisma.employee.findUnique({
        where: {
          id: user_id,
        },
      }) ;
      if(!user){
        return new NextResponse(JSON.stringify({message: "User Not Found!"}), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }); 
      }
      // hash password
      let encryptedPassword
      if(typeof data.password === "string") encryptedPassword = await bcrypt.hash(data.password, 10);
      let updateData: any = {...user, password: encryptedPassword}
      await prisma.employee.update({
        where: { id: user_id },
        data: updateData
      });
      return new NextResponse(JSON.stringify({message: "Password Change Successful!"}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }); 
    }
    
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}
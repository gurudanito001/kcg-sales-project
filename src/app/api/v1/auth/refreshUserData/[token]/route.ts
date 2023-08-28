import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as jwt from 'jsonwebtoken';

type TokenData = {
  user_id: string
  email: string
}

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    if(process.env.TOKEN_KEY){
      let {user_id} = await jwt.verify(token, process.env.TOKEN_KEY) as TokenData;
      
      const user: any = await prisma.employee.findUnique({
        where: {
          id: user_id,
        },
      });
      if(!user){
        return new NextResponse(JSON.stringify({message: "User Not Found!"}), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }); 
      }
      // Create token
      const newToken = jwt.sign(
        { user_id: user.id, email: user.email, staffCadre: user.staffCadre },
        process.env.TOKEN_KEY as string,
        {
          expiresIn: "2h",
        }
      );
      // add token to user object
      user.token = token;
      // return new user
      delete user.password;
      return new NextResponse(JSON.stringify({message: "User Data Refreshed", data: user}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }); 
    }
    
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}
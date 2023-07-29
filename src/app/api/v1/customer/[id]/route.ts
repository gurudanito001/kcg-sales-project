import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

let modelName = "Customer"
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const data = await prisma.customer.findUnique({
    where: {
      id,
    },
  });

  if (!data) {
    return new NextResponse(JSON.stringify({message: `${modelName} with ID Not Found!`}), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    }); 
  }

  return new NextResponse(JSON.stringify({message: `${modelName} fetched successfully`, data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  }); 
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string }}
) {
  const id = params.id;
  let json = await request.json();

  const updatedData = await prisma.customer.update({
    where: { id },
    data: json,
  });

  if (!updatedData) {
    return new NextResponse(JSON.stringify({message: `${modelName} with ID not found`}), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    }); 
  }

  return new NextResponse(JSON.stringify({ message: `${modelName} updated successfully`, data: updatedData}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  }); 
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  await prisma.customer.delete({
    where: { id },
  });
  return new NextResponse(JSON.stringify({message: `${modelName} deleted with Id: ${id}`}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  }); 
} 


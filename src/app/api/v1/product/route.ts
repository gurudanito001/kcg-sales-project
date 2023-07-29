import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


let routeName = "Product"
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || "1");
  const take = parseInt(searchParams.get('take') || "10");
  //const offers = await prisma.offer.findMany()

  let myCursor = "";
  const data = await prisma.product.findMany({
    take: take,
    skip: (page - 1) * take,
    ...(myCursor !== "" && {
      cursor: {
        id: myCursor,
      }
    })
  })
  if(!data){
    return new NextResponse(JSON.stringify({ message: `Failed to fetch ${routeName} list`, data: null}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }); 
  }
  const totalCount = await prisma.product.count()
  const lastItemInData = data[(page * take) - 1] // Remember: zero-based index! :)
  myCursor = lastItemInData?.id // Example: 29

  return new NextResponse(JSON.stringify({page, take, totalCount, message: `${routeName} list fetched successfully`, data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  }); 
    
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    // validate data here
    const data = await prisma.product.create({
      data: json,
    });
    return new NextResponse(JSON.stringify({ message: `${routeName} Created successfully`, data }), { 
     status: 201, 
     headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
} 

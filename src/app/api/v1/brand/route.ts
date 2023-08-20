import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { uploadImage } from "@/services/imageService";


let routeName = "Brand"
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || "1");
    const take = parseInt(searchParams.get('take') || "10");

    const code = searchParams.get('code');
    const name = searchParams.get('name');

    let myCursor = "";
    const data = await prisma.brand.findMany({
      where: {
        ...(code && { code: { contains: code, mode: 'insensitive' } }),
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
      },
      take: take,
      skip: (page - 1) * take,
      ...(myCursor !== "" && {
        cursor: {
          id: myCursor,
        }
      }),
      include: {
        _count: { 
          select: {products: true}
        }
      },
    })
    if(!data){
      return new NextResponse(JSON.stringify({ message: `Failed to fetch ${routeName} list`, data: null}), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }); 
    }
    const totalCount = await prisma.brand.count({
      where: {
        ...(code && { code: { contains: code, mode: 'insensitive' } }),
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
      }
    })
    const lastItemInData = data[(page * take) - 1] // Remember: zero-based index! :)
    myCursor = lastItemInData?.id // Example: 29

    return new NextResponse(JSON.stringify({page, take, totalCount, message: `${routeName} list fetched successfully`, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }); 
  } catch (error: any) {
    return new NextResponse(JSON.stringify({message: error.message}), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  
    
}

export async function POST(request: Request) {
  try {
    let result;
    const json = await request.json();
    // validate data here
    if(json.logo.startsWith("data:image")){
      console.log(json.logo)
      result = await uploadImage({ data: json.logo });
      console.log(result)
      json.logo = result.secure_url
    }

    const data = await prisma.brand.create({
      data: json,
    });
    return new NextResponse(JSON.stringify({ message: `${routeName} Created successfully`, data }), { 
     status: 201, 
     headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({message: error.message }), { status: 500 });
  }
} 

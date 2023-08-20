import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { uploadImage } from "@/services/imageService";


let routeName = "Product"
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || "1");
    const take = parseInt(searchParams.get('take') || "10");

    const code = searchParams.get('code');
    const name = searchParams.get('name');
    const brandId = searchParams.get('brandId');
  
    let myCursor = "";
    const data = await prisma.product.findMany({
      where: {
        ...(code && { code: { contains: code, mode: 'insensitive' } }),
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(brandId && { brandId }),
      },
      take: take,
      skip: (page - 1) * take,
      ...(myCursor !== "" && {
        cursor: {
          id: myCursor,
        }
      }),
      include: {
        brand: true,
        price: true
      }
    })
    if(!data){
      return new NextResponse(JSON.stringify({ message: `Failed to fetch ${routeName} list`, data: null}), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }); 
    }
    const totalCount = await prisma.product.count({
      where: {
        ...(code && { code: { contains: code, mode: 'insensitive' } }),
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(brandId && { brandId }),
      }
    })
    const lastItemInData = data[(page * take) - 1] // Remember: zero-based index! :)
    myCursor = lastItemInData?.id // Example: 29
  
    return new NextResponse(JSON.stringify({page, take, totalCount, message: `${routeName} list fetched successfully`, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }); 
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ message: error.message}), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }); 
  }

    
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    // validate data here
    if(json.images.length > 0){
      let productImagesUrls = await Promise.all(
        json.images.map(async (base64Img: any) => {
          let image = await uploadImage({data: base64Img.uri});
          return image.secure_url;
        })
      )
      json.images = productImagesUrls;
    }
    const data = await prisma.product.create({
      data: json,
    });
    return new NextResponse(JSON.stringify({ message: `${routeName} Created successfully`, data }), { 
     status: 201, 
     headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ message: error.message}), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }); 
  }
} 

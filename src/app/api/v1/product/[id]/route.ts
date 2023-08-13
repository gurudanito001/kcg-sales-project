import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { uploadImage } from "@/services/imageService";

let modelName = "Product"
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        brand: true
      }
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
  } catch (error: any) {
    return new NextResponse(JSON.stringify({message: error.message}), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }); 
  }

}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string }}
) {
  try {
    const id = params.id;
    let json = await request.json();

    if(json?.newImages?.length > 0){
      let productImagesUrls = await Promise.all(
        json.newImages.map(async (base64Img: any) => {
          let image = await uploadImage({data: base64Img.uri});
          return image.secure_url;
        })
      )
      json.images = [...json.images, ...productImagesUrls];
    }
    delete json.newImages;
    const updatedData = await prisma.product.update({
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
  } catch (error: any) {
    return new NextResponse(JSON.stringify({message: error.message}), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await prisma.product.delete({
      where: { id },
    });
    return new NextResponse(JSON.stringify({message: `${modelName} deleted with Id: ${id}`}), {
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


import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

let modelName = "Visit Report"
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const singleReport = searchParams.get('singleReport');

    const id = params.id;
    let data;
    if(singleReport){
      data = await prisma.visitReport.findUnique({
        where: {
          id
        },
        include: {
          customer: true,
          contactPerson: true
        }
      });
    }else {
      data = await prisma.visitReport.findMany({
        where: {
          customerId: id
        },
        include: {
          customer: true,
          contactPerson: true
        }
      });
    }

  
    return new NextResponse(JSON.stringify({message: `${modelName}s fetched successfully`, data }), {
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
  
    const updatedData = await prisma.visitReport.update({
      where: { id },
      data: json,
    });

    let lastVisit = json.followUpVisits[json.followUpVisits.length - 1];
    await prisma.customer.update({
      where: {
        id: updatedData.customerId
      },
      data: {lastVisited: lastVisit.meetingDate}
    })

    await prisma.visitReport.update({
      where: {
        id: updatedData.id
      },
      data: {nextVisitDate: lastVisit.nextVisitDate}
    })

    //nextVisitDate: lastVisit.nextVisitDate
  
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
    await prisma.visitReport.delete({
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


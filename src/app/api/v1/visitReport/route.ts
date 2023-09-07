import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


let routeName = "Visit Report"
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || "1");
    const take = parseInt(searchParams.get('take') || "10");
    
    const employeeId = searchParams.get('employeeId');
    const customerId = searchParams.get('customerId');
    const contactPersonId = searchParams.get('contactPersonId');
  
    let myCursor = "";
    const allCustomers = prisma.customer.findMany({
      where: {
        ...(employeeId && { employeeId }),
        ...(customerId && { customerId }),
        ...(contactPersonId && { contactPersonId }),
      }
    })
    const data = await prisma.visitReport.findMany({
      where: {
        ...(employeeId && { employeeId }),
        ...(customerId && { customerId }),
        ...(contactPersonId && { contactPersonId }),
      },
      take: take,
      skip: (page - 1) * take,
      ...(myCursor !== "" && {
        cursor: {
          id: myCursor,
        }
      }),
      include: {
        employee: true,
        customer: true,
        contactPerson: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    if(!data){
      return new NextResponse(JSON.stringify({ message: `Failed to fetch ${routeName} list`, data: null}), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }); 
    }
    const totalCount = await prisma.visitReport.count({
      where: {
        ...(employeeId && { employeeId }),
        ...(customerId && { customerId }),
        ...(contactPersonId && { contactPersonId }),
      }
    })
    const lastItemInData = data[(page * take) - 1] // Remember: zero-based index! :)
    myCursor = lastItemInData?.id // Example: 29
  
    return new NextResponse(JSON.stringify({page, take, totalCount, message: `${routeName} list fetched successfully`, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }); 
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }); 
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    // validate data here
    const data = await prisma.visitReport.create({
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

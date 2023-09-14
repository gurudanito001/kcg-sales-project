import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


let routeName = "Visit Report"
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || "1");
    const take = parseInt(searchParams.get('take') || "10");
    
    const employeeId = searchParams.get('employeeId');
    let approved: any = searchParams.get('approved');
    const state = searchParams.get('state');
    const companyName = searchParams.get('companyName');

    if(approved === "approved"){
      approved = true
    }else if(approved === "unApproved"){
      approved = false
    }else{
      approved === null
    }
  
    let myCursor = "";
    const data = await prisma.customer.findMany({
      where: {
        ...(employeeId && { employeeId }),
        ...(approved === null ? { OR: [{ approved: true }, { approved: false },] } : { approved }),
        ...(state && { state }),
        ...(companyName && { companyName: { contains: companyName, mode: 'insensitive' } }),
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
        _count: {
          select: {visitReports: true}
        }
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
    const totalCount = await prisma.customer.count({
      where: {
        ...(employeeId && { employeeId }),
        ...(approved === null ? { OR: [{ approved: true }, { approved: false },] } : { approved }),
        ...(state && { state }),
        ...(companyName && { companyName: { contains: companyName, mode: 'insensitive' } }),
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
    await prisma.customer.update({
      where: {
        id: json.customerId
      },
      data: {lastVisited: json.visitDate}
    })
    return new NextResponse(JSON.stringify({ message: `${routeName} Created successfully`, data }), { 
     status: 201, 
     headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
} 

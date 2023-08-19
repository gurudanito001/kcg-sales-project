"use client"

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiService";
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';
import { useRouter } from "next/navigation";
import clipLongText from "@/services/clipLongText";

const LoadingFallBack = () =>{
  return (
    <>
      <tr sx={{ width: "100%" }}>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
      </tr>
      <tr sx={{ width: "100%" }}>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
      </tr>
      <tr sx={{ width: "100%" }}>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
      </tr>
    </>
    
  );
}


const InvoiceRequests = () =>{  
  const dispatchMessage = useDispatchMessage();
  const router = useRouter();



  const {data, isFetching} = useQuery({
    queryKey: ["allInvoiceRequests" ],
    queryFn:  ()=>apiGet({ url: "/invoiceRequestForm"})
    .then(res => {
      console.log(res)
      return res.data
    })
    .catch(error =>{
      console.log(error)
      dispatchMessage({severity: "error", message: error.message})
    })
  })

  const listInvoiceRequests = () =>{
    return data.map( (item, index) => {
      const {id, employee, invoiceName, product, brand, quantity, approved, invoiceNumber, invoiceDate, delivery, payment} = item;
      return( 
        <tr key={id} className="hover">
          <td className="border-bottom-0"><h6 className="fw-semibold mb-0">{index + 1}</h6></td>
          <td className="border-bottom-0 link-style" onClick={()=>router.push(`/invoiceRequests/${id}`)}>
            <h6 className="fw-semibold mb-1 text-primary">{employee.firstName} {employee.lastName}</h6>
            <span className="fw-normal">{employee.email}</span>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal">{invoiceName}</p>
          </td>
          <td className="border-bottom-0">
            <h6 className="fw-semibold mb-1">{brand.name} {employee.lastName}</h6>
            <span className="fw-normal">{product.name}</span>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal">{quantity}</p>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal">{approved ? "Approved" : "Pending"}</p>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal">{invoiceNumber}</p>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal">{invoiceDate}</p>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal">{delivery}</p>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal">{payment}</p>
          </td>
          <td className="border-bottom-0">
            <a className="btn btn-link text-primary ms-auto" href={`/invoiceRequests/${id}/edit`}>Edit</a>
          </td>
        </tr>
    )
    })
  }

  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Invoice Requests</h4>
        <a className="btn btn-link text-primary ms-auto" href="/invoiceRequests/add">Add</a>
      </header>

      <div className="row">
          <div className="col-12 d-flex align-items-stretch">
            <div className="card w-100">
              <div className="card-body p-4">
                <h5 className="card-title fw-semibold mb-4 opacity-75">All Invoice Requests</h5>
                <div className="table-responsive">
                  <table className="table text-nowrap mb-0 align-middle">
                    <thead className="text-dark fs-4">
                      <tr>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">#</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Sales Rep</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Invoice Name</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Model</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Qty</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Status</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Inv Number</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Inv Date</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Delivery</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Payment</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Actions</h6>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        {data ? listInvoiceRequests() : <LoadingFallBack />}                 
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default InvoiceRequests
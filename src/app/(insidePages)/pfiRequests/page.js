"use client"

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiService";
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';
import { useRouter } from "next/navigation";
import clipLongText from "@/services/clipLongText";
import formatAsCurrency from "@/services/formatAsCurrency";

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
      </tr>
    </>
    
  );
}


const PfiRequests = () =>{  
  const dispatchMessage = useDispatchMessage();
  const router = useRouter();



  const {data, isFetching} = useQuery({
    queryKey: ["allPfiRequests" ],
    queryFn:  ()=>apiGet({ url: "/pfiRequestForm"})
    .then(res => {
      console.log(res)
      return res.data
    })
    .catch(error =>{
      console.log(error)
      dispatchMessage({severity: "error", message: error.message})
    })
  })

  const listPfiRequests = () =>{
    return data.map( (item, index) => {
      const {id, pfiReferenceNumber, pfiDate, customer, contactPerson, brand, product, quantity, pricePerVehicle, employee} = item;
      return( 
        <tr key={id} className="hover">
          <td className="border-bottom-0"><h6 className="fw-semibold mb-0">{index + 1}</h6></td>
          <td className="border-bottom-0 link-style"  onClick={()=>{
            router.push(`/pfiRequests/${id}`)
          }}>
            <h6 className="fw-semibold m-0 text-primary">{pfiReferenceNumber}</h6>
          </td>
          <td className="border-bottom-0">
            <h6 className="fw-semibold m-0">{pfiDate ? new Date(pfiDate).toDateString() : ""}</h6>
          </td>
          <td className="border-bottom-0 link-style"  onClick={()=>{
            router.push(`/pfiRequests/${id}`)
          }}>
            <h6 className="fw-semibold mb-1 text-primary">{customer.companyName}</h6>
            <span className="fw-normal">{contactPerson.name}</span>
          </td>
          <td className="border-bottom-0">
            <h6 className="fw-semibold mb-1">{brand.name}</h6>
            <span className="fw-normal">{product.name}</span>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal">{quantity}</p>
          </td>
          <td className="border-bottom-0">
            <p className="fw-semibold m-0">{formatAsCurrency(pricePerVehicle)}</p>
          </td>
          <td className="border-bottom-0">
            <h6 className="fw-semibold m-0">{employee.firstName} {employee.lastName}</h6>
            <p className="fw-semibold m-0">{employee.email}</p>
          </td>
          <td className="border-bottom-0">
            <a className="btn btn-link text-primary ms-auto" href={`/pfiRequests/${id}/edit`}>Edit</a>
          </td>
        </tr>
    )
    })
  }

  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Pfi Request</h4>
        <a className="btn btn-link text-primary ms-auto" href="/pfiRequests/add">Add</a>
      </header>

      <div className="row">
          <div className="col-12 d-flex align-items-stretch">
            <div className="card w-100">
              <div className="card-body p-4">
                <h5 className="card-title fw-semibold mb-4 opacity-75">All Pfi Requests</h5>
                <div className="table-responsive">
                  <table className="table text-nowrap mb-0 align-middle">
                    <thead className="text-dark fs-4">
                      <tr>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">#</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Pfi Number</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Pfi Date</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Customer</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Product</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Quantity</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Price</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Employee</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Actions</h6>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        {data ? listPfiRequests() : <LoadingFallBack />}                 
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

export default PfiRequests
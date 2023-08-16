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
      </tr>
      <tr sx={{ width: "100%" }}>
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
      </tr>
    </>
    
  );
}


const Customers = () =>{  
  const dispatchMessage = useDispatchMessage();
  const router = useRouter();



  const {data, isFetching} = useQuery({
    queryKey: ["allCustomers" ],
    queryFn:  ()=>apiGet({ url: "/customer"})
    .then(res => {
      console.log(res)
      dispatchMessage({message: res.message})
      return res.data
    })
    .catch(error =>{
      console.log(error)
      dispatchMessage({severity: "error", message: error.message})
    })
  })

  const listCustomers = () =>{
    return data.map( (item, index) => {
      const {id, companyName, state, lga, city, address, industry, customerType, status, approved } = item;
      return( 
        <tr key={id} className="hover" onClick={()=>router.push(`/customers/${id}`)}>
          <td className="border-bottom-0"><h6 className="fw-semibold mb-0">{index + 1}</h6></td>
          <td className="border-bottom-0">
            <h6 className="fw-semibold mb-1 text-capitalize">{companyName}</h6>
          </td>
          <td className="border-bottom-0">
            <h6 className="fw-semibold mb-1 text-capitalize">{customerType}</h6>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal text-capitalize">{industry}</p>
          </td>
          <td className="border-bottom-0">
            <p className="small mb-0 d-flex flex-wrap text-capitalize" style={{maxWidth: "200px"}}>{clipLongText(address)}</p>
            <span className="small text-capitalize">{city} {lga} {state}</span>
          </td>
          <td className="border-bottom-0">
              <h6 className="fw-semibold m-0">{approved ? "Yes" : "No"}</h6>
          </td>
          <td className="border-bottom-0">
            <a className="btn btn-link text-primary ms-auto" href={`/customers/${id}/edit`}>Edit</a>
          </td>
        </tr>
    )
    })
  }

  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Customer</h4>
        <a className="btn btn-link text-primary ms-auto" href="/customers/add">Add</a>
      </header>

      <div className="row">
          <div className="col-12 d-flex align-items-stretch">
            <div className="card w-100">
              <div className="card-body p-4">
                <h5 className="card-title fw-semibold mb-4 opacity-75">All Customers</h5>
                <div className="table-responsive">
                  <table className="table text-nowrap mb-0 align-middle">
                    <thead className="text-dark fs-4">
                      <tr>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">#</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Company Name</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Customer Type</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Industry</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Address</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Approved</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Actions</h6>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        {data ? listCustomers() : <LoadingFallBack />}                 
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

export default Customers
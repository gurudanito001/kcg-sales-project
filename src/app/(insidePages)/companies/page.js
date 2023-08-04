"use client"

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiService";
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';
import { useRouter } from "next/navigation";

const LoadingFallBack = () =>{
  return (
    <>
      <tr sx={{ width: "100%" }}>
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
      </tr>
      <tr sx={{ width: "100%" }}>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
      </tr>
    </>
    
  );
}

const Companies = () =>{  
  const dispatchMessage = useDispatchMessage();
  const router = useRouter();

  const getCompanies = () =>{
    apiGet({ url: "/company"})
    .then(res => {
      console.log(res)
      dispatchMessage({message: res.message})
      return res.data
    })
    .catch(error =>{
      console.log(error)
      dispatchMessage({severity: "error", message: error.message})
    })
  }

  /* async function getCompanies() {
    return (await fetch("http://localhost:3000/api/v1/company").then(
      (res) => res.json()
    )) ;
  } */

  const {data, isFetching} = useQuery({
    queryKey: ["allCompanies" ],
    queryFn:  ()=>apiGet({ url: "/company"})
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

  const listCompanies = () =>{
    return data.map( (item, index) => {
      const {id, name, code, address, logo, email, _count} = item;
      return( 
        <tr key={id} className="hover" onClick={()=>router.push(`/companies/${id}`)}>
          <td className="border-bottom-0"><h6 className="fw-semibold mb-0">{index + 1}</h6></td>
          <td className="border-bottom-0">
            <h6 className="fw-semibold mb-1">{name}</h6>
            <span className="fw-normal">{_count.branches} Branch(es)</span>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal">{code}</p>
          </td>
          <td className="border-bottom-0">
            <div className="d-flex align-items-center gap-2">
              <p className="fw-semibold m-0">{email}</p>
            </div>
          </td>
          <td className="border-bottom-0">
            <p className="small mb-0">{address}</p>
          </td>
        </tr>
    )
    })
  }

 

  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Company</h4>
        <span className="breadcrumb-item ms-3"><a href="/companies"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
        <a className="btn btn-link text-primary ms-auto" href="/companies/add">Add</a>
      </header>
      

      <div className="row">
          <div className="col-12 d-flex align-items-stretch">
            <div className="card w-100">
              <div className="card-body p-4">
                <h5 className="card-title fw-semibold mb-4 opacity-75">All Companies</h5>
                <div className="table-responsive">
                  <table className="table text-nowrap mb-0 align-middle">
                    <thead className="text-dark fs-4">
                      <tr>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">#</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Name</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Code</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Email</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Address</h6>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        {data ? listCompanies() : <LoadingFallBack />}                 
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

export default Companies
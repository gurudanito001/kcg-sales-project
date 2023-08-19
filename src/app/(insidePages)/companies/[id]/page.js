"use client"

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiService";
import { useParams } from 'next/navigation';
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';
import Branches from "../../branches/page";
import { useRouter } from "next/navigation";

const DataListItem = ({title, value}) => {
  return (
    <div className="row mb-3 d-flex align-items-center">
      <div className="col-12 col-md-4">
        <h6 className="m-0">{title}</h6>
      </div>
      <div className="col-12 col-md-8">
        <span>{value}</span>
      </div>
    </div>
  )
}

const LoadingFallBack = () =>{
  return (
    <div>
      <article className="d-flex">
        <Skeleton className="me-3" height={40} sx={{ width: "clamp(100px, 25%, 250px )"}} animation="wave" />
        <Skeleton height={40} sx={{ width: "clamp(200px, 45%, 400px )"}} width="60%" animation="wave" />
      </article>
      <article className="d-flex">
        <Skeleton className="me-3" height={40} sx={{ width: "clamp(100px, 25%, 250px )"}} animation="wave" />
        <Skeleton height={40} sx={{ width: "clamp(200px, 45%, 400px )"}} width="60%" animation="wave" />
      </article>
      <article className="d-flex">
        <Skeleton className="me-3" height={40} sx={{ width: "clamp(100px, 25%, 250px )"}} animation="wave" />
        <Skeleton height={40} sx={{ width: "clamp(200px, 45%, 400px )"}} width="60%" animation="wave" />
      </article>
      <article className="d-flex">
        <Skeleton className="me-3" height={40} sx={{ width: "clamp(100px, 25%, 250px )"}} animation="wave" />
        <Skeleton height={40} sx={{ width: "clamp(200px, 45%, 400px )"}} width="60%" animation="wave" />
      </article>
      <article className="d-flex">
        <Skeleton className="me-3" height={40} sx={{ width: "clamp(100px, 25%, 250px )"}} animation="wave" />
        <Skeleton height={40} sx={{ width: "clamp(200px, 45%, 400px )"}} width="60%" animation="wave" />
      </article>
    </div>
  );
}

const BranchesLoadingFallBack = () =>{
  return (
    <>
      <tr sx={{ width: "100%" }}>
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
      </tr>
      <tr sx={{ width: "100%" }}>
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

const CompanyDetails = () => {
  const params = useParams();
  const router = useRouter();
  const {id} = params;
  console.log(id);
  const dispatchMessage = useDispatchMessage();

  const {data, isFetching} = useQuery({
    queryKey: ["allCompanies", id],
    queryFn: () => apiGet({ url: `/company/${id}`})
    .then(res =>{
      console.log(res.data)
      return res.data
    })
    .catch(error =>{
      console.log(error.message)
      dispatchMessage({ severity: "error", message: error.message})
    })
  }) 

  const listCompanyBrands = () =>{
    let brands = ""
    data.brands.forEach( brand => {
      if(brands === ""){
        brands += `${brand}`
      }else{
        brands += ` | ${brand}`
      }
    })
    return brands;
  }


  const listBranches = () =>{
    return data.branches.map( (item, index) => {
      const {id, name, code, email, phoneNumber, state, lga, address, isHeadOffice } = item;
      return( 
        <tr key={id} className="hover" onClick={()=>router.push(`/branches/${id}`)}>
          <td className="border-bottom-0"><h6 className="fw-semibold mb-0">{index + 1}</h6></td>
          <td className="border-bottom-0">
            <h6 className="fw-semibold mb-1 text-capitalize">{name}</h6>
          </td>
          <td className="border-bottom-0">
            <p className="fw-semibold mb-1 text-capitalize">{code}</p>
          </td>
          <td className="border-bottom-0">
            <p className="fw-semibold mb-1 ">{email}</p>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal text-capitalize">{phoneNumber}</p>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal text-capitalize">{address}</p>
            <span className="mb-0 fw-normal">{lga} {state}</span>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal text-capitalize">{isHeadOffice ? "Yes" : "No"}</p>
          </td>
          <td className="border-bottom-0">
            <a className="btn btn-link text-primary ms-auto" onClick={()=>router.push(`/branches/${id}/edit`)}>Edit</a>
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
        <a className="btn btn-link text-primary ms-auto"  onClick={()=>router.push(`/branches/add?companyId=${id}`)}>Add Branch</a>
        <a className="btn btn-link text-primary ms-2" href={`/companies/${id}/edit`}>Edit</a>
      </header>


      <div className="row">
        <div className="col-12 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Company Details</h5>

              {data ?
                <>
                  <div className="row mb-3 d-flex align-items-center">
                    <div className="col-12 col-md-4">
                      <h6 className="m-0">Company Logo</h6>
                    </div>
                    <div className="col-12 col-md-8">
                      <img src={data.logo} height={40} alt="Company Logo" />
                    </div>
                  </div>
                  <DataListItem title="Company Name" value={data.name} />
                  <DataListItem title="Company Code" value={data.code} />
                  <DataListItem title="Email" value={data.email} />
                  <DataListItem title="Address" value={data.address} />
                  <DataListItem title="Brands" value={listCompanyBrands()} />
                </> :
                <LoadingFallBack />
              }
            </div>


            <div className="card-body p-4">
              <h5 className="card-title fw-semibold mb-4 opacity-75">Branches</h5>
              <div className="table-responsive">
                <table className="table text-nowrap mb-0 align-middle">
                  <thead className="text-dark fs-4">
                    <tr>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">#</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Branch Name</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Code</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Email</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Phone Number</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Address</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Head Office?</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Actions</h6>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data ? listBranches() : <BranchesLoadingFallBack />}
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

export default CompanyDetails
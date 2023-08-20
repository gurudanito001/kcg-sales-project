"use client"

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiService";
import { useParams } from 'next/navigation';
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';
import { useSelector } from "react-redux";

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

const MonthlyTargetDetails = () => {
  const params = useParams();
  const {id} = params;
  console.log(id);
  const dispatchMessage = useDispatchMessage();
  const {userData} = useSelector( state => state.userData);
 
  const {data, isFetching} = useQuery({
    queryKey: ["allCompanies", id],
    queryFn: () => apiGet({ url: `/company/${id}`})
    .then(res =>{
      console.log(res.data)
      //dispatchMessage({ message: res.message})
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

  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Monthly Targets</h4>
        <span className="breadcrumb-item ms-3"><a href="/targetAchievements"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
        {userData?.staffCadre?.includes("admin") &&<a className="btn btn-link text-primary ms-auto" href={`/targetAchievements/${id}/edit`}>Edit</a>}
      </header>


      {/* <div className="row">
        <div className="col-12 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Company Details</h5>

              {data ?
                <>
                  <div className="mb-3 d-flex flex-column flex-sm-row align-items-sm-center">
                    <h6 className="m-0 me-3">Company Logo</h6>
                    <img src={data.logo} height={40} alt="Company Logo" />
                  </div>
                  <DataListItem title="Company Name" value={data.name} />
                  <DataListItem title="Company Code" value={data.code} />
                  <DataListItem title="Email" value={data.email} />
                  <DataListItem title="Address" value={data.address} />
                  <DataListItem title="Brands" value={listCompanyBrands(data.brands)} />
                </> :
                <LoadingFallBack />

              }
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default MonthlyTargetDetails
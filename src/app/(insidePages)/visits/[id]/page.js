"use client"

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiService";
import { useParams } from 'next/navigation';
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';

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

const VisitReportDetails = () => {
  const params = useParams();
  const {id} = params;
  console.log(id);
  const dispatchMessage = useDispatchMessage();

  const {data, isFetching} = useQuery({
    queryKey: ["allVisitReports", id],
    queryFn: () => apiGet({ url: `/visitReport/${id}`})
    .then(res =>{
      console.log(res.data)
      // dispatchMessage({ message: res.message})
      return res.data
    })
    .catch(error =>{
      console.log(error.message)
      dispatchMessage({ severity: "error", message: error.message})
    })
  }) 

  const listProductsDiscussed = () =>{
    let products = ""
    data.productsDiscussed.forEach( item => {
      if(products === ""){
        products += `${item}`
      }else{
        products += ` | ${item}`
      }
    })
    return products;
  }

  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Visit Report</h4>
        <span className="breadcrumb-item ms-3"><a href="/visits"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
        {userData?.staffCadre?.includes("salesPerson") && <a className="btn btn-link text-primary ms-auto" href={`/visits/${id}/edit`}>Edit</a>}
      </header>

      <div className="row">
        <div className="col-12 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Visit Report Details</h5>

              {data ?
                <>
                  <DataListItem title="Company Name" value={data.customer.companyName} />
                  <DataListItem title="Contact Person" value={data.contactPerson.name} />
                  <DataListItem title="Call Type" value={data.callType} />
                  <DataListItem title="Status" value={data.status} />
                  <DataListItem title="Products Discussed" value={listProductsDiscussed(data.productsDiscussed)} />
                  <DataListItem title="Quantity" value={data.quantity} />
                  <DataListItem title="Duration Of Meeting" value={data.durationOfMeeting} />
                  <DataListItem title="Meeting Outcome" value={data.meetingOutcome} />
                  <DataListItem title="Visit Date" value={new Date(data.visitDate).toDateString()} />
                  <DataListItem title="Pfi Request" value={data.pfiRequest ? "Yes" : "No"} />
                </> :
                <LoadingFallBack />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisitReportDetails
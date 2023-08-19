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

const PfiRequestDetails = () => {
  const params = useParams();
  const {id} = params;
  console.log(id);
  const dispatchMessage = useDispatchMessage();

  const {data, isFetching} = useQuery({
    queryKey: ["allPfiRequests", id],
    queryFn: () => apiGet({ url: `/pfiRequestForm/${id}`})
    .then(res =>{
      console.log(res.data)
      dispatchMessage({ message: res.message})
      return res.data
    })
    .catch(error =>{
      console.log(error.message)
      dispatchMessage({ severity: "error", message: error.message})
    })
  }) 

  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Pfi Requests</h4>
        <span className="breadcrumb-item ms-3"><a href="/pfiRequests"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
        <a className="btn btn-link text-primary ms-auto" href={`/pfiRequests/${id}/edit`}>Edit</a>
      </header>


      <div className="row">
        <div className="col-12 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Pfi Request Details</h5>

              {data ?
                <>
                  <DataListItem title="Employee" value={`${data.employee.firstName} ${data.employee.lastName}`} />
                  <DataListItem title="Customer" value={data.customer.companyName} />
                  <DataListItem title="Customer Address" value={data.customer.address} />
                  <DataListItem title="Contact Person Name" value={data.contactPerson.name} />
                  <DataListItem title="Phone Number" value={data.contactPerson.phoneNumber} />
                  <DataListItem title="Email" value={data.contactPerson.email} />
                  <DataListItem title="Brand" value={data.brand.name} />
                  <DataListItem title="Product" value={data.product.name} />
                  <DataListItem title="Vehicle Details" value={data.vehicleDetails} />
                  <DataListItem title="Quantity" value={data.quantity} />
                  <DataListItem title="Price Per Vehicle" value={data.pricePerVehicle} />
                  <DataListItem title="Body Type Description" value={data.bodyTypeDescription} />
                  <DataListItem title="Vehicle Service Details" value={data.vehicleServiceDetails} />
                  <DataListItem title="Special Fitment Details" value={data.specialFitmentDetails} />
                  <DataListItem title="Cost For Special Fitment" value={data.costForSpecialFitment} />
                  <DataListItem title="Discount" value={data.discount} />
                  <DataListItem title="VAT Deduction" value={data.vatDeduction ? "Yes" : "No"} />
                  <DataListItem title="WHT Deduction" value={data.whtDeduction? "Yes" : "No"} />
                  <DataListItem title="Registration" value={data.registration? "Yes" : "No"} />
                  <DataListItem title="Refund/Rebate Amount" value={data.refundRebateAmount} />
                  <DataListItem title="Refund/Rebate Recipient" value={data.refundRebateRecipient} />
                  <DataListItem title="Designation" value={data.designation} />
                  <DataListItem title="Relationship With Transaction" value={data.relationshipWithTransaction} />
                  <DataListItem title="Estimated Order Closing Time (No of days)" value={data.estimatedOrderClosingTime} />
                  <DataListItem title="Payment Type" value={data.paymentType} />
                  <DataListItem title="Delivery Location" value={data.deliveryLocation} />
                  <DataListItem title="Approved" value={data.approved ? "Yes" : "No"} />
                  <DataListItem title="Locked" value={data.locked ? "Yes" : "No"} />
                  <DataListItem title="Pfi Reference Number" value={data.pfiReferenceNumber} />
                  <DataListItem title="Pfi Date" value={data.pfiDate} />
                  <DataListItem title="Additional Information" value={data.additionalInformation} />
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

export default PfiRequestDetails
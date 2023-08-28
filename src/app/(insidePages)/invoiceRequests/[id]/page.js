"use client"

import { useParams } from 'next/navigation';
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';
import { useSelector } from "react-redux";
import { getDecodedToken } from "@/services/localStorageService";
import { usePathname } from "next/navigation";
import useGetComments from "@/hooks/useGetComments";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/services/apiService";

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

const InvoiceRequestDetails = () => {
  const params = useParams();
  const {id} = params;
  console.log(id);
  const dispatchMessage = useDispatchMessage();
  const {userData} = useSelector( state => state.userData)
  const tokenData = getDecodedToken();
  const pathName = usePathname();
  const {refetch, comments, listComments} = useGetComments(id);

  const {data, isFetching} = useQuery({
    queryKey: ["allInvoiceRequests", id],
    queryFn: () => apiGet({ url: `/invoiceRequestForm/${id}`})
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

  const [commentData, setCommentData] = useState({
    senderId: "",
    receiverId: "",
    resourceId: "",
    resourceUrl: "",
    message: ""
  });

  const clearComment = () => {
    setCommentData( prevState => ({
      ...prevState, 
      message: ""
    }))
  }
  
  const queryClient = useQueryClient();
  const commentMutation = useMutation({
    mutationFn: () => apiPost({ url: "/comment", data: commentData })
      .then(res => {
        clearComment();
        console.log(res.data)
        //dispatchMessage({ message: res.message })
        refetch()
        
      })
      .catch(error => {
        console.log(error)
        dispatchMessage({ severity: "error", message: error.message })
      }),
  })

  const handleChangeComment =  (event) => {
    setCommentData(prevState => ({
      ...prevState,
      message: event.target.value
    }))
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    // return console.log(commentData)
    commentMutation.mutate()
  }

  useEffect(()=>{
    setCommentData( prevState =>({
      ...prevState,
      senderId: tokenData?.user_id,
      receiverId: data?.employeeId,
      resourceId: id,
      resourceUrl: pathName
    }))
  },[data])


  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Invoice Requests</h4>
        <span className="breadcrumb-item ms-3"><a href="/invoiceRequests"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
        {tokenData?.staffCadre?.includes("salesPerson") && <a className="btn btn-link text-primary ms-auto" href={`/invoiceRequests/${id}/edit`}>Edit</a>}
      </header>


      <div className="row">
        <div className="col-12 d-flex flex-column align-items-stretch">
          <div className="card w-100">
            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Invoice Request Details</h5>

              {data ?
                <>
                  <DataListItem title="Employee" value={`${data.employee.firstName} ${data.employee.lastName}`} />
                  <DataListItem title="Customer" value={data.customer.companyName} />
                  <DataListItem title="Contact Person Name" value={data.contactPerson.name} />
                  <DataListItem title="Invoice Name" value={data.invoiceName} />
                  <DataListItem title="Address" value={data.address} />
                  <DataListItem title="Contact Office Telephone" value={data.contactOfficeTelephone} />
                  <DataListItem title="Email Address" value={data.emailAddress} />
                  <DataListItem title="Sales Through" value={data.salesThru} />
                  <DataListItem title="Industry" value={data.industry} />
                  <DataListItem title="Brand" value={data.brand.name} />
                  <DataListItem title="Product" value={data.product.name} />
                  <DataListItem title="Vehicle Model Details" value={data.vehicleModelDetails} />
                  <DataListItem title="Quantity" value={data.quantity} />
                  <DataListItem title="Color" value={data.color} />
                  <DataListItem title="Total Invoice Value Per Vehicle" value={data.totalInvoiceValuePerVehicle} />
                  <DataListItem title="Type of Body Building" value={data.typeOfBodyBuilding} />
                  <DataListItem title="VAT Deduction" value={data.vatDeduction ? "Yes" : "No"} />
                  <DataListItem title="WHT Deduction" value={data.whtDeduction? "Yes" : "No"} />
                  <DataListItem title="Registration" value={data.registration} />
                  <DataListItem title="Rebate Receiver" value={data.rebateReceiver} />
                  <DataListItem title="Relationship With Transaction" value={data.relationshipWithTransaction} />
                  <DataListItem title="Expected Delivery Date" value={data.expectedDeliveryDate} />
                  <DataListItem title="Delivery Location" value={data.deliveryLocation} />
                  <DataListItem title="Payment Type" value={data.paymentType} />
                  <DataListItem title="Delivery Location" value={data.deliveryLocation} />
                  <DataListItem title="Delivered By" value={data.deliveredBy} />

                  <DataListItem title="Payment Status" value={data.paymentStatus} />
                  <DataListItem title="Bank Name" value={data.bankName} />
                  <DataListItem title="Bank Account Name" value={data.bankAccountName} />
                  <DataListItem title="Account Number" value={data.accountNumber} />
                  <DataListItem title="Amount Paid" value={data.amountPaid} />
                  <DataListItem title="Date Of Payment" value={data.dateOfPayment} />
                  <DataListItem title="LPO Number" value={data.lpoNumber} />
                  <DataListItem title="Payment Due Date" value={data.paymentDueDate} />
                  <DataListItem title="Other Payment Details" value={data.otherPaymentDetails} />
                  <DataListItem title="Invoice Number" value={data.invoiceNumber} />

                  <DataListItem title="Invoice Date" value={data.invoiceDate} />
                  <DataListItem title="Delivery Note Number" value={data.deliveryNoteNumber} />
                  <DataListItem title="Actual Delivery Date" value={data.actualDeliveryDate} />
                  <DataListItem title="Chasis Number" value={data.chasisNumber} />
                  <DataListItem title="Delivery" value={data.delivery} />
                  <DataListItem title="Payment" value={data.payment} />
                  <DataListItem title="Approved" value={data.approved ? "Yes" : "No"} />
                  <DataListItem title="Approved By GM" value={data.approvedByGM ? "Yes" : "No"} />
                  <DataListItem title="Approved By Product Head" value={data.approvedByProductHead ? "Yes" : "No"} />
                  <DataListItem title="Additional Information" value={data.additionalInformation} />
                </> :
                <LoadingFallBack />

              }
            </div>
          </div>

          <div className="card w-100 p-3">
            <h5 className="mb-4">Comments</h5>
            <ul className="list-unstyled">
              {listComments()}
            </ul>
            <div className="mb-3 d-flex">
              <textarea rows={3} className="form-control" id="location" value={commentData.message} placeholder="Make Your Comments here" onChange={handleChangeComment}></textarea>
              <div className="d-flex align-items-center">
                <button className="btn nav-icon-hover" disabled={commentMutation.isLoading} onClick={handleSubmit}><i className="fa-solid fa-paper-plane h1"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceRequestDetails
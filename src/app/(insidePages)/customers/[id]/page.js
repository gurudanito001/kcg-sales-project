"use client"

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/services/apiService";
import { useParams } from 'next/navigation';
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';
import AddContactPerson from '../add/addContactPerson';
import EditContactPerson from "./edit/editContactPerson";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDecodedToken } from "@/services/localStorageService";
import CommentItem from "@/components/commentItem";
import { usePathname } from "next/navigation";
import useGetComments from "@/hooks/useGetComments";

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

const LoadingFallBack = () => {
  return (
    <div>
      <article className="d-flex">
        <Skeleton className="me-3" height={40} sx={{ width: "clamp(100px, 25%, 250px )" }} animation="wave" />
        <Skeleton height={40} sx={{ width: "clamp(200px, 45%, 400px )" }} width="60%" animation="wave" />
      </article>
      <article className="d-flex">
        <Skeleton className="me-3" height={40} sx={{ width: "clamp(100px, 25%, 250px )" }} animation="wave" />
        <Skeleton height={40} sx={{ width: "clamp(200px, 45%, 400px )" }} width="60%" animation="wave" />
      </article>
      <article className="d-flex">
        <Skeleton className="me-3" height={40} sx={{ width: "clamp(100px, 25%, 250px )" }} animation="wave" />
        <Skeleton height={40} sx={{ width: "clamp(200px, 45%, 400px )" }} width="60%" animation="wave" />
      </article>
      <article className="d-flex">
        <Skeleton className="me-3" height={40} sx={{ width: "clamp(100px, 25%, 250px )" }} animation="wave" />
        <Skeleton height={40} sx={{ width: "clamp(200px, 45%, 400px )" }} width="60%" animation="wave" />
      </article>
      <article className="d-flex">
        <Skeleton className="me-3" height={40} sx={{ width: "clamp(100px, 25%, 250px )" }} animation="wave" />
        <Skeleton height={40} sx={{ width: "clamp(200px, 45%, 400px )" }} width="60%" animation="wave" />
      </article>
    </div>

  );
}

const ContactPersonLoadingFallBack = () =>{
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

const CustomerDetails = () => {
  const params = useParams();
  const { id } = params;
  const pathName = usePathname()
  const tokenData = getDecodedToken();
  const dispatchMessage = useDispatchMessage();
  const {refetch, comments, listComments} = useGetComments(id);
  
  const [currentForm, setCurrentForm] = useState("")
  const [currentlyEditedContactPerson, setCurrentlyEditedContactPerson] = useState({})

  const { data, isFetching } = useQuery({
    queryKey: ["allCustomers", id],
    queryFn: () => apiGet({ url: `/customer/${id}` })
      .then(res => {
        console.log(res.data)
        return res.data
      })
      .catch(error => {
        console.log(error.message)
        dispatchMessage({ severity: "error", message: error.message })
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
    console.log(commentData)
    commentMutation.mutate()
  }

  useEffect(()=>{
    setCommentData( prevState =>({
      ...prevState,
      senderId: tokenData?.user_id,
      receiverId: data?.employee?.id,
      resourceId: id,
      resourceUrl: pathName
    }))
  },[data])
 

  const listContactPersons = () =>{
    return data.contactPersons.map( (item, index) => {
      const {id, name, email, designation, phoneNumber } = item;
      return( 
        <tr key={id} className="hover">
          <td className="border-bottom-0"><h6 className="fw-semibold mb-0">{index + 1}</h6></td>
          <td className="border-bottom-0">
            <h6 className="fw-semibold mb-1 text-capitalize">{name}</h6>
          </td>
          <td className="border-bottom-0">
            <h6 className="fw-semibold mb-1">{email}</h6>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal text-capitalize">{designation}</p>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal text-capitalize">{phoneNumber}</p>
          </td>
          {tokenData?.staffCadre.includes("salesPerson") &&<td className="border-bottom-0">
            <button className="btn btn-link text-primary ms-auto" onClick={()=>{
              setCurrentlyEditedContactPerson(item);
              setCurrentForm("editContactPerson")
            }}>Edit</button>
          </td>}
        </tr>
    )
    })
  }


  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Customer</h4>
        <span className="breadcrumb-item ms-3"><a href="/customers"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
        {tokenData?.staffCadre.includes("salesPerson") && <a className="btn btn-link text-primary ms-auto" onClick={()=>setCurrentForm("addContactPerson")}>Add Contact Person</a>}
        {tokenData?.staffCadre.includes("salesPerson") && <a className="btn btn-link text-primary" href={`/customers/${id}/edit`}>Edit</a>}
      </header>


      <div className="row">
        <div className="col-12 d-flex flex-column align-items-stretch">
          <div className="card w-100">

            {currentForm === "addContactPerson" &&
              <div className="card-body p-4"> 
              <AddContactPerson employeeId={data?.employee?.id} customerId={data?.id} onClose = {()=>setCurrentForm("")} />
            </div>}

            {currentForm === "editContactPerson" &&
              <div className="card-body p-4"> 
              <EditContactPerson data={currentlyEditedContactPerson} onClose = {()=>setCurrentForm("")} />
            </div>}


            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Customer Details</h5>

              {data ?
                <>
                  <DataListItem title="Company Name" value={data.companyName} />
                  <DataListItem title="Company Website" value={data.companyWebsite} />
                  <DataListItem title="Industry" value={data.industry} />
                  <DataListItem title="Customer Type" value={data.customerType} />
                  <DataListItem title="Enquiry Source" value={data.enquirySource} />
                  <DataListItem title="Status" value={data.status} />
                  <DataListItem title="Approved" value={data.approved ? "Yes" : "Pending"} />
                  <DataListItem title="Last Visited" value={new Date(data.lastVisited).toDateString()} />

                  <div className="row mb-3 d-flex align-items-center">
                    <div className="col-12 col-md-4">
                      <h6 className="m-0">Address</h6>
                    </div>
                    <div className="col-12 col-md-8">
                      <p className="m-0">{data.address}</p>
                      <p className="m-0">{data.city} {data.lga} {data.state}</p>
                    </div>
                  </div>
                </> :
                <LoadingFallBack />
              }
            </div>

            <div className="card-body p-4">
              <h5 className="card-title fw-semibold mb-4 opacity-75">Contact Persons</h5>
              <div className="table-responsive">
                <table className="table text-nowrap mb-0 align-middle">
                  <thead className="text-dark fs-4">
                    <tr>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">#</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Contact Person Name</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Email</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Designation</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Phone Number</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Actions</h6>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data ? listContactPersons() : <ContactPersonLoadingFallBack />}
                  </tbody>
                </table>
              </div>
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

export default CustomerDetails
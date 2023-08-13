"use client"

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiService";
import { useParams } from 'next/navigation';
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';
import AddContactPerson from '../add/addContactPerson';
import { useState } from "react";

const DataListItem = ({ title, value }) => {
  return (
    <div className="mb-3 d-flex flex-column flex-sm-row align-items-sm-center">
      <h6 className="m-0 me-3">{title}</h6>
      <span>{value}</span>
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
  console.log(id);
  const dispatchMessage = useDispatchMessage();
  const [showAddContactPerson, setShowAddContactPerson] = useState(false)

  const { data, isFetching } = useQuery({
    queryKey: ["allCustomers", id],
    queryFn: () => apiGet({ url: `/customer/${id}` })
      .then(res => {
        console.log(res.data)
        dispatchMessage({ message: res.message })
        return res.data
      })
      .catch(error => {
        console.log(error.message)
        dispatchMessage({ severity: "error", message: error.message })
      })
  })

  const listContactPersons = () =>{
    return data.contactPersons.map( (item, index) => {
      const {id, name, email, designation, phoneNumber } = item;
      return( 
        <tr key={id} className="hover" onClick={()=>router.push(`/customers/${id}`)}>
          <td className="border-bottom-0"><h6 className="fw-semibold mb-0">{index + 1}</h6></td>
          <td className="border-bottom-0">
            <h6 className="fw-semibold mb-1 text-capitalize">{name}</h6>
          </td>
          <td className="border-bottom-0">
            <h6 className="fw-semibold mb-1 text-capitalize">{email}</h6>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal text-capitalize">{designation}</p>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal text-capitalize">{phoneNumber}</p>
          </td>
          <td className="border-bottom-0">
            <a className="btn btn-link text-danger ms-auto">Delete</a>
          </td>
        </tr>
    )
    })
  }


  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Customer</h4>
        <span className="breadcrumb-item ms-3"><a href="/customers"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
        <a className="btn btn-link text-primary ms-auto" onClick={()=>setShowAddContactPerson(true)}>Add Contact Person</a>
        <a className="btn btn-link text-primary" href={`/customers/${id}/edit`}>Edit</a>
      </header>


      <div className="row">
        <div className="col-12 d-flex align-items-stretch">
          <div className="card w-100">

            {showAddContactPerson &&
              <div className="card-body p-4"> 
              <AddContactPerson employeeId={data?.employee?.id} customerId={data?.id} onClose = {()=>setShowAddContactPerson(false)} />
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
                  <DataListItem title="Approved" value={data.approved ? "Yes" : "No"} />
                  <DataListItem title="Last Visited" value={new Date(data.lastVisited).toDateString()} />
                  <div className="mb-3 d-flex flex-column flex-sm-row align-items-sm-center">
                    <h6 className="m-0 me-3">Address</h6>
                    <div>
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
        </div>
      </div>
    </div>
  )
}

export default CustomerDetails
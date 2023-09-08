"use client"

import Skeleton from '@mui/material/Skeleton';
import { getDecodedToken } from "@/services/localStorageService";
import CommentItem from "@/components/commentItem";
import { usePathname } from "next/navigation";
import useGetComments from "@/hooks/useGetComments";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiGet, apiPatch, apiPost } from "@/services/apiService";
import { useParams } from 'next/navigation';
import useDispatchMessage from "@/hooks/useDispatchMessage";
import { useSelector } from 'react-redux';
import ConfirmationModal from '@/components/confirmationModal';
import DeleteFollowUpButton from '@/components/deleteFollowUpButton';
import moment from 'moment';
import useGetUserData from "@/hooks/useGetUserData";


const DataListItem = ({ title, value }) => {
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

const FollowUpLoadingFallBack = () =>{
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

const VisitReportDetails = () => {
  const params = useParams();
  const { id } = params;
  const dispatchMessage = useDispatchMessage();
  const pathName = usePathname()
  // const tokenData = getDecodedToken();
  const {userData} = useGetUserData();
  const { refetch, comments, listComments } = useGetComments(id);

  const { data, isFetching, refetch: refetchVisitReport } = useQuery({
    queryKey: ["allVisitReports", id],
    queryFn: () => apiGet({ url: `/visitReport/${id}` })
      .then(res => {
        console.log(res.data)
        // dispatchMessage({ message: res.message})
        return res.data
      })
      .catch(error => {
        console.log(error.message)
        dispatchMessage({ severity: "error", message: error.message })
        return {}
      })
  })

  const listProductsDiscussed = () => {
    let products = ""
    data.productsDiscussed.forEach(item => {
      if (products === "") {
        products += `${item}`
      } else {
        products += ` | ${item}`
      }
    })
    return products;
  }


  const [commentData, setCommentData] = useState({
    senderId: "",
    receiverId: "",
    resourceId: "",
    resourceUrl: "",
    message: ""
  });

  const clearComment = () => {
    setCommentData(prevState => ({
      ...prevState,
      message: ""
    }))
  }

  const [followUpVisits, setFollowUpVisits] = useState([]);
  const [followUpVisit, setFollowUpVisit] = useState({
    id: "",
    meetingDate: "",
    meetingDuration: "",
    meetingOutcome: ""
  })

  useEffect(() => {
    if (data) {
      setFollowUpVisits(data.followUpVisits)
    }
  }, [])

  useEffect(() => {
    if (data) {
      if (followUpVisits.length !== data?.followUpVisits.length) {
        console.log(followUpVisits)
      }
    }
  }, [followUpVisits])


  const [showFollowUpVisitForm, setShowFollowUpVisitForm] = useState(false)

  const [errors, setErrors] = useState({})

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

  const followUpVisitMutation = useMutation({
    mutationFn: (data) => apiPatch({ url: `/visitReport/${id}`, data: { followUpVisits: data } })
      .then(res => {
        console.log(res.data)
        dispatchMessage({ message: res.message })
        refetchVisitReport()
      })
      .catch(error => {
        console.log(error)
        dispatchMessage({ severity: "error", message: error.message })
      }),
  })

  const handleChangeFollowUp = (prop) => (event) => {
    setFollowUpVisit(prevState => ({
      ...prevState,
      [prop]: event.target.value
    }))
  }

  const handleSubmitFollowUp = (e) => {
    e.preventDefault();
    let id = new Date().getTime();
    let followUpData = [
      ...data.followUpVisits,
      {...followUpVisit, id }
    ]
    followUpVisitMutation.mutate(followUpData);

    setFollowUpVisit(prevState => ({
      id: "",
      meetingDate: "",
      meetingDuration: "",
      meetingOutcome: ""
    }))
  }

  const handleChangeComment = (event) => {
    setCommentData(prevState => ({
      ...prevState,
      message: event.target.value
    }))
  }



  const handleSubmit = (e) => {
    e.preventDefault();
    // return console.log(commentData)
    commentMutation.mutate()
  }

  useEffect(() => {
    setCommentData(prevState => ({
      ...prevState,
      senderId: userData?.id,
      receiverId: data?.employeeId,
      resourceId: id,
      resourceUrl: pathName
    }))
  }, [data, userData])

  const listFollowUpVisits = () => {
    return data?.followUpVisits.map((item, index) => {
      const { id, meetingDate, meetingDuration, meetingOutcome } = item;
      return (
        <tr key={id} className="hover">
          <td className="border-bottom-0"><h6 className="fw-semibold mb-0">{index + 1}</h6></td>
          <td className="border-bottom-0">
            <h6 className="fw-semibold mb-1">{new Date(meetingDate).toDateString()}</h6>
          </td>
          <td className="border-bottom-0">
            <p className="mb-0 fw-normal">{meetingDuration}</p>
          </td>
          <td className="border-bottom-0">
            <div className="d-flex align-items-center gap-2">
              <p className="fw-semibold m-0">{meetingOutcome}</p>
            </div>
          </td>
          {(userData?.staffCadre?.includes("salesPerson") && !userData?.staffCadre?.includes("supervisor")) &&
          <td className="border-bottom-0">
            <DeleteFollowUpButton isLoading={followUpVisitMutation.isLoading} deleteFunc={()=>deleteFollowUpVisit(id)} />
          </td>}
        </tr>
      )
    })
  }

  const deleteFollowUpVisit = (id) =>{
    let followUpData = data.followUpVisits
    followUpData = followUpData.filter( item => item.id !== id);
    console.log(followUpData)
    followUpVisitMutation.mutate(followUpData);
  }

  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Visit Report</h4>
        <span className="breadcrumb-item ms-3"><a href="/visits"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
        {userData?.staffCadre?.includes("salesPerson") && <button className="btn btn-link text-primary ms-auto" onClick={() => setShowFollowUpVisitForm(true)} >Add Follow-up visit</button>}
        {userData?.staffCadre?.includes("salesPerson") && <a className="btn btn-link text-primary ms-2" href={`/visits/${id}/edit`}>Edit</a>}
      </header>

      <div className="row">
        <div className="col-12 d-flex flex-column flex-column align-items-stretch">

          {showFollowUpVisitForm && <div className="card w-100">
            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Add Follow-up Visit</h5>
              <form>
                <div className="mb-3">
                  <label htmlFor="meetingDate" className="form-label">Meeting Date (<span className='fst-italic text-warning'>required</span>)</label>
                  <input type="date" className="form-control shadow-none" value={followUpVisit.meetingDate} onChange={handleChangeFollowUp("meetingDate")} id="meetingDate" />
                  <span className='text-danger font-monospace small'>{errors.meetingDate}</span>
                </div>

                <div className="mb-3">
                  <label htmlFor="meetingDuration" className="form-label">Duration Of Meeting (<span className='fst-italic text-warning'>required</span>)</label>
                  <select className="form-select shadow-none" id="meetingDuration" onChange={handleChangeFollowUp("meetingDuration")} value={followUpVisit.meetingDuration} aria-label="Default select example">
                    <option value="">Select Meeting Duration</option>
                    <option value="30 mins">30 mins</option>
                    <option value="1 hr">1 hr</option>
                    <option value="1hr 30mins">1hr 30mins</option>
                    <option value="2 hrs">2 hrs</option>
                    <option value="2hrs 30 mins">2hrs 30 mins</option>
                    <option value="3 hrs">3 hrs</option>
                    <option value="3hrs 30 mins">3hrs 30 mins</option>
                    <option value="4hrs">4hrs</option>
                    <option value="4hrs 30 mins">4hrs 30 mins</option>
                    <option value="5 hrs">5 hrs</option>
                  </select>
                  <span className='text-danger font-monospace small'>{errors.meetingDuration}</span>
                </div>

                <div className="mb-3">
                  <label htmlFor="meetingOutcome" className="form-label">Meeting Outcome (<span className='fst-italic text-warning'>required</span>)</label>
                  <textarea className="form-control shadow-none" value={followUpVisit.meetingOutcome} onChange={handleChangeFollowUp("meetingOutcome")} id="meetingOutcome" ></textarea>
                  <span className='text-danger font-monospace small'>{errors.meetingOutcome}</span>
                </div>

                <div>
                  <button className="btn btn-secondary me-3" onClick={(e) => {
                    e.preventDefault();
                    setShowFollowUpVisitForm(false);
                  }}>Cancel</button>
                  <button className="btn btn-primary" disabled={followUpVisitMutation.isLoading} onClick={handleSubmitFollowUp}>Add Follow-up Visit</button>
                </div>

              </form>
            </div>
          </div>}


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
                  <DataListItem title="Created On" value={moment(data.createdAt).format('MMMM Do YYYY, h:mm:ss a')} />
                  <DataListItem title="Last Updated" value={moment(data.updatedAt).format('MMMM Do YYYY, h:mm:ss a')} />
                </> :
                <LoadingFallBack />
              }
            </div>
          </div>

          <div className="card w-100">
            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h6 className="card-title fw-semibold mb-4 opacity-75">Follow Up Visits</h6>

              <div className="table-responsive">
                <table className="table text-nowrap mb-0 align-middle">
                  
                  <thead className="text-dark fs-4">
                    <tr>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">#</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Meeting Date</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Meeting Duration</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Meeting Outcome</h6>
                      </th>
                      {(userData?.staffCadre?.includes("salesPerson") && !userData?.staffCadre?.includes("supervisor")) && 
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Actions</h6>
                      </th>}
                    </tr>
                  </thead>
                  <tbody>
                    {data ? listFollowUpVisits() : <FollowUpLoadingFallBack />}
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

export default VisitReportDetails
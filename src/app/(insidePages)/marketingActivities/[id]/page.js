"use client"

import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';
import { getDecodedToken } from "@/services/localStorageService";
import CommentItem from "@/components/commentItem";
import { usePathname } from "next/navigation";
import useGetComments from "@/hooks/useGetComments";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/services/apiService";
import { useParams } from 'next/navigation';
import { useSelector } from "react-redux";
import moment from "moment";
import useGetUserData from "@/hooks/useGetUserData";


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

const MarketingActivityDetails = () => {
  const params = useParams();
  const {id} = params;
  console.log(id);
  const dispatchMessage = useDispatchMessage();
  // const tokenData = getDecodedToken();
  const {userData} = useGetUserData();
  const pathName = usePathname();
  const {refetch, comments, listComments} = useGetComments(id);

  const {data, isFetching} = useQuery({
    queryKey: ["allMarketingActivities", id],
    queryFn: () => apiGet({ url: `/marketingActivity/${id}`})
    .then(res =>{
      console.log(res.data)
      //dispatchMessage({ message: res.message})
      return res.data
    })
    .catch(error =>{
      console.log(error.message)
      dispatchMessage({ severity: "error", message: error.message})
      return {}
    })
  }) 

  const listImages = () => {
    return data.images.map(image => {
      return <img key={image} src={image} height="150px" className="p-3 rounded-3" alt="Product Image" />
    })
  }



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
      senderId: userData?.id,
      receiverId: data?.employeeId,
      resourceId: id,
      resourceUrl: pathName
    }))
  },[data])


  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Marketing Activity</h4>
        <span className="breadcrumb-item ms-3"><a href="/marketingActivities"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
        {userData?.id === data?.employeeId && <a className="btn btn-link text-primary ms-auto" href={`/marketingActivities/${id}/edit`}>Edit</a>}
      </header>


      <div className="row">
        <div className="col-12 d-flex flex-column align-items-stretch">
          <div className="card w-100">
            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Marketing Activity Details</h5>

              {data ?
                <>
                  <DataListItem title="Employee Name" value={`${data.employee.firstName} ${data.employee.lastName}`} />
                  <DataListItem title="Activity Name" value={data.activityName} />
                  <DataListItem title="Activity Date" value={data.activityDate} />
                  <DataListItem title="Participants" value={data.participants} />
                  <DataListItem title="Location" value={data.location} />
                  <DataListItem title="Objective" value={data.objective} />
                  <DataListItem title="Target Result" value={data.targetResult} />
                  <DataListItem title="Brief Report" value={data.briefReport} />
                  <DataListItem title="Cost Incurred" value={data.costIncurred} />
                  <DataListItem title="Approved" value={data.approved ? "Yes" : "No"} />
                  <div className="mb-3 d-flex flex-column">
                    <h6 className="m-0 me-3">Pictures</h6>
                    <figure>
                      {listImages()}
                    </figure>
                  </div>
                  <DataListItem title="Created On" value={moment(data.createdAt).format('MMMM Do YYYY, h:mm:ss a')} />
                  <DataListItem title="Last Updated" value={moment(data.updatedAt).format('MMMM Do YYYY, h:mm:ss a')} />
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

export default MarketingActivityDetails
"use client"

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiService";
import { useParams } from 'next/navigation';
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';

const DataListItem = ({title, value}) => {
  return (
    <div className="mb-3 d-flex flex-column flex-sm-row align-items-sm-center">
      <h6 className="m-0 me-3">{title}</h6>
      <span>{value}</span>
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

const EmployeeDetails = () => {
  const params = useParams();
  const {id} = params;
  console.log(id);
  const dispatchMessage = useDispatchMessage();

  const {data, isFetching} = useQuery({
    queryKey: ["allEmployees", id],
    queryFn: () => apiGet({ url: `/employee/${id}`})
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
        <h4 className="m-0">Employee</h4>
        <span className="breadcrumb-item ms-3"><a href="/employees"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
        <a className="btn btn-link text-primary ms-auto" href={`/employees/${id}/edit`}>Edit</a>
      </header>


      <div className="row">
        <div className="col-12 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Employee Details</h5>

              {data ?
                <>
                  <DataListItem title="Employee Name" value={`${data.firstName} ${data.middleName} ${data.lastName}`} />
                  <DataListItem title="Company" value={data.company.name} />
                  <DataListItem title="Branch" value={data.branch.name} />
                  <DataListItem title="Supervisor" value={data.supervisor ? `${data?.supervisor?.firstName} ${data?.supervisor?.lastName}` : "---"} />
                  <DataListItem title="Staff Cadre" value={data.staffCadre[0]} />
                  <DataListItem title="Email" value={data.email} />
                  <DataListItem title="Employment Date" value={ new Date(data.employmentDate).toDateString()} />
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

export default EmployeeDetails
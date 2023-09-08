"use client"

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiService";
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';
import { useRouter } from "next/navigation";
import clipLongText from "@/services/clipLongText";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import NaijaStates from 'naija-state-local-government';
import { getDecodedToken } from "@/services/localStorageService";
import useGetUserData from "@/hooks/useGetUserData";


const LoadingFallBack = () => {
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


const Customers = () => {
  const dispatchMessage = useDispatchMessage();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const { userData } = useGetUserData();
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    employeeId: "",
    companyName: "",
    approved: "",
    state: "",
  })

  const [listMetaData, setListMetaData] = useState({
    currentPage: 1,
    totalCount: 0,
    take: 0
  })

  const clearState = () =>{
    setFormData( prevState =>({
      ...prevState,
      employeeId: "",
      companyName: "",
      approved: "",
      state: "",
    }))
  }

  const setNextPage = () =>{
    let {currentPage, take, totalCount} = listMetaData;
    if((currentPage * take) < totalCount){
      setPage( prevState => prevState + 1)
    }
  }

  const setPrevPage = () =>{
    let {currentPage} = listMetaData;
    if(currentPage > 1){
      setPage( prevState => prevState - 1)
    }
  }

  const [queryUrlString, setQueryUrlString] = useState("")

  const handleChange = (props) => (event) => {
    setFormData(prevState => ({
      ...prevState,
      [props]: event.target.value
    }))
  }

  useEffect(() => {
    if(userData?.staffCadre?.includes("salesPerson")){
      setFormData(prevState => ({
        ...prevState,
        employeeId: userData.id
      }))
    }
  }, [])

  const generateQueryString = () =>{
    let queryString = ""
    let data = formData;
    let dataKeys = Object.keys(data);
    dataKeys.forEach( key => {
      if(data[key]){
        if(queryString === ""){
          queryString += `${key}=${data[key]}`
        }else{
          queryString += `&${key}=${data[key]}`
        }
      }
    })
    return queryString
  }

  const employeeQuery = useQuery({
    queryKey: ["allEmployees"],
    queryFn: () => apiGet({ url: `/employee` })
      .then(res => {
        console.log(res)
        return res.data
      })
      .catch(error => {
        console.log(error)
        dispatchMessage({ severity: "error", message: error.message })
        return []
      })
  })

  const listEmployeeOptions = () => {
    if (employeeQuery?.data?.length) {
      return employeeQuery.data.map(employee =>
        <option key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName}</option>
      )
    }
  }

  const listStateOptions = () => {
    return NaijaStates.states().map(state =>{
      if(state === "Federal Capital Territory"){
        return <option key="Abuja" value={`Abuja`}>Abuja</option>
      }
      return <option key={state} value={state}>{state}</option>
    }
    )
  }

  


  const customerQuery = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => apiGet({ url: `/customer?${queryUrlString}&page=${page}&take=${20}` })
      .then(res => {
        console.log(res)
        setListMetaData( prevState => ({
          ...prevState,
          totalCount: res.totalCount,
          currentPage: res.page,
          take: res.take
        }))
        return res.data
      })
      .catch(error => {
        console.log(error)
        dispatchMessage({ severity: "error", message: error.message })
        return []
      })
  })
  const { data, isFetching } = customerQuery;

  const listCustomers = () => {
    return data.map((item, index) => {
      const { id, companyName, state, employee, approved } = item;
      return (
        <tr key={id} className="hover">
          <td className="border-bottom-0"><h6 className="fw-semibold mb-0">{index + 1}</h6></td>
          <td className="border-bottom-0 link-style" onClick={() => {
            router.push(`/customers/${id}`)
          }}>
            <h6 className="fw-semibold mb-1 text-capitalize text-primary">{companyName}</h6>
          </td>
          <td className="border-bottom-0">
            <span className="small text-capitalize">{state}</span>
          </td>
          {userData?.staffCadre?.includes("admin") && 
          <td className="border-bottom-0">
            <span className="small text-capitalize">{employee.firstName} {employee.lastName}</span>
          </td>
          }
          <td className="border-bottom-0">
            <h6 className="fw-semibold m-0">{approved ? "Yes" : "Pending"}</h6>
          </td>
          {userData?.staffCadre?.includes("salesPerson") && 
          <td className="border-bottom-0">
            <a className="btn btn-link text-primary ms-auto" href={`/customers/${id}/edit`}>Edit</a>
          </td>}
        </tr>
      )
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let queryString = generateQueryString()
    setQueryUrlString(queryString)
    //return console.log(formData, queryString)
  }

  useEffect(()=>{
    customerQuery.refetch()
  }, [queryUrlString, page])

  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Customer</h4>
        <button className="btn btn-link text-primary ms-auto border border-primary" onClick={() => setShowFilters(prevState => !prevState)}><i className="fa-solid fa-arrow-down-short-wide"></i></button>
        {userData?.staffCadre?.includes("salesPerson") && <a className="btn btn-link text-primary ms-3" href="/customers/add">Add</a>}
      </header>

      {showFilters &&
        <div className="container-fluid card p-3">
          <form className="row">
            <h6 className="col-12 mb-3 text-muted">Filter Customer List</h6>
             {(userData?.staffCadre?.includes("admin") || userData?.staffCadre?.includes("supervisor")) &&  
              <div className="mb-3 col-lg-6">
                <label htmlFor="employeeId" className="form-label">Employee</label>
                <select className="form-select shadow-none" value={formData.employeeId} onChange={handleChange("employeeId")} id="employeeId" aria-label="Default select example">
                  <option value="">Select Employee</option>
                  {listEmployeeOptions()}
                </select>
              </div>
            }

            <div className="mb-3 col-lg-6">
              <label htmlFor="companyName" className="form-label">Company Name</label>
              <input type="text" className="form-control shadow-none" id="companyName" value={formData.companyName} onChange={handleChange("companyName")} placeholder="Name of Company" />
            </div>

            <div className="mb-3 col-lg-6">
              <label htmlFor="approved" className="form-label">Approved</label>
              <select className="form-select shadow-none" value={formData.approved} onChange={handleChange("approved")} id="approved" aria-label="Default select example">
                <option value="">All</option>
                <option value="approved"> Approved</option>
                <option value="unApproved">Not Approved</option>
              </select>
            </div>

            <div className="mb-3 col-lg-6">
              <label htmlFor="state" className="form-label">State</label>
              <select className="form-select shadow-none" value={formData.state} onChange={handleChange("state")} id="state" aria-label="Default select example">
                <option value="">Select State</option>
                {listStateOptions()}
              </select>
            </div>


            <div className="d-flex col-12 align-items-center mt-5">
              <button type="submit" className="btn btn-primary px-5 py-2" disabled={isFetching} onClick={handleSubmit}>{isFetching ? "Filtering..." : "Filter"}</button>
              <a className="btn btn-outline-primary px-5 py-2 ms-3" onClick={() => setShowFilters(false)}>Cancel</a>
            </div>
          </form>
        </div>
      }

      <div className="row">
        <div className="col-12 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body p-4">
              <h5 className="card-title fw-semibold mb-4 opacity-75">All Customers</h5>
              <div className="table-responsive">
                <table className="table text-nowrap mb-0 align-middle">
                  <caption className='p-3'><span className="fw-bold">Current Page: </span>{listMetaData.currentPage}  <span className="fw-bold ms-2">Total Pages: </span>{Math.ceil(listMetaData.totalCount / listMetaData.take)} <span className="fw-bold ms-2"> Total Count: </span> {listMetaData.totalCount}</caption>
                  <thead className="text-dark fs-4"> 
                    <tr>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">#</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Company Name</h6>
                      </th>
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">State</h6>
                      </th>
                      {userData?.staffCadre?.includes("admin") && 
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Staff</h6>
                      </th>}
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Approved</h6>
                      </th>
                      {userData?.staffCadre?.includes("salesPerson") && 
                      <th className="border-bottom-0">
                        <h6 className="fw-semibold mb-0">Actions</h6>
                      </th>}
                    </tr>
                  </thead>
                  <tbody>
                    {data ? listCustomers() : <LoadingFallBack />}
                  </tbody>
                </table>
              </div>

              <div className="px-3">
                <button className="btn btn-outline-primary py-1 px-2" disabled={isFetching} type="button" onClick={setPrevPage}>
                  <i className="fa-solid fa-angle-left text-primary"></i>
                </button>
                <button className="btn btn-outline-primary py-1 px-2 ms-3" disabled={isFetching} type="button" onClick={setNextPage}>
                  <i className="fa-solid fa-angle-right text-primary"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Customers
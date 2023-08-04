"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/services/apiService";
import { useParams } from 'next/navigation';
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';

const EditCompany = () =>{
  const params = useParams();
  const {id} = params;
  console.log(id);
  const dispatchMessage = useDispatchMessage();

  const {data, isFetching} = useQuery({
    queryKey: ["allCompanies", id],
    queryFn: () => apiGet({ url: `/company/${id}`})
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
  
  useEffect(()=>{
    if(data){
      let {name, code, email, address} = data;
      setFormData( prevState =>({
        ...prevState,
        name, code, email, address
      }))
    }
  }, [data])


  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    address: "",
    logo: "logourl"
  })

  const handleChange = (prop) => (event) => {
    setFormData(prevState => ({
      ...prevState,
      [prop]: event.target.value
    }))
  }
  const queryClient = useQueryClient();
  const {isLoading, mutate} = useMutation({
    mutationFn: ()=>apiPatch({ url: `/company/${id}`, data: formData})
    .then( res =>{
      console.log(res.data)
      dispatchMessage({ message: res.message})
      queryClient.invalidateQueries(["allCompanies", id])
    })
    .catch(error =>{
      console.log(error)
      dispatchMessage({severity: "error", message: error.message})
    }),
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    //return console.log(formData)
    mutate()
  }

  

  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Company</h4>
        <span className="breadcrumb-item ms-3"><a href="/companies"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
      </header>
      

      <div className="row">
          <div className="col-12 d-flex align-items-stretch">
            <div className="card w-100">
              <div className="card-body p-4" style={{maxWidth: "700px"}}>
                <h5 className="card-title fw-semibold mb-4">Edit Company Details</h5>
                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Company Name</label>
                    <input type="text" className="form-control" id="name" value={formData.name} onChange={handleChange("name")}/>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="code" className="form-label">Company Code</label>
                    <input type="text" className="form-control" id="code" value={formData.code} onChange={handleChange("code")}  />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control"  id="email" value={formData.email} onChange={handleChange("email")}  />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <textarea className="form-control" id="address" rows={4} value={formData.address} onChange={handleChange("address")}></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="logo" className="form-label">Logo</label>
                    <input type="file" className="form-control"  id="logo"  /* onChange={handleChange("logo")} */ />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="brands" className="form-label">Brands</label>
                    <input type="file" className="form-control" id="brands" value={formData.brands} onChange={handleChange("brands")} />
                  </div>

                  <button type="submit" className="btn btn-primary mt-3 px-5 py-2" disabled={isLoading || isFetching} onClick={handleSubmit}>{isLoading ? "Loading..." : "Submit"}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default EditCompany
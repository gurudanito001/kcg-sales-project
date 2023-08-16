"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/services/apiService";
import { useParams } from 'next/navigation';
import useDispatchMessage from "@/hooks/useDispatchMessage";
import { useRouter } from "next/navigation";
import Compress from "react-image-file-resizer";

const EditMonthlyTarget = () =>{
  const params = useParams();
  const {id} = params;
  console.log(id);
  const dispatchMessage = useDispatchMessage();
  const router = useRouter();

  const [formData, setFormData] = useState({
    month: "",
    target: "",
  })

  const {data, isFetching} = useQuery({
    queryKey: ["allMonthlyTargets", id],
    queryFn: () => apiGet({ url: `/monthlyTarget/${id}`})
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
      const {month, target} = data
      setFormData( prevState =>({
        ...prevState,
        month, target
      }))
    }
  }, [data])
  

  const handleChange = (prop) => (event) => {
    setFormData(prevState => ({
      ...prevState,
      [prop]: event.target.value
    }))
  }

  const queryClient = useQueryClient();
  const {isLoading, mutate} = useMutation({
    mutationFn: ()=>apiPatch({ url: `/monthlyTarget/${id}`, data: formData})
    .then( res =>{
      console.log(res.data)
      dispatchMessage({ message: res.message})
      queryClient.invalidateQueries(["allMonthlyTargets", id])
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
        <h4 className="m-0">Monthly Target</h4>
        <span className="breadcrumb-item ms-3"><a href="/targetAchievements"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
      </header>
      

      <div className="row">
          <div className="col-12 d-flex align-items-stretch">
            <div className="card w-100">
              <div className="card-body p-4" style={{maxWidth: "700px"}}>
                <h5 className="card-title fw-semibold mb-4 opacity-75">Edit Monthly Target Details</h5>
                <form>
                  <div className="mb-3">
                    <label htmlFor="month" className="form-label">Month</label>
                    <input type="month" className="form-control" id="month" value={formData.month} onChange={handleChange("month")} />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="target" className="form-label">Monthly Target</label>
                    <input type="text" className="form-control" id="target" value={formData.target} onChange={handleChange("target")} />
                  </div>
                  <div className="mt-5">
                    <button type="submit" className="btn btn-primary px-5 py-2" disabled={isLoading || isFetching} onClick={handleSubmit}>{isLoading ? "Loading..." : "Submit"}</button>
                    <a className="btn btn-outline-primary px-5 py-2 ms-3" href="/targetAchievements">Cancel</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default EditMonthlyTarget
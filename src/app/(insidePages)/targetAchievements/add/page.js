"use client"

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiPost, apiGet } from "@/services/apiService";
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Compress from "react-image-file-resizer";
//import formValidator from '../../../services/validation';

const AddMonthlyTarget = () => {
  const dispatchMessage = useDispatchMessage();
  const [formData, setFormData] = useState({
    month: "",
    target: "",
  })

  const handleChange = (prop) => (event) => {
    setFormData(prevState => ({
      ...prevState,
      [prop]: event.target.value
    }))
  }

  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation({
    mutationFn: () => apiPost({ url: "/monthlyTarget", data: formData })
      .then(res => {
        console.log(res.data)
        dispatchMessage({ message: res.message })
        queryClient.invalidateQueries(["allMonthlyTargets"])
      })
      .catch(error => {
        console.log(error)
        dispatchMessage({ severity: "error", message: error.message })
      }),
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    // return console.log(formData, base64Image)
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
            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Add Monthly Target</h5>
              <form>

                <div className="mb-3">
                  <label htmlFor="month" className="form-label">Month</label>
                  <input type="month" className="form-control" id="month" value={formData.month} onChange={handleChange("month")} />
                </div>

                <div className="mb-3">
                  <label htmlFor="target" className="form-label">Monthly Target</label>
                  <input type="text" className="form-control" id="target" value={formData.target} onChange={handleChange("target")} />
                </div>

                <button type="submit" className="btn btn-primary mt-3 px-5 py-2" disabled={isLoading} onClick={handleSubmit}>{isLoading ? "Loading..." : "Submit"}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddMonthlyTarget
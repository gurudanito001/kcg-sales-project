"use client"

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiPost, apiGet } from "@/services/apiService";
import useDispatchMessage from "@/hooks/useDispatchMessage";
import { useSelector } from "react-redux";
//import formValidator from '../../../services/validation';

const AddCustomerVisit = () => {
  const dispatchMessage = useDispatchMessage();
  const { userData } = useSelector(state => state.userData);

  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      employeeId: userData.id
    }))
  }, [userData])


  const [formData, setFormData] = useState({
    employeeId: "",
    customerId: "",
    contactPersonId: "",
    callType: "",
    status: "",
    productsDiscussed: [],
    quantity: "",
    durationOfMeeting: "",
    meetingOutcome: "",
    visitDate: "",
    followUpVisits: [],
    pfiRequest: false
  })

  const clearState = () =>{
    setFormData( prevState => ({
      ...prevState,
      customerId: "",
      contactPersonId: "",
      callType: "",
      status: "",
      productsDiscussed: [],
      quantity: "",
      durationOfMeeting: "",
      meetingOutcome: "",
      visitDate: "",
      followUpVisits: [],
      pfiRequest: false
    }))
  }

  const [followUpData, setFollowUpData] = useState({
    visitDate: "",
    meetingOutcome: ""
  })

  const customerQuery = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => apiGet({ url: "/customer" })
      .then(res => {
        console.log(res)
        return res.data
      })
      .catch(error => {
        console.log(error)
        dispatchMessage({ severity: "error", message: error.message })
      })
  })

  const contactPersonQuery = useQuery({
    queryKey: ["allContactPersons"],
    queryFn: () => apiGet({ url: "/contactPerson" })
      .then(res => {
        console.log(res)
        return res.data
      })
      .catch(error => {
        console.log(error)
        dispatchMessage({ severity: "error", message: error.message })
      })
  })

  const productsQuery = useQuery({
    queryKey: ["allProducts"],
    queryFn: () => apiGet({ url: "/product" })
      .then(res => {
        console.log(res)
        return res.data
      })
      .catch(error => {
        console.log(error)
        dispatchMessage({ severity: "error", message: error.message })
      })
  })

  const handleCheckPfi = () => {
    setFormData(prevState => ({
      ...prevState,
      pfiRequest: !prevState.pfiRequest
    }))
  }

  const listCustomers = () => {
    if (customerQuery.data) {
      return customerQuery.data.map(customer =>
        <option key={customer.id} value={customer.id}> {customer.companyName} </option>
      )
    }
  }

  const listContactPersons = () => {
    let persons = contactPersonQuery.data;
    if (formData.customerId) {
      persons = persons.filter(person => person.customerId === formData.customerId)
    }
    if (persons.length > 0) {
      return persons.map(person =>
        <option key={person.id} value={person.id}>{person.name}</option>
      )
    }
  }


  const handleChange = (prop) => (event) => {
    setFormData(prevState => ({
      ...prevState,
      [prop]: event.target.value
    }))
  }

  const handleChangeFollowUp = (prop) => (event) => {
    setFollowUpData(prevState => ({
      ...prevState,
      [prop]: event.target.value
    }))
  }

  const handleCheckProducts = (product) => (event) => {
    if (event.target.checked) {
      let productData;
      productsQuery.data.forEach(item => {
        if (item.name === product) {
          productData = item.name;
        }
      })
      let state = formData;
      state.productsDiscussed.push(productData);
      setFormData(prevState => ({
        ...prevState,
        ...state
      }))
    } else {
      let state = formData;
      state.productsDiscussed = state.productsDiscussed.filter(function (item) { return item !== product })
      setFormData(prevState => ({
        ...prevState,
        ...state
      }))
    }
  }

  const listProductOptions = () => {
    return productsQuery.data.map(product =>
      <div className="form-check ms-3" key={product.id}>
        <input className="form-check-input" type="checkbox" checked={isChecked(product.name)} onChange={handleCheckProducts(product.name)} value={product.name} id={product.id} />
        <label className="form-check-label fw-bold" htmlFor={product.id}>
          {product.name}
        </label>
      </div>
    )
  }

  const isChecked = (prop) => {
    let checked = false;
    formData.productsDiscussed.forEach(item => {
      if (item === prop) {
        checked = true
      }
    })
    return checked;
  }


  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation({
    mutationFn: () => apiPost({ url: "/visitReport", data: formData })
      .then(res => {
        console.log(res.data)
        dispatchMessage({ message: res.message })
        queryClient.invalidateQueries(["allVisitReports"])
        clearState()
      })
      .catch(error => {
        console.log(error)
        dispatchMessage({ severity: "error", message: error.message })
      }),
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData)
    mutate()
  }

  const handleSubmitFollowUp = (event) => {
    event.preventDefault();
    let id = new Date().getTime();
    let tempFollowUpVisits = formData.followUpVisits;
    tempFollowUpVisits.push({ id, ...followUpData })
    setFormData(prevState => ({
      ...prevState,
      followUpVisits: tempFollowUpVisits
    }))
    setFollowUpData(prevState => ({
      ...prevState,
      visitDate: "",
      meetingOutcome: ""
    }))
    return console.log(followUpData)
  }

  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Visit Report</h4>
        <span className="breadcrumb-item ms-3"><a href="/visits"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
      </header>


      <div className="row">
        <div className="col-12 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Add Visit Report</h5>
              <form>

                <div className="mb-3">
                  <label htmlFor="customerId" className="form-label">Customer (<span className='fst-italic text-warning'>required</span>)</label>
                  <select className="form-select shadow-none" id="customerId" onChange={handleChange("customerId")} value={formData.customerId} aria-label="Default select example">
                    <option value="">Select Customer</option>
                    {!customerQuery.isLoading && listCustomers()}
                  </select>
                  {/* <span className='text-danger font-monospace small'>{errors.companyId}</span> */}
                </div>
                <div className="mb-3">
                  <label htmlFor="contactPersonId" className="form-label">Contact Person (<span className='fst-italic text-warning'>required</span>)</label>
                  <select className="form-select shadow-none" id="contactPersonId" onChange={handleChange("contactPersonId")} value={formData.contactPersonId} aria-label="Default select example">
                    <option value="">Select Contact Person</option>
                    {!contactPersonQuery.isLoading && listContactPersons()}
                  </select>
                  {/* <span className='text-danger font-monospace small'>{errors.branchId}</span> */}
                </div>

                <div className="mb-3">
                  <label htmlFor="callType" className="form-label">Call Type (<span className='fst-italic text-warning'>required</span>)</label>
                  <select className="form-select shadow-none" id="callType" onChange={handleChange("callType")} value={formData.callType} aria-label="Default select example">
                    <option value="">Select Call Type</option>
                    <option value="Telephone">Telephone</option>
                    <option value="In-Person">In-Person</option>

                  </select>
                  {/* <span className='text-danger font-monospace small'>{errors.branchId}</span> */}
                </div>

                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Status (<span className='fst-italic text-warning'>required</span>)</label>
                  <select className="form-select shadow-none" id="status" onChange={handleChange("status")} value={formData.status} aria-label="Default select example">
                    <option value="">Select Status</option>
                    <option value="Cold">Cold</option>
                    <option value="Warm">Warm</option>
                    <option value="Hot">Hot</option>
                    <option value="Follow-Up">Follow-Up</option>
                    <option value="Demo">Demo</option>
                  </select>
                  {/* <span className='text-danger font-monospace small'>{errors.branchId}</span> */}
                </div>


                <div className="mb-3">
                  <label htmlFor="quantity" className="form-label">Quantity</label>
                  <input type="text" className="form-control" id="quantity" value={formData.quantity} onChange={handleChange("quantity")} />
                </div>

                <div className="mb-3">
                  <label htmlFor="durationOfMeeting" className="form-label">Duration Of Meeting (<span className='fst-italic text-warning'>required</span>)</label>
                  <select className="form-select shadow-none" id="durationOfMeeting" onChange={handleChange("durationOfMeeting")} value={formData.durationOfMeeting} aria-label="Default select example">
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
                  {/* <span className='text-danger font-monospace small'>{errors.branchId}</span> */}
                </div>

                <div className="mb-3">
                  <label htmlFor="meetingOutcome" className="form-label">Meeting Outcome</label>
                  <textarea rows={4} className="form-control" id="meetingOutcome" value={formData.meetingOutcome} onChange={handleChange("meetingOutcome")}></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="visitDate" className="form-label">Visit Date</label>
                  <input type="datetime-local" className="form-control" id="visitDate" value={formData.visitDate} onChange={handleChange("visitDate")} />
                </div>

                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" checked={formData.pfiRequest} onChange={handleCheckPfi} id="pfiRequest" />
                  <label className="form-check-label fw-bold" htmlFor="pfiRequest">
                    Pfi Request
                  </label>
                </div>

                <div className="mb-3">
                  <label htmlFor="productsDiscussed" className="form-label">Products Discussed (<span className='fst-italic text-warning'>required</span>)</label>
                  {!productsQuery.isLoading && !productsQuery.isError &&
                    <div className='d-flex'> {listProductOptions()} </div>}
                  {/* <span className='text-danger font-monospace small'>{errors.brands}</span> */}
                </div>

                <button type="submit" className="btn btn-primary mt-3 px-5 py-2" disabled={isLoading} onClick={handleSubmit}>{isLoading ? "Loading..." : "Submit"}</button>

              </form>
            </div>

            
            
            {/* <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Add Follow Up Visit</h5>
              <div className="mb-3">
                <label htmlFor="visitDate" className="form-label">Visit Date</label>
                <input type="datetime-local" className="form-control" id="visitDate" value={followUpData.visitDate} onChange={handleChangeFollowUp("visitDate")} />
              </div>
              <div className="mb-3">
                <label htmlFor="meetingOutcome" className="form-label">Meeting Outcome</label>
                <textarea rows={4} className="form-control" id="meetingOutcome" value={followUpData.meetingOutcome} onChange={handleChangeFollowUp("meetingOutcome")}></textarea>
              </div>
              <button type="submit" className="btn btn-primary mt-3 px-5 py-2" disabled={isLoading} onClick={handleSubmitFollowUp}>Add Follow Up Visit</button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCustomerVisit
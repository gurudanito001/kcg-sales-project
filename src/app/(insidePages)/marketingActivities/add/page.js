"use client"

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiPost, apiGet } from "@/services/apiService";
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Compress from "react-image-file-resizer";
import { useSelector } from "react-redux";
//import formValidator from '../../../services/validation';

const AddMarketingActivity = () => {
  const dispatchMessage = useDispatchMessage();
  const {userData} = useSelector( state => state.userData);
  const [formData, setFormData] = useState({
    employeeId: "",
    activityName: "",
    activityDate: "",
    participants: "",
    location: "",
    objective: "",
    targetResult: "",
    briefReport: "",
    images: [],
    costIncurred: "",
    pdfDetails: ""
  })

  const [selectedFile, setSelectedFile] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [base64Images, setBase64Images] = useState([]);

  useEffect(() => {
    if (base64Images) {
      setFormData(prevState => ({
        ...prevState,
        images: base64Images
      }))
    }
  }, [base64Images])

  useEffect(()=>{
    setFormData( prevState =>({
      ...prevState,
      employeeId: userData.id
    }))
  },[userData])


  const uploadImage = (event) => {
    let id = new Date().getTime();
    const file = event.target.files[0];
    if (file) {
      Compress.imageFileResizer(
        file, // the file from input
        120, // width
        120, // height
        "PNG", // compress format WEBP, JPEG, PNG
        80, // quality
        0, // rotation
        (uri) => {
          let images = base64Images;
          images.push({ id, uri })
          setBase64Images(images)
        },
        "base64" // blob or base64 default base64
      );
      setSelectedFile(file);
      let urls = imageUrls;
      urls.push({ id, url: URL.createObjectURL(file) })
      setImageUrls(urls);
    }
  }

  const deleteImage = (id) => (e) => {
    e.preventDefault();
    let base64ImageList = base64Images;
    base64ImageList = base64ImageList.filter(function (item) { return id !== item.id });
    setBase64Images(base64ImageList);

    let imageUrlList = imageUrls;
    imageUrlList = imageUrlList.filter(function (item) { return id !== item.id });
    setImageUrls(imageUrlList);
  }

  const listImages = ()=>{
    if(imageUrls.length > 0){
      return imageUrls.map( (img) => <li key={img.id} className='m-2 d-flex align-items-start'>
        <img src={img.url} alt="Product Image" width="200px" />
        <button onClick={deleteImage(img.id)} style={{ width: "20px", height: "20px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.693)", position: "relative", top: "-15px", left: "-8px"}} 
        className='btn d-flex align-items-center justify-content-center text-white'><i className="fa-solid fa-xmark"></i></button>
      </li>)
    }
  }

  const handleChange = (prop) => (event) => {
    setFormData(prevState => ({
      ...prevState,
      [prop]: event.target.value
    }))
  }


  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation({
    mutationFn: () => apiPost({ url: "/marketingActivity", data: formData })
      .then(res => {
        console.log(res.data)
        dispatchMessage({ message: res.message })
        queryClient.invalidateQueries(["allMarketingActivities"])
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
  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Marketing Activity</h4>
        <span className="breadcrumb-item ms-3"><a href="/marketingActivities"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
      </header>


      <div className="row">
        <div className="col-12 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Add Marketing Activity</h5>
              <form>
                <div className="mb-3">
                  <label htmlFor="activityName" className="form-label">Activity Name</label>
                  <input type="text" className="form-control" id="activityName" value={formData.activityName} onChange={handleChange("activityName")} />
                </div>

                <div className="mb-3">
                  <label htmlFor="activityDate" className="form-label">Activity Date</label>
                  <input type="date" className="form-control" id="activityDate" value={formData.activityDate} onChange={handleChange("activityDate")} />
                </div>

                <div className="mb-3">
                  <label htmlFor="participants" className="form-label">Participants</label>
                  <textarea rows={4} className="form-control" id="participants" value={formData.participants} onChange={handleChange("participants")}></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location</label>
                  <textarea rows={4} className="form-control" id="location" value={formData.location} onChange={handleChange("location")}></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="objective" className="form-label">Objective</label>
                  <textarea rows={4} className="form-control" id="objective" value={formData.objective} onChange={handleChange("objective")}></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="targetResult" className="form-label">Target Result</label>
                  <textarea rows={4} className="form-control" id="targetResult" value={formData.targetResult} onChange={handleChange("targetResult")}></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="briefReport" className="form-label">Brief Report</label>
                  <textarea rows={4} className="form-control" id="briefReport" value={formData.briefReport} onChange={handleChange("briefReport")}></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="costIncurred" className="form-label">Cost Incurred</label>
                  <input type="text" className="form-control" id="costIncurred" value={formData.costIncurred} onChange={handleChange("costIncurred")} />
                </div>

                <div className="mb-3">
                  <label htmlFor="images" className="form-label"> Images  (<span className='fst-italic text-warning'>required</span>)</label>
                  <input className="form-control" id="images" accept="image/*" type="file" onChange={uploadImage} />
                  {/* <span className='text-danger font-monospace small'>{errors.logo}</span> */}
                  {imageUrls.length > 0 &&
                    <div>
                      <h6 className='small fw-bold mt-3'>Images</h6>
                      <div className="d-flex">
                        {listImages()}
                      </div>
                    </div>}
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

export default AddMarketingActivity
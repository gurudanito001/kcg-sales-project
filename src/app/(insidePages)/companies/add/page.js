"use client"

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiPost, apiGet } from "@/services/apiService";
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Compress from "react-image-file-resizer";
import { useRouter } from "next/navigation";
//import formValidator from '../../../services/validation';

const AddCompany = () =>{
  const dispatchMessage = useDispatchMessage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    address: "",
    logo: "",
    brands: []
  })

  const clearState = () =>{
    setFormData( prevState => ({
      ...prevState,
      name: "",
      code: "",
      email: "",
      address: "",
      logo: "logourl",
      brands: []
    }))
  }

  const brandsQuery = useQuery({
    queryKey: ["allBrands" ],
    queryFn:  ()=> apiGet({ url: "/brand"})
    .then(res => {
      console.log(res)
      return res.data
    })
    .catch(error =>{
      console.log(error)
      dispatchMessage({severity: "error", message: error.message})
      return []
    })
  })

  const handleCheck = (brand) =>(event) =>{
    let brands = formData.brands
    let brandExists = brands.includes(brand);
    if(brandExists){
      brands = brands.filter( item => item !== brand)
      setFormData( prevState => ({
        ...prevState,
        brands 
      }))
    }else{
      brands.push(brand);
      setFormData( prevState => ({
        ...prevState,
        brands 
      }))
    }
  }

  const isChecked = (prop) =>{
    let checked = false;
    formData.brands.forEach( item =>{
      if(item === prop){
        checked = true
      }
    })
    return checked;
  }

  const listBrands = () =>{
    return brandsQuery.data.map(brand =>
      <div className="form-check ms-3" key={brand.id}>
        <input className="form-check-input" type="checkbox" checked={isChecked(brand.name)} onChange={handleCheck(brand.name)} value={brand.name} id={brand.id} />
        <label className="form-check-label fw-bold" htmlFor={brand.id}>
          {brand.name}
        </label>
      </div>
    )
  }

  const [ selectedFile, setSelectedFile] = useState("");
  const [ imageUrl, setImageUrl] = useState("");
  const [ base64Image, setBase64Image ] = useState("");

  useEffect(()=>{
    if(base64Image){
      setFormData( prevState => ({
        ...prevState,
        logo: base64Image
      }))
    }
  }, [base64Image])

  
  const uploadImage = (event) => {
    const file = event.target.files[0];
    if(file){
      Compress.imageFileResizer(
        file, // the file from input
        120, // width
        120, // height
        "PNG", // compress format WEBP, JPEG, PNG
        80, // quality
        0, // rotation
        (uri) => {
          setBase64Image(uri)
        },
        "base64" // blob or base64 default base64
      );
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  }

  const handleChange = (prop) => (event) => {
    setFormData(prevState => ({
      ...prevState,
      [prop]: event.target.value
    }))
  }


  const queryClient = useQueryClient();
  const {isLoading, mutate} = useMutation({
    mutationFn: ()=>apiPost({ url: "/company", data: formData})
    .then( res =>{
      console.log(res.data)
      dispatchMessage({ message: res.message})
      queryClient.invalidateQueries(["allCompanies"])
      router.push(`/companies`)
    })
    .catch(error =>{
      console.log(error)
      dispatchMessage({severity: "error", message: error.message})
    }),
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData, base64Image)
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
                <h5 className="card-title fw-semibold mb-4 opacity-75">Add Company</h5>
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
                    <label htmlFor="companyLogo" className="form-label">Company Logo (<span className='fst-italic text-warning'>required</span>)</label>
                    <input className="form-control" id="companyLogo" accept="image/*" type="file" onChange={uploadImage} />
                    {/* <span className='text-danger font-monospace small'>{errors.logo}</span> */}
                    {imageUrl &&
                      <div>
                        <h6 className='small fw-bold mt-3'>Logo Preview</h6>
                        <img src={imageUrl} alt="Logo Preview" className='border rounded' width="100px" />
                      </div>}
                  </div>

                  {/* <div className="mb-3">
                    <label htmlFor="brands" className="form-label">Brands</label>
                    <input type="file" className="form-control" id="brands" value={formData.brands} onChange={handleChange("brands")} />
                  </div> */}
                  <div className="mb-3">
                    <label htmlFor="brands" className="form-label">Brands (<span className='fst-italic text-warning'>required</span>)</label>
                    {!brandsQuery.isLoading && !brandsQuery.isError &&
                      <div className='d-flex'> {listBrands()} </div>}
                      {/* <span className='text-danger font-monospace small'>{errors.brands}</span> */}
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

export default AddCompany
"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/services/apiService";
import { useParams } from 'next/navigation';
import useDispatchMessage from "@/hooks/useDispatchMessage";
import { useRouter } from "next/navigation";
import Compress from "react-image-file-resizer";

const EditProduct = () =>{
  const params = useParams();
  const {id} = params;
  console.log(id);
  const dispatchMessage = useDispatchMessage();
  const router = useRouter();

  const {data, isFetching} = useQuery({
    queryKey: ["allProducts", id],
    queryFn: () => apiGet({ url: `/product/${id}`})
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
      let {name, code, brandId, description, specifications, images, vatInclusive, vatRate} = data;
      setFormData( prevState =>({
        ...prevState,
        name, code, brandId, description, specifications, images, vatInclusive, vatRate
      }))
    }
  }, [data])


  const [formData, setFormData] = useState({
    name: "",
    code: "",
    brandId: "",
    description: "",
    specifications: "",
    images: [],
    vatInclusive: false,
    vatRate: ""
  })

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
    })
  })

  const listBrandOptions = () =>{
    if(brandsQuery?.data?.length){
      return brandsQuery.data.map(brand =>
        <option key={brand.id} value={brand.id}>{brand.name}</option>
      )
    }
  }


  const [ selectedFile, setSelectedFile] = useState("");
  const [ imageUrls, setImageUrls] = useState([]);
  const [ base64Images, setBase64Images ] = useState([]);

  useEffect(()=>{
    if(base64Images){
      setFormData( prevState => ({
        ...prevState,
        newImages: base64Images
      }))
    }
  }, [base64Images])

  
  const uploadImage = (event) => {
    let id = new Date().getTime();
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
          let images = base64Images;
          images.push({id, uri})
          setBase64Images(images)
        },
        "base64" // blob or base64 default base64
      );
      //setSelectedFile(file);
      let urls = imageUrls;
      urls.push({id, url: URL.createObjectURL(file)})
      setImageUrls(urls);
    }
  }

  const deleteExistingImages = (image) => (e) =>{
    e.preventDefault();
    let existingImages = formData.images;
    existingImages = existingImages.filter(function(item){ return image !== item});
    setFormData(prevState => ({
      ...prevState,
      images: existingImages
    }));
  }


  const deleteImage = (id) => (e) =>{
    e.preventDefault();
    let base64ImageList = base64Images;
    base64ImageList = base64ImageList.filter(function(item){ return id !== item.id});
    setBase64Images(base64ImageList);

    let imageUrlList = imageUrls;
    imageUrlList = imageUrlList.filter(function(item){ return id !== item.id});
    setImageUrls(imageUrlList);
  }

  const listExistingImages = ()=>{
    if(formData.images.length > 0){
      console.log(formData.images)
      return formData.images.map( (img) => <li key={img} className='m-2 d-flex align-items-start'>
        <img src={img} alt="Product Image" height="150px" />
        <button onClick={deleteExistingImages(img)} style={{ width: "20px", height: "20px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.693)", position: "relative", top: "-15px", left: "-8px"}} 
        className='btn d-flex align-items-center justify-content-center text-white'><i className="fa-solid fa-xmark"></i></button>
      </li>)
    }
  }

  const listImages = ()=>{
    if(imageUrls.length > 0){
      return imageUrls.map( (img) => <li key={img.id} className='m-2 d-flex align-items-start'>
        <img src={img.url} alt="Product Image" height="150px" />
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
  const {isLoading, mutate} = useMutation({
    mutationFn: ()=>apiPatch({ url: `/product/${id}`, data: formData})
    .then( res =>{
      console.log(res.data)
      dispatchMessage({ message: res.message})
      queryClient.invalidateQueries(["allProducts", id])
      setImageUrls([])
      setBase64Images([])
    })
    .catch(error =>{
      console.log(error)
      dispatchMessage({severity: "error", message: error.message})
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
        <h4 className="m-0">Product</h4>
        <span className="breadcrumb-item ms-3"><a href="/products"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
      </header>
      

      <div className="row">
          <div className="col-12 d-flex align-items-stretch">
            <div className="card w-100">
              <div className="card-body p-4" style={{maxWidth: "700px"}}>
                <h5 className="card-title fw-semibold mb-4 opacity-75">Edit Product</h5>
                <form>
                  <div className="mb-3">
                    <label htmlFor="brandId" className="form-label">Brand (<span className='fst-italic text-warning'>required</span>)</label>
                    <select className="form-select shadow-none" id="brandId" onChange={handleChange("brandId")} value={formData.brandId} aria-label="Default select example">
                      <option value="">Select Brand</option>
                      {!brandsQuery.isLoading && listBrandOptions()}
                    </select>
                    {/* <span className='text-danger font-monospace small'>{errors.brandId}</span> */}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Product Name</label>
                    <input type="text" className="form-control" id="name" value={formData.name} onChange={handleChange("name")}/>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="code" className="form-label">Product Code</label>
                    <input type="text" className="form-control" id="code" value={formData.code} onChange={handleChange("code")}  />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" rows={4}  id="description" value={formData.description} onChange={handleChange("description")}></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="specifications" className="form-label">Specifications</label>
                    <textarea className="form-control" id="specifications" rows={4} value={formData.specifications} onChange={handleChange("specifications")}></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="images" className="form-label">Product Images (<span className='fst-italic text-warning'>required</span>)</label>
                    <input className="form-control" id="images" accept="image/*" type="file" onChange={uploadImage} />
                    {/* <span className='text-danger font-monospace small'>{errors.logo}</span> */}
                    {(imageUrls.length > 0 || formData.images.length > 0) &&
                      <div>
                        <h6 className='small fw-bold mt-3'>Images</h6>
                        <div className="d-flex flex-wrap"> 
                          {listExistingImages()}
                          {listImages()}
                        </div>
                      </div>}
                  </div>

                  <div className="form-check form-switch mb-3">
                    <input className="form-check-input" type="checkbox" role="switch" checked={formData.vatInclusive} onChange={(e) => setFormData(prevState => ({
                      ...prevState,
                      vatInclusive: !prevState.vatInclusive
                    }))} id="vatInclusive" />
                    <label className="form-check-label" htmlFor="vatInclusive">VAT Inclusive</label>
                  </div>

                  {formData.vatInclusive &&
                    <div className="mb-3">
                      <label htmlFor="vatRate" className="form-label">VAT Rate</label>
                      <input type="text" className="form-control shadow-none" value={formData.vatRate} onChange={handleChange("vatRate")} id="vatRate" placeholder="VAT Rate" />
                    </div>}

                  <button type="submit" className="btn btn-primary mt-3 px-5 py-2" disabled={isLoading} onClick={handleSubmit}>{isLoading ? "Loading..." : "Submit"}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default EditProduct
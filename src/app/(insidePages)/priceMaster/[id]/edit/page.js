"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/services/apiService";
import { useParams } from 'next/navigation';
import useDispatchMessage from "@/hooks/useDispatchMessage";
import { useRouter } from "next/navigation";
import formValidator from "@/services/validation";

const EditPriceMaster = () => {
  const params = useParams();
  const { id } = params;
  console.log(id);
  const dispatchMessage = useDispatchMessage();
  const router = useRouter();

  const { data, isFetching } = useQuery({
    queryKey: ["allProductPrices", id],
    queryFn: () => apiGet({ url: `/priceMaster/${id}` })
      .then(res => {
        console.log(res.data)
        dispatchMessage({ message: res.message })
        return res.data
      })
      .catch(error => {
        console.log(error.message)
        dispatchMessage({ severity: "error", message: error.message })
        return {}
      }),
      staleTime: Infinity
  })

  useEffect(() => {
    if (data) {
      let { product, brand, unitPrice, promoPrice, anyPromo, promoText, validFrom, validTill } = data;
      setFormData(prevState => ({
        ...prevState,
        productId: product.id,
        brandId: brand.id,
        unitPrice, promoPrice, anyPromo, promoText, validFrom, validTill
      }))
    }
  }, [data])


  const [formData, setFormData] = useState({
    brandId: "",
    productId: "",
    unitPrice: "",
    promoPrice: "",
    anyPromo: false,
    promoText: "",
    validFrom: "",
    validTill: ""
  })
  const [errors, setErrors] = useState({});

  useEffect(()=>{
    if(!formData.anyPromo){
      setFormData(prevState =>({
        ...prevState,
        promoPrice: "",
        promoText: "",
        validFrom: "",
        validTill: ""
      }))
    }
  }, [formData.anyPromo])

  const brandsQuery = useQuery({
    queryKey: ["allBrands"],
    queryFn: () => apiGet({ url: "/brand" })
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
        return []
      })
  })

  const listBrandOptions = () => {
    if (brandsQuery?.data?.length) {
      return brandsQuery.data.map(brand =>
        <option key={brand.id} value={brand.id}>{brand.name}</option>
      )
    }
  }

  const listProductOptions = () => {
    let products = productsQuery.data;
    if (formData.brandId) {
      products = products.filter(product => product.brandId === formData.brandId)
    }
    if (products.length) {
      return products.map(product =>
        <option key={product.id} value={product.id}>{product.name}</option>
      )
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
    mutationFn: () => apiPatch({ url: `/priceMaster/${id}`, data: formData })
      .then(res => {
        console.log(res.data)
        dispatchMessage({ message: res.message })
        queryClient.invalidateQueries(["allProductPrices", id])
        router.push(`/priceMaster/${id}`)
      })
      .catch(error => {
        console.log(error)
        dispatchMessage({ severity: "error", message: error.message })
      }),
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData)
    let errors = formValidator(["brandId", "productId", "unitPrice"], formData);
    if(Object.keys(errors).length){
      return setErrors(errors);
    }
    mutate()
  }



  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Price Master</h4>
        <span className="breadcrumb-item ms-3"><a href="/priceMaster"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
      </header>


      <div className="row">
        <div className="col-12 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Edit Product Price</h5>
              <form>
                <div className="mb-3">
                  <label htmlFor="brandId" className="form-label">Brand (<span className='fst-italic text-warning'>required</span>)</label>
                  <select className="form-select" id="brandId" onChange={handleChange("brandId")} value={formData.brandId} aria-label="Default select example">
                    <option value="">Select Brand</option>
                    {!brandsQuery.isLoading && listBrandOptions()}
                  </select>
                  <span className='text-danger font-monospace small'>{errors.brandId}</span>
                </div>

                <div className="mb-3">
                  <label htmlFor="productId" className="form-label">Product (<span className='fst-italic text-warning'>required</span>)</label>
                  <select className="form-select" id="productId" onChange={handleChange("productId")} value={formData.productId} aria-label="Default select example">
                    <option value="">Select Product</option>
                    {!productsQuery.isLoading && listProductOptions()}
                  </select>
                  <span className='text-danger font-monospace small'>{errors.productId}</span>
                </div>

                <div className="mb-3">
                  <label htmlFor="unitPrice" className="form-label">Unit Price (<span className='fst-italic text-warning'>required</span>)</label>
                  <input type="text" className="form-control" id="unitPrice" value={formData.unitPrice} onChange={handleChange("unitPrice")} />
                  <span className='text-danger font-monospace small'>{errors.productId}</span>
                </div>

                <div className="form-check form-switch mb-3">
                  <input className="form-check-input" type="checkbox" role="switch" checked={formData.anyPromo} onChange={(e) => setFormData(prevState => ({
                    ...prevState,
                    anyPromo: !prevState.anyPromo
                  }))} id="anyPromo" />
                  <label className="form-check-label" htmlFor="anyPromo">Any Promo?</label>
                </div>

                {formData.anyPromo &&
                  <>
                    <div className="mb-3">
                      <label htmlFor="promoPrice" className="form-label">Promo Price</label>
                      <input type="text" className="form-control" id="promoPrice" value={formData.promoPrice} onChange={handleChange("promoPrice")} />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="promoText" className="form-label">Promo Text</label>
                      <textarea className="form-control" id="promoText" value={formData.promoText} onChange={handleChange("promoText")}></textarea>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="validFrom" className="form-label">Valid From</label>
                      <input type="datetime-local" className="form-control" id="validFrom" value={formData.validFrom} onChange={handleChange("validFrom")} />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="validTill" className="form-label">Valid Till</label>
                      <input type="datetime-local" className="form-control" id="validTill" value={formData.validTill} onChange={handleChange("validTill")} />
                    </div>
                  </>}

                <div className="mt-5">
                  <button type="submit" className="btn btn-primary px-5 py-2" disabled={isLoading || isFetching} onClick={handleSubmit}>{isLoading ? "Loading..." : "Submit"}</button>
                  <a className="btn btn-outline-primary px-5 py-2 ms-3" href="/priceMaster">Cancel</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditPriceMaster
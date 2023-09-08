"use client"

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiService";
import { useParams } from 'next/navigation';
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';
import { useSelector } from "react-redux";
import { getDecodedToken } from "@/services/localStorageService";
import formatAsCurrency from "@/services/formatAsCurrency";
import moment from "moment";
import useGetUserData from "@/hooks/useGetUserData";



const DataListItem = ({title, value}) => {
  return (
    <div className="row mb-3 d-flex align-items-center">
      <div className="col-12 col-md-4">
        <h6 className="m-0">{title}</h6>
      </div>
      <div className="col-12 col-md-8">
        <span>{value}</span>
      </div>
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

const ProductDetails = () => {
  const params = useParams();
  const {id} = params;
  console.log(id);
  const {userData} = useGetUserData();
  // const tokenData = getDecodedToken();
  const dispatchMessage = useDispatchMessage();

  const {data, isFetching} = useQuery({
    queryKey: ["allProducts", id],
    queryFn: () => apiGet({ url: `/product/${id}`})
    .then(res =>{
      console.log(res.data)
      // dispatchMessage({ message: res.message})
      return res.data
    })
    .catch(error =>{
      console.log(error.message)
      dispatchMessage({ severity: "error", message: error.message})
      return {}
    })
  }) 

  const listProductImages = () => {
    return data.images.map(image => {
      return <img key={image} src={image} height="150px" className="p-3 rounded-3" alt="Product Image" />
    })
  }

    const deriveProductStatus = (priceData)=>{
    let {unitPrice, promoPrice, validTill, anyPromo} = priceData
    let validTillString = new Date(validTill).getTime();
    let currentDateString = new Date().getTime();
    let result = {};
    if(!anyPromo){
      result.price = unitPrice
      result.promoActive = false;
    }else if(currentDateString >= validTillString){
      result.price = unitPrice
      result.promoActive = false;
    }else if(currentDateString < validTillString){
      result.price = promoPrice
      result.promoActive = true;
    }

    return result
  }

  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Product</h4>
        <span className="breadcrumb-item ms-3"><a href="/products"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
        {userData?.staffCadre?.includes("admin") &&<a className="btn btn-link text-primary ms-auto" href={`/products/${id}/edit`}>Edit</a>}
      </header>


      <div className="row">
        <div className="col-12 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Product Details</h5>

              {data ?
                <>
                  <DataListItem title="Product Name" value={data.name} />
                  {userData?.staffCadre?.includes("admin") && <DataListItem title="Product Code" value={data.code} />}
                  <DataListItem title="Brand" value={data.brand.name} />
                  <DataListItem title="Price" value={formatAsCurrency(deriveProductStatus(data.price).price)} />
                  <DataListItem title="Description" value={data.description} />
                  <DataListItem title="Specifications" value={data.specifications} />
                  <DataListItem title="Vat Inclusive" value={data.vatInclusive ? "Yes" : "No"} />
                  <div className="mb-3 d-flex flex-column">
                    <h6 className="m-0 me-3">Product Images</h6>
                    <figure>
                      {listProductImages()}
                    </figure>
                  </div>
                  <DataListItem title="Created On" value={moment(data.createdAt).format('MMMM Do YYYY, h:mm:ss a')} />
                  <DataListItem title="Last Updated" value={moment(data.updatedAt).format('MMMM Do YYYY, h:mm:ss a')} />
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

export default ProductDetails
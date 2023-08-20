"use client"

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiService";
import { useParams } from 'next/navigation';
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';
import formatAsCurrency from "@/services/formatAsCurrency";

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

const PriceMasterDetails = () => {
  const params = useParams();
  const {id} = params;
  console.log(id);
  const dispatchMessage = useDispatchMessage();

  const {data, isFetching} = useQuery({
    queryKey: ["allProductPrices", id],
    queryFn: () => apiGet({ url: `/priceMaster/${id}`})
    .then(res =>{
      console.log(res.data)
      // dispatchMessage({ message: res.message})
      return res.data
    })
    .catch(error =>{
      console.log(error.message)
      dispatchMessage({ severity: "error", message: error.message})
    })
  }) 

  const deriveProductStatus = (unitPrice, promoPrice, validTill, anyPromo)=>{
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
        <h4 className="m-0">Price Master</h4>
        <span className="breadcrumb-item ms-3"><a href="/priceMaster"><i className="fa-solid fa-arrow-left me-1"></i> Back</a></span>
        <a className="btn btn-link text-primary ms-auto" href={`/priceMaster/${id}/edit`}>Edit</a>
      </header>


      <div className="row">
        <div className="col-12 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body p-4" style={{ maxWidth: "700px" }}>
              <h5 className="card-title fw-semibold mb-4 opacity-75">Product Price Details</h5>
              {data ?
                <>
                  <DataListItem title="Product" value={data.product.name} />
                  <DataListItem title="Brand" value={data.brand.name} />
                  <DataListItem title="Unit Price" value={formatAsCurrency(data.unitPrice)} />
                  <DataListItem title="Promo Price" value={data.promoPrice ? formatAsCurrency(data.promoPrice) : "---"} />
                  <DataListItem title="Any Promo" value={deriveProductStatus(data.unitPrice, data.promoPrice, data.validTill, data.anyPromo).promoActive ? "Yes" : "No"} />
                  <DataListItem title="Promo Text" value={data.promoText || "---"} />
                  <DataListItem title="Valid From" value={data.validFrom ? new Date(data.validFrom).toDateString() : "---"} />
                  <DataListItem title="Valid Till" value={data.validTill ? new Date(data.validTill).toDateString() : "---"} />
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

export default PriceMasterDetails
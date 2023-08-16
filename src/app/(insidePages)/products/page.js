"use client"

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiService";
import useDispatchMessage from "@/hooks/useDispatchMessage";
import Skeleton from '@mui/material/Skeleton';
import { useRouter } from "next/navigation";
import clipLongText from "@/services/clipLongText";
import formatAsCurrency from "@/services/formatAsCurrency";

const LoadingFallBack = () =>{
  return (
    <>
      <tr sx={{ width: "100%" }}>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
      </tr>
      <tr sx={{ width: "100%" }}>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
      </tr>
      <tr sx={{ width: "100%" }}>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
        <td><Skeleton height={50} animation="wave" /></td>
      </tr>
    </>
    
  );
}


const Products = () =>{  
  const dispatchMessage = useDispatchMessage();
  const router = useRouter();



  const {data, isFetching} = useQuery({
    queryKey: ["allProducts" ],
    queryFn:  ()=>apiGet({ url: "/product"})
    .then(res => {
      console.log(res)
      dispatchMessage({message: res.message})
      return res.data
    })
    .catch(error =>{
      console.log(error)
      dispatchMessage({severity: "error", message: error.message})
    })
  })

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

  const listProducts = () =>{
    return data.map( (item, index) => {
      const {id,images, name, code, brand, price} = item;
      return( 
        <tr key={id} className="hover"  onClick={(e)=>{
          e.stopPropagation()
          router.push(`/products/${id}`)
          }}>
          <td className="border-bottom-0 py-2"><h6 className="fw-semibold mb-0">{index + 1}</h6></td>
          <td className="border-bottom-0 py-2">
            <img src={images[0]} height={40} alt="Product Image" />
          </td>
          <td className="border-bottom-0 py-2">
            <h6 className="fw-semibold mb-1">{name}</h6>
          </td>
          <td className="border-bottom-0 py-2">
            <p className="mb-0 fw-normal">{code}</p>
          </td>
          <td className="border-bottom-0 py-2">
            <div className="d-flex align-items-center gap-2">
              <p className="fw-semibold m-0">{brand.name}</p>
            </div>
          </td>
          <td className="border-bottom-0 py-2">
            <p className="small mb-0 d-flex flex-wrap">{price ? formatAsCurrency(deriveProductStatus(price).price) : ""}</p>
          </td>
          <td className="border-bottom-0 py-2">
            <a className="btn btn-link text-primary ms-auto" href={`/products/${id}/edit`}>Edit</a>
          </td>
        </tr>
    )
    })
  }

  return (
    <div className="container-fluid">
      <header className="d-flex align-items-center mb-4">
        <h4 className="m-0">Product</h4>
        <a className="btn btn-link text-primary ms-auto" href="/products/add">Add</a>
      </header>

      <div className="row">
          <div className="col-12 d-flex align-items-stretch">
            <div className="card w-100">
              <div className="card-body p-4">
                <h5 className="card-title fw-semibold mb-4 opacity-75">All Products</h5>
                <div className="table-responsive">
                  <table className="table text-nowrap mb-0 align-middle">
                    <thead className="text-dark fs-4">
                      <tr>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">#</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Image</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Name</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Code</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Brand Name</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Price</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Actions</h6>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        {data ? listProducts() : <LoadingFallBack />}                 
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Products
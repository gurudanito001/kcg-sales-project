
"use client";

import LoginTemplate from "./login"
import { apiGet, apiPost } from "@/services/apiService";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import useDispatchMessage from '@/hooks/useDispatchMessage';
import {setUserData} from '@/store/slices/userDataSlice'

/* const Login = () =>{

  return (
    <LoginTemplate />
  )
}

export default Login */



import { useQuery } from "@tanstack/react-query";
import React from "react";



export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const dispatchMessage = useDispatchMessage();
  const {userData} = useSelector((state) => state.userData);

  useEffect(()=>{
    if(userData.token){
      router.push("/")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userData])

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (prop) => (event) => {
    setFormData(prevState => ({
      ...prevState,
      [prop]: event.target.value
    }))
  }

  const {mutate, isPending} = useMutation({
    mutationFn: ()=>{
      apiPost({ url: `/auth/login`, data: formData })
      .then(res => {
        console.log(res)
        dispatchMessage({message: res.message})
        localStorage.setItem("token", res.data.token);
        dispatch(setUserData(res.data));
      })
      .catch(error => {
        console.log(error)
        dispatchMessage({severity: "error", message: error.message})
      })
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData)
    mutate()
  }



  return (
    <LoginTemplate formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} isLoading={isPending} />
  );
}

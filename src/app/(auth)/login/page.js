
"use client";

import LoginTemplate from "./login"
import { apiGet, apiPost } from "@/services/apiService";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import useDispatchMessage from '@/hooks/useDispatchMessage';
import {setUserData} from '@/store/slices/userDataSlice';
import useGetUserData from "@/hooks/useGetUserData";
import React from "react";



export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const dispatchMessage = useDispatchMessage();
  const {userData, setToken} = useGetUserData();
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

  const {mutate, isLoading} = useMutation({
    mutationFn: ()=>{
      apiPost({ url: `/auth/login`, data: formData })
      .then(res => {
        console.log(res)
        dispatchMessage({message: res.message})
        setToken(res.data.token)
        /* localStorage.setItem("token", res.data.token);
        setTokenUpdated(true);
        dispatch(setUserData(res.data)); */
      })
      .catch(error => {
        console.log(error)
        dispatchMessage({severity: "error", message: error.message})
      })
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
    mutate()
  }



  return (
    <LoginTemplate formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} isLoading={isLoading} />
  );
}

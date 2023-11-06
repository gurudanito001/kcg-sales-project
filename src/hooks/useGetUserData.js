"use client"
import * as jwt from 'jsonwebtoken';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/services/apiService';
import {prohibitedRoutes, viewOnlyRoutes} from "@/utils/consts";


const useGetUserData = () => {
    const router = useRouter();
    const pathName = usePathname();
    const [userData, setUserData] = useState({
        id: "",
        email: "",
        staffCadre: [],
        firstName: "",
        lastName: "",
        accountType: "",
    })
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAllowed, setIsAllowed] = useState(false);
    const [tokenUpdated, setTokenUpdated] = useState("");


    /* const tokenQuery = useQuery({
        queryKey: ["token"],
        queryFn: () => apiGet({ url: `/auth/refreshUserData/${localStorage.getItem("token")}` })
            .then(res => {
                console.log(res)
                localStorage.setItem("token", res.data.token);
                return res.data.token
            })
            .catch(error => {
                console.log(error)
                return {}
            }),
    }) */

    const logout = ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("accountType");
        setTokenUpdated(new Date().getTime())
    }

    const switchAccountType = (accountType) => {
        localStorage.setItem("accountType", accountType);
        setTokenUpdated(new Date().getTime())
    }

    const setToken = (token)=>{
        localStorage.setItem("token", token);
        setTokenUpdated(new Date().getTime())
    }

    useEffect(() => {
        let token = localStorage.getItem('token')
        let data = jwt.decode(token)
        let accountType = localStorage.getItem("accountType");
        if(token){
            setIsLoggedIn(true)
        }
        if (data) {
            setUserData(prevState =>({
                ...prevState,
                ...data,
            }))
        }
        if(accountType){
            setUserData(prevState =>({
                ...prevState,
                accountType: accountType
            }))
        }
        let restrictedRoutes = prohibitedRoutes()[data?.staffCadre[0]]
        let viewOnly = viewOnlyRoutes()[data?.staffCadre[0]]
        console.log(viewOnly)
        if(restrictedRoutes){
            for (let i = 0; i < restrictedRoutes.length; i++) {
                if(pathName.includes(restrictedRoutes[i])){
                    setIsAllowed(false);
                    return router.push("/")
                }
                if(i === restrictedRoutes.length - 1){
                    setIsAllowed(true)
                }
            }
        }
        if(viewOnly){
            for (let i = 0; i < viewOnly.length; i++) {
                if(pathName.includes(viewOnly[i]) && (pathName.includes("add") || pathName.includes("edit"))){
                    setIsAllowed(false);
                    return router.push("/")
                }
                if(i === viewOnly.length - 1){
                    setIsAllowed(true)
                }
            }
        }
        
        if (data && pathName === "/login") {
            router.push("/")
        }
        if (!data && pathName !== ("/login" || "/forgotPassword" || "/resetPassword")) {
            return router.push("/login")
        }
        console.log(accountType)
        
    }, [tokenUpdated, router, pathName])

    return { isLoggedIn, isAllowed, userData, setTokenUpdated, logout, setToken, switchAccountType }
}

export default useGetUserData;
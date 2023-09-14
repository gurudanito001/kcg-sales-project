"use client"
import * as jwt from 'jsonwebtoken';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/services/apiService';


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
    const [tokenUpdated, setTokenUpdated] = useState(false);


    const tokenQuery = useQuery({
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
        refetchInterval: 3600000,
        refetchIntervalInBackground: true
    })

    const logout = ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("accountType");
        setTokenUpdated(true)
    }

    const switchAccountType = (accountType) => {
        localStorage.setItem("accountType", accountType);
    }

    const setToken = (token)=>{
        localStorage.setItem("token", token);
        setTokenUpdated(true)
    }

    useEffect(() => {
        let token = localStorage.getItem('token')
        let data = jwt.decode(token)
        let accountType = localStorage.getItem("accountType");
        console.log(userData)
        if (data) {
            setUserData(prevState =>({
                ...prevState,
                ...data,
            }))
        }
        if (data && pathName === "/login") {
            router.push("/")
        }
        if (!data && pathName !== ("/login" || "/forgotPassword" || "/resetPassword")) {
            return router.push("/login")
        }
        console.log(accountType)
        if(accountType){
            setUserData(prevState =>({
                ...prevState,
                accountType: accountType
            }))
        }
        
    }, [tokenUpdated])

    return { userData, setTokenUpdated, logout, setToken, switchAccountType }
}

export default useGetUserData;
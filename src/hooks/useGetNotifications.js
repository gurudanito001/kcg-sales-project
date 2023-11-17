import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/apiService";
import { getDecodedToken } from "@/services/localStorageService";


const useGetNotifications = () =>{
  const tokenData = getDecodedToken();
  const getQueryString = () =>{
    if(tokenData?.staffCadre[0] === "admin"){
      return "staffCadre=admin"
    }else{
      return `employeeId=${tokenData?.user_id}`
    }
  }
  
  const notificationQuery = useQuery({
    queryKey: ["allNotifications"],

    queryFn: () => apiGet({ url: `/notification?${getQueryString()}` })
      .then(res => {
        console.log(res)
        return res.data
      })
      .catch(error => {
        console.log(error)
        return []
      }),
      refetchInterval: 3000000,
      refetchIntervalInBackground: true
  })

  return {count: notificationQuery?.data?.length, data: notificationQuery?.data, refetch: notificationQuery.refetch}
}

export default useGetNotifications;
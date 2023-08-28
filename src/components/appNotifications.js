import { getDecodedToken } from "@/services/localStorageService";
import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/services/apiService";
import { useRouter } from "next/navigation";
import useGetNotifications from "@/hooks/useGetNotifications";
import { useMutation } from "@tanstack/react-query";


const styles = {
  notificationItem: {
    padding: "15px",
    borderRadius: "15px",
    background: "#767676b6",
  },
  notificationIcon: {
    fontSize: ".7rem", 
    position: "relative", 
    left: "-10px", 
    top: "-10px",
    height: "15px",
    width: "15px"
  }
}


const NotificationItem = ({ title, message, url, onClose }) => {
  const router = useRouter()
  return (
    <div style={styles.notificationItem} className="my-2 text-white" onClick={() => router.push(url)}>
      <div className="d-flex align-items-center">
        <h6 className="m-0">{title}</h6>
        <span className="ms-auto small fst-italic">1hr 30mins ago</span>
        <a className="ms-3 text-danger p-2 py-1 rounded-circle" onClick={onClose} ><i className="fa-solid fa-xmark"></i></a>
      </div>
      <p className="m-0">
        {message}
      </p>
    </div>
  )
}


const AppNotifications = () => {
  const tokenData = getDecodedToken();
  const {data, refetch} = useGetNotifications()

  /* const getNotificationQueryString = () =>{
    if(staffCadre.includes("admin")){
      return "staffCadre=admin"
    }else{
      return `employeeId=${user_id}`
    }
  } */
  /* const notificationQuery = useQuery({
    queryKey: ["allNotifications"],
    queryFn: () => apiGet({ url: `/notification` })
      .then(res => {
        console.log(res)
        return res.data
      })
      .catch(error => {
        console.log(error)
      })
  }) */

  const closeNotification = (notification) =>{
    let patchData = {viewed: true}
    
    if(notification.staffCadre === "salesPerson" && notification.receiverId === null){
      let viewedBy = [...notification.viewedBy, tokenData.user_id]
      patchData = {viewedBy}
    }
    //return console.log(patchData)
    apiPatch({ url: `/notification/${notification.id}`, data: patchData})
    .then( res => {
      console.log(res)
      refetch()
    })
    .catch( error =>{
      console.log(error)
    })
  }

  const listNotifications = () => {
    if (data) {
      return data.map(notification => {
        return <NotificationItem key={notification.id} message={notification.message} title={notification.title} url={notification.resourceUrl} onClose={(e)=>{
          e.stopPropagation()
          closeNotification(notification)
        }} />
      })
    }
  }

  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasExample22" aria-labelledby="offcanvasExampleLabel22">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasExampleLabel">Notifications</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        {listNotifications()}
      </div>
    </div>
  )
}


export default AppNotifications;
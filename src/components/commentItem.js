import { useSelector } from "react-redux";
import { getDecodedToken } from "@/services/localStorageService";



const styles = {
  item: {
    width: "clamp(250px, 75%, 500px)",
  }
}

const CommentItem = ({message, sender, date }) =>{
  const tokenData = getDecodedToken();
  const {userData} = useSelector( state => state.userData);
  return (
    <li style={styles.item} className={`${sender?.id === tokenData?.user_id ? "bg-primary ms-auto rounded-start rounded-top" : "bg-secondary me-auto rounded-end rounded-top"} p-3 text-white my-2`}>
      
      <span className="d-flex small">
        <span className="me-auto">{sender.firstName} {sender.lastName}</span>
        <span>{ new Date(date).toLocaleDateString()} {new Date(date).toLocaleTimeString()}</span>
      </span>
      {message}
    </li>
  )
}

export default CommentItem;
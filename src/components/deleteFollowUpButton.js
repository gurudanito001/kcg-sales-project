import ConfirmationModal from '@/components/confirmationModal';


const DeleteFollowUpButton = ({isLoading, deleteFunc}) =>{

  return (
    <>
      <button className="btn btn-link text-danger ms-auto"  data-bs-toggle="modal" data-bs-target="#followUpVisit">Delete</button>

      <ConfirmationModal title="Delete Follow Up Visit" message="Are you sure you want to delete this follow up visit?" isLoading={isLoading} onSubmit={deleteFunc} id="followUpVisit" />
    </>
  )
}

export default DeleteFollowUpButton;
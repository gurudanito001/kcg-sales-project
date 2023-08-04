

const ResetPasswordTemplate = () =>{

  return (
    <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
      data-sidebar-position="fixed" data-header-position="fixed">
      <div
        className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
        <div className="d-flex align-items-center justify-content-center w-100">
          <div className="row justify-content-center w-100">
            <div className="col-md-8 col-lg-6 col-xxl-3">
              <div className="card mb-0">
                <div className="card-body">
                  <h3 className="mb-5 text-center">Reset Password</h3>
                  <form>
                    <div className="mb-4">
                      <label htmlFor="exampleInputPassword1" className="form-label">New Password</label>
                      <input type="password" className="form-control" id="exampleInputPassword1" />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="exampleInputPassword1" className="form-label">Confirm Password</label>
                      <input type="password" className="form-control" id="exampleInputPassword1" />
                    </div>
                    <a href="./index.html" className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2">Reset Password</a>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordTemplate;


const LoginTemplate = ({handleChange, handleSubmit, formData, isLoading}) =>{

  return(
    <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
    data-sidebar-position="fixed" data-header-position="fixed">
    <div
      className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div className="d-flex align-items-center justify-content-center w-100">
        <div className="row justify-content-center w-100">
          <div className="col-md-8 col-lg-6 col-xxl-3">
            <div className="card mb-0">
              <div className="card-body">
                <h3 className="mb-5 text-center">Login</h3>
                <form>
                  <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" value={formData.email} onChange={handleChange("email")} aria-describedby="emailHelp" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control"  value={formData.password} onChange={handleChange("password")} id="exampleInputPassword1" />
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="form-check">
                      <input className="form-check-input primary" type="checkbox" value="" id="flexCheckChecked" />
                      <label className="form-check-label text-dark" htmlFor="flexCheckChecked">
                        Remeber Me
                      </label>
                    </div>
                    <a className="text-primary fw-bold" href="./index.html">Forgot Password ?</a>
                  </div>
                  <button className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2" disabled={isLoading} onClick={handleSubmit}>{isLoading ? "Loading..." : "Log In"}</button>
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

export default LoginTemplate
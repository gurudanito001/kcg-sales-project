/* eslint-disable @next/next/no-img-element */
"use client"
import { ReactNode, FC } from "react";
import AsideContent from "./asideContent";

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
      data-sidebar-position="fixed" data-header-position="fixed">

      <aside className="offcanvas offcanvas-start px-4" style={{maxWidth: "300px"}} tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <AsideContent />
      </aside>

      <aside className="left-sidebar">
        <AsideContent />
      </aside>

      <main className="body-wrapper">

        <header className="app-header">
          <nav className="navbar navbar-expand-lg navbar-light">
            <ul className="navbar-nav">
              <li className="nav-item d-block d-xl-none">
                <a className="nav-link sidebartoggler nav-icon-hover" id="headerCollapse"  data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
                  <i className="ti ti-menu-2"></i>
                </a>
              </li>
              
            </ul>
            <div className="navbar-collapse justify-content-end px-0" id="navbarNav">
              <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                <li className="nav-item">
                  <a className="nav-link nav-icon-hover" href="">
                    <i className="ti ti-bell-ringing"></i>
                    <div className="notification bg-primary rounded-circle"></div>
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link nav-icon-hover" href="" id="drop2" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <img src="/images/profile/user-1.jpg" alt="" width="35" height="35" className="rounded-circle" />
                  </a>
                  <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                    <div className="message-body">
                      <a href="" className="d-flex align-items-center gap-2 dropdown-item">
                        <i className="ti ti-user fs-6"></i>
                        <p className="mb-0 fs-3">My Profile</p>
                      </a>
                      <a href="" className="d-flex align-items-center gap-2 dropdown-item">
                        <i className="ti ti-mail fs-6"></i>
                        <p className="mb-0 fs-3">My Account</p>
                      </a>
                      <a href="" className="d-flex align-items-center gap-2 dropdown-item">
                        <i className="ti ti-list-check fs-6"></i>
                        <p className="mb-0 fs-3">My Task</p>
                      </a>
                      <a href="./authentication-login.html" className="btn btn-outline-primary mx-3 mt-2 d-block">Logout</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        {children}
      </main>

    </div>
  )
}


export default Layout
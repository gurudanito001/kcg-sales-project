"use client"

import Image from 'next/image'
import styles from './page.module.css'
import { useState, useEffect } from 'react'
import AppPieChart from "@/components/pieChart";


export default function Home() {

  /* const fetchDashboardData = (staffCadre, userId) =>{

  } */


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-8 d-flex align-items-strech">
          <div className="card w-100">
            <div className="card-body">
              <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                <div className="mb-3 mb-sm-0">
                  <h5 className="card-title fw-semibold">Customer Visits for Today</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="row">
            <div className="col-lg-12">
              <div className="card overflow-hidden">
                <div className="card-body p-4">
                  <h5 className="card-title mb-9 fw-semibold">Invoice Requests</h5>
                  <div className="row align-items-center">
                    <div className="col-8 d-flex align-items-end">
                      <h4 className="fw-semibold mb-0">3</h4>
                      <p className="fs-3 mb-0 ms-2">Pending Invoice Requests</p>
                      {/* <div className="d-flex align-items-center mb-3">
                        <span
                          className="me-1 rounded-circle bg-light-success round-20 d-flex align-items-center justify-content-center">
                          <i className="ti ti-arrow-up-left text-success"></i>
                        </span>
                        <p className="text-dark me-1 fs-3 mb-0">+9%</p>
                        <p className="fs-3 mb-0">last year</p>
                      </div> */}
                      {/* <div className="d-flex align-items-center">
                        <div className="me-4">
                          <span className="round-8 bg-primary rounded-circle me-2 d-inline-block"></span>
                          <span className="fs-2">2023</span>
                        </div>
                        <div>
                          <span className="round-8 bg-light-primary rounded-circle me-2 d-inline-block"></span>
                          <span className="fs-2">2023</span>
                        </div>
                      </div> */}
                    </div>
                    <div className="col-4">
                      <div className="d-flex justify-content-center">
                        <div id="breakup"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="row alig n-items-start">
                    <div className='col-12 mb-4'>
                      <div className='d-flex align-items-center'>
                        <h5 className="card-title fw-semibold me-auto mb-0"> Achievements </h5>
                        <div>
                          <select className="form-select">
                            <option value="1">March 2023</option>
                            <option value="2">April 2023</option>
                            <option value="3">May 2023</option>
                            <option value="4">June 2023</option>
                            <option value="4">July 2023</option>
                            <option value="4">August 2023</option>
                            <option value="4">September 2023</option>
                            <option value="4">October 2023</option>
                            <option value="4" selected>November 2023</option>
                            <option value="4">December 2023</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex flex-column pb-1">
                        <h6 className='text-start mb-1'>Month Target</h6>
                        <p className="fw-semibold fs-6 mb-3 text-start">20</p>

                        <h6 className='text-start mb-1'>Achievement</h6>
                        <p className="fw-semibold fs-6 mb-0 text-start">8</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex">
                          <AppPieChart />
                      </div>
                    </div>
                  </div>
                </div>
                <div id="earning"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

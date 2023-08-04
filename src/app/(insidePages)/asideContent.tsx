"use client"
import { usePathname } from "next/navigation";
import path from "path";


const SidebarListItem = ({ route, title, active, iconClass }: { route: string; title: string; active: boolean; iconClass: string }) => {
  
  return (
    <li className="sidebar-item my-1">
      <a className={`sidebar-link ${active && "active"} d-flex align-items-center`} href={`${route}`} aria-expanded="false">
        <span>
          <i className={`${iconClass}`}></i>
        </span>
        <span className="hide-menu">{title}</span>
      </a>
    </li>
  )
}

const AsideContent = () => {
  const pathname = usePathname();
  return (
    <nav className="sidebar-nav scroll-sidebar h-100" data-simplebar="">
      <div className="brand-logo d-flex align-items-center mb-4 p-0">
        <a href="./index.html" className="text-nowrap logo-img">
          <h4>KCG-Sales-Project</h4>
        </a>
        <div className="close-btn d-xl-none d-block sidebartoggler cursor-pointer ms-auto" id="sidebarCollapse" data-bs-dismiss="offcanvas" aria-label="Close">
          <i className="ti ti-x fs-8"></i>
        </div>
      </div>
      <ul id="sidebarnav">
        <SidebarListItem route="/" title="Dashboard" active={pathname === "/"} iconClass="fa-solid fa-chart-line" />
        <SidebarListItem route="/companies" title="Companies" active={pathname.includes("/companies")} iconClass="fa-regular fa-building" />
        <SidebarListItem route="/branches" title="Branches" active={pathname.includes("/branches")} iconClass="fa-solid fa-code-branch" />
        <SidebarListItem route="/brands" title="Brands" active={pathname.includes("/brands")} iconClass="fa-solid fa-trademark"/>
        <SidebarListItem route="/products" title="Products" active={pathname.includes("/products")} iconClass="fa-solid fa-car-rear" />
        <SidebarListItem route="/employees" title="Employees" active={pathname.includes("/employees")} iconClass="fa-solid fa-user" />
        <SidebarListItem route="/customers" title="Customers" active={pathname.includes("/customers")} iconClass="fa-solid fa-city" />
        <SidebarListItem route="/visits" title="Customer Visits" active={pathname.includes("/visits")} iconClass="fa-solid fa-calendar-days" />
        <SidebarListItem route="/pfiRequestForms" title="Pfi Request Form" active={pathname.includes("/pfiRequestForms")} iconClass="fa-solid fa-file-lines" />
        <SidebarListItem route="/invoiceRequestForms" title="Invoice Request Form" active={pathname.includes("/invoiceRequestForms")} iconClass="fa-solid fa-receipt" />
        <SidebarListItem route="/marketingActivities" title="Marketing Activities" active={pathname.includes("/marketingActivities")} iconClass="fa-solid fa-rocket" />
        <SidebarListItem route="/targetAchievements" title="Target & Achievements" active={pathname.includes("/targetAchievements")} iconClass="fa-solid fa-bullseye" />
      </ul>
    </nav>
  )
}

export default AsideContent;
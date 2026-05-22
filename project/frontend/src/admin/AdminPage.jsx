import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Tag, Package, ShoppingCart,
  Users, ArrowLeft, Menu, X, ShieldCheck, UserCircle,
} from "lucide-react";

import Dashboard    from "./sections/Dashboard";
import Categories   from "./sections/Categories";
import Products     from "./sections/Products";
import Orders       from "./sections/Orders";
import UsersSection from "./sections/Users";
import AdminProfile from "./sections/AdminProfile";

const NAV = [
  { id: "dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { id: "categories", label: "Categories", icon: Tag             },
  { id: "products",   label: "Products",   icon: Package         },
  { id: "orders",     label: "Orders",     icon: ShoppingCart    },
  { id: "users",      label: "Users",      icon: Users           },
  { id: "profile",    label: "Profile",    icon: UserCircle      },
];

const SECTION = {
  dashboard:  <Dashboard />,
  categories: <Categories />,
  products:   <Products />,
  orders:     <Orders />,
  users:      <UsersSection />,
  profile:    <AdminProfile />,
};

export default function AdminPage() {
  const [active,      setActive]      = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (id) => { setActive(id); setSidebarOpen(false); };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-white border-r border-[#E8E8E8] w-56">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#E8E8E8]">
        <ShieldCheck size={20} className="text-[#1A1A1A]" />
        <span className="font-bold text-[#1A1A1A]">Admin Panel</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 space-y-0.5 px-3">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => handleNav(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${active === id
                ? "bg-[#1A1A1A] text-white"
                : "text-[#717171] hover:bg-[#F6F6F6] hover:text-[#1A1A1A]"}`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      {/* Back to store */}
      <div className="px-5 py-4 border-t border-[#E8E8E8]">
        <Link to="/"
          className="flex items-center gap-2 text-sm text-[#717171] hover:text-[#1A1A1A] transition-colors font-medium">
          <ArrowLeft size={15} /> Back to Store
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#F6F6F6] overflow-hidden">

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full z-50 lg:hidden flex flex-col">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-[#E8E8E8] px-5 py-4 flex items-center gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[#717171] hover:text-[#1A1A1A] transition-colors">
            <Menu size={20} />
          </button>
          <h2 className="font-bold text-[#1A1A1A] capitalize">
            {NAV.find((n) => n.id === active)?.label}
          </h2>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {SECTION[active]}
        </main>
      </div>
    </div>
  );
}

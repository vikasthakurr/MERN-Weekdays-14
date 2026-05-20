import { NavLink } from "react-router-dom";
import { Home, Grid3x3, ShoppingBag, User } from "lucide-react";

const LINKS = [
  { to: "/",           label: "Home",       icon: Home,        end: true },
  { to: "/categories", label: "Categories", icon: Grid3x3 },
  { to: "/cart",       label: "Shopping",   icon: ShoppingBag },
  { to: "/profile",    label: "Account",    icon: User },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E8E8] lg:hidden shadow-lg">
      <div className="grid grid-cols-4 h-14">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 text-[9px] font-semibold uppercase tracking-wide transition-colors
               ${isActive ? "text-[#1A1A1A]" : "text-[#717171]"}`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;

import { Link, useLocation } from "react-router";
import { motion } from "motion/react";
import {
  Github,
  MessageSquare,
  Target,
  LayoutGrid,
  Settings,
  LogOut,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUserProfile, profileInitials } from "../userProfileContext";

const integrationNav = [
  { path: "/github", label: "GitHub", icon: Github },
  { path: "/slack", label: "Slack", icon: MessageSquare },
  { path: "/linear", label: "Linear", icon: Target },
];

export function Navigation() {
  const location = useLocation();
  // Remount on route change so local menu state resets without setState in an effect.
  return <NavigationBar key={location.pathname} />;
}

function NavigationBar() {
  const location = useLocation();
  const { profile, signOut } = useUserProfile();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const avatarInitials = useMemo(
    () => profileInitials(profile.fullName),
    [profile.fullName],
  );

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (e: MouseEvent | PointerEvent) => {
      const el = menuRef.current;
      if (el && !el.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const links = [
    { path: "/", label: "Garden", icon: LayoutGrid },
    ...integrationNav,
  ];

  return (
    <nav className="border-b" style={{ borderColor: "var(--zen-sand)" }}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: "var(--zen-sage)" }}
            />
            <span
              className="text-xl"
              style={{ color: "var(--zen-charcoal)", fontWeight: 300 }}
            >
              WDYGD
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-6 py-2 rounded-full transition-all duration-200 flex items-center gap-2"
                  style={{
                    color: isActive ? "white" : "var(--zen-charcoal-light)",
                    backgroundColor: isActive
                      ? "var(--zen-sage)"
                      : "transparent",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full -z-10"
                      style={{ backgroundColor: "var(--zen-sage)" }}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User menu */}
          <div className="relative flex items-center" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label="Account menu"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:ring-2 hover:ring-offset-2 hover:ring-[var(--zen-sage)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--zen-sage)]"
              style={{
                backgroundColor: "var(--zen-sage)",
              }}
            >
              <span className="text-white text-sm">{avatarInitials}</span>
            </button>

            {menuOpen && (
              <motion.div
                role="menu"
                aria-orientation="vertical"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 min-w-[13.5rem] py-1.5 rounded-2xl shadow-lg z-50 border"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--zen-sand)",
                }}
              >
                <Link
                  role="menuitem"
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--zen-off-white)]"
                  style={{ color: "var(--zen-charcoal)" }}
                >
                  <Settings className="w-4 h-4 shrink-0 opacity-70" />
                  Profile settings
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-[var(--zen-off-white)]"
                  style={{ color: "#c45c5c" }}
                >
                  <LogOut className="w-4 h-4 shrink-0 opacity-90" />
                  Log out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

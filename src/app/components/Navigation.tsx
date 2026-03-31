import { Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { Github, MessageSquare, Target, LayoutGrid } from "lucide-react";

export function Navigation() {
  const location = useLocation();

  const links = [
    { path: "/", label: "Garden", icon: LayoutGrid },
    { path: "/github", label: "GitHub", icon: Github },
    { path: "/slack", label: "Slack", icon: MessageSquare },
    { path: "/linear", label: "Linear", icon: Target },
  ];

  return (
    <nav className="border-b" style={{ borderColor: 'var(--zen-sand)' }}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--zen-sage)' }} />
            <span className="text-xl" style={{ color: 'var(--zen-charcoal)', fontWeight: 300 }}>
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
                    color: isActive ? 'white' : 'var(--zen-charcoal-light)',
                    backgroundColor: isActive ? 'var(--zen-sage)' : 'transparent',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full -z-10"
                      style={{ backgroundColor: 'var(--zen-sage)' }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Avatar - Link to Profile */}
          <Link 
            to="/profile"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:ring-2 hover:ring-offset-2"
            style={{ 
              backgroundColor: 'var(--zen-sage)',
              ringColor: 'var(--zen-sage)'
            }}
          >
            <span className="text-white text-sm">JD</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
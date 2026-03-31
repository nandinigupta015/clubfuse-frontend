import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Users,
  Calendar,
  Trophy,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import Toast from "./Toast";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const roleId = localStorage.getItem("role_id");
  const isCoordinator = roleId === "2";

  const {
    notifications,
    unreadCount,
    markAllRead,
    currentToast,
    clearToast
  } = useNotifications();

  // Pulse animation for the bell icon when unread count increases
  const [shouldPulse, setShouldPulse] = useState(false);
  const prevUnreadCount = useRef(unreadCount);

  useEffect(() => {
    if (unreadCount > prevUnreadCount.current) {
      setShouldPulse(true);
      const timer = setTimeout(() => setShouldPulse(false), 1000);
      return () => clearTimeout(timer);
    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  // Close bell dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const publicLinks = [
    { path: "/", label: "Home" },
    { path: "/clubs", label: "Clubs" },
    { path: "/events", label: "Events" },
  ];

  const dashboardLinks = isCoordinator
    ? [
        { path: "/dashboard", label: "Dashboard", icon: Users },
        { path: "/events", label: "My Events", icon: Calendar },
      ]
    : [
        { path: "/dashboard", label: "Dashboard", icon: Users },
        { path: "/events", label: "My Events", icon: Calendar },
        { path: "/achievements", label: "Achievements", icon: Trophy },
      ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const handleBellClick = () => {
    setBellOpen((prev) => !prev);
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
  };

  const formatTime = (timeStr: string) => {
    const d = new Date(timeStr);
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-purple-600">ClubFuse</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                {publicLinks.map((l) => (
                  <Link
                    key={l.path}
                    to={l.path}
                    className="relative px-1 py-1 text-sm font-medium transition-colors"
                  >
                    <span className={isActive(l.path) ? "text-purple-600" : "text-gray-600 hover:text-purple-600"}>
                      {l.label}
                    </span>
                    {isActive(l.path) && (
                      <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                    )}
                  </Link>
                ))}
                <Link to="/login" className="px-4 py-2 border rounded text-sm">
                  Login
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-purple-600 text-white rounded text-sm"
                >
                  Join Now
                </Link>
              </>
            ) : (
              <>
                {dashboardLinks.map((l) => (
                  <Link
                    key={l.path}
                    to={l.path}
                    className="relative flex items-center gap-1.5 px-1 py-1 text-sm font-medium transition-colors"
                  >
                    <l.icon className={`w-4 h-4 ${isActive(l.path) ? "text-purple-600" : "text-gray-400"}`} />
                    <span className={isActive(l.path) ? "text-purple-600" : "text-gray-600 hover:text-purple-600"}>
                      {l.label}
                    </span>
                    {isActive(l.path) && (
                      <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                    )}
                  </Link>
                ))}

                {/* 🔔 BELL ICON */}
                <div className="relative" ref={bellRef}>
                  <button
                    onClick={handleBellClick}
                    className="relative text-gray-500 hover:text-purple-600 transition p-2 rounded-full hover:bg-gray-50"
                    title="Notifications"
                  >
                    <div className={shouldPulse ? "animate-pulse" : ""}>
                      <Bell className="w-5 h-5" />
                    </div>

                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                  </button>

                  {/* DROPDOWN */}
                    {bellOpen && (
                      <div className="absolute right-0 mt-3 w-85 bg-white/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/5">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                          <span className="text-sm font-semibold text-gray-700">
                            Notifications
                            {unreadCount > 0 && (
                              <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                                {unreadCount} new
                              </span>
                            )}
                          </span>
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllRead}
                              className="text-xs text-purple-600 hover:underline"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>

                        {/* Notification List */}
                        <div className="max-h-80 overflow-y-auto divide-y">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-400 text-sm">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                className={`px-4 py-3 text-sm flex gap-3 items-start transition ${n.read_status === "unread"
                                  ? "bg-purple-50"
                                  : "bg-white"
                                  }`}
                              >
                                <div
                                  className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.read_status === "unread"
                                    ? "bg-purple-500"
                                    : "bg-gray-300"
                                    }`}
                                />
                                <div className="flex-1">
                                  <p className="text-gray-800 leading-snug">
                                    {n.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatTime(n.sent_time)}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-500"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t bg-white px-6 py-4 space-y-2">
            {(isAuthenticated ? dashboardLinks : publicLinks).map((l) => (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-gray-700 hover:text-purple-600"
              >
                {l.label}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                {unreadCount > 0 && (
                  <div className="py-2 text-sm text-purple-600 font-medium">
                    🔔 {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 py-2 text-sm text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* 🚀 TOAST POPUP */}
      <Toast
        message={currentToast || ""}
        isVisible={!!currentToast}
        onClose={clearToast}
      />
    </>
  );
}


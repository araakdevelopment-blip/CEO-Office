import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROLE_LABELS } from "../lib/api";
import {
  LayoutDashboard, FolderKanban, ListChecks, BarChart3, Users,
  Shield, LogOut, ChevronLeft, Calendar, Video, FileArchive,
  Mic, MessageSquare, Bell, Settings, CalendarClock, FileText,
} from "lucide-react";

import ARAK_LOGO from "../assets/Araak_logo1.png";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "لوحة المتابعة", testId: "nav-dashboard" },
  { to: "/daily-report", icon: FileText, label: "الموجز اليومي", testId: "nav-daily-report" },
  { to: "/projects", icon: FolderKanban, label: "المشاريع", testId: "nav-projects" },
  { to: "/tasks", icon: ListChecks, label: "إدارة المهام", testId: "nav-tasks" },
  { to: "/calendar", icon: Calendar, label: "التقويم", testId: "nav-calendar" },
  { to: "/meetings", icon: Video, label: "الاجتماعات", testId: "nav-meetings" },
  { to: "/meeting-requests", icon: CalendarClock, label: "جدولة اللقاءات", testId: "nav-meeting-requests" },
  { to: "/documents", icon: FileArchive, label: "مركز الوثائق", testId: "nav-documents" },
  { to: "/messages", icon: MessageSquare, label: "مركز الرسائل", testId: "nav-messages" },
  { to: "/voice", icon: Mic, label: "الوكيل الصوتي", testId: "nav-voice", roles: ["ceo", "admin"] },
  { to: "/reports", icon: BarChart3, label: "التقارير", testId: "nav-reports" },
  { to: "/team", icon: Users, label: "فريق العمل", testId: "nav-team" },
  { to: "/notifications", icon: Bell, label: "الإشعارات", testId: "nav-notifications" },
  { to: "/settings", icon: Settings, label: "الإعدادات", testId: "nav-settings" },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Sidebar (right-side in RTL) */}
      <aside className="w-72 fixed right-0 top-0 h-screen border-l border-white/5 bg-[#0b0f18]/90 backdrop-blur-xl flex flex-col z-30">
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center justify-center bg-black/40 rounded-lg p-3 border border-white/5">
            <img src={ARAK_LOGO} alt="مجموعة اراك للتنمية" className="h-14 w-auto object-contain" />
          </div>
          <div className="mt-3 text-center text-[10px] uppercase tracking-[0.25em] text-slate-500">
            Executive Platform
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV.filter(n => !n.roles || n.roles.includes(user?.role)).map(({ to, icon: Icon, label, testId }) => (
            <NavLink
              key={to}
              to={to}
              data-testid={testId}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 shadow-inner"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100 border border-transparent"
                }`
              }
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
            </NavLink>
          ))}
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              data-testid="nav-admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100 border border-transparent"
                }`
              }
            >
              <Shield size={18} />
              <span className="flex-1">الإدارة</span>
            </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="glass-card p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 border border-yellow-500/30 flex items-center justify-center text-yellow-300 font-bold tabular-nums">
              {user?.name?.[0] || "؟"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-100 truncate">{user?.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{ROLE_LABELS[user?.role]}</div>
            </div>
            <button
              data-testid="logout-btn"
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-rose-500/10 text-slate-400 hover:text-rose-300 transition-colors"
              title="تسجيل خروج"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 pr-72 min-h-screen">
        <div className="px-8 py-6 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

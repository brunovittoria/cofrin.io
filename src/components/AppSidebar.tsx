import { BarChart3, TrendingUp, TrendingDown, Tag, CreditCard, PlusCircle, CheckSquare } from "lucide-react";
import { matchPath, NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Entradas", url: "/entradas", icon: TrendingUp },
  { title: "Saídas", url: "/saidas", icon: TrendingDown },
  { title: "Categorias", url: "/categorias", icon: Tag },
  { title: "Cartões", url: "/cartoes", icon: CreditCard },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-[#E2E8F0] bg-[#F3F6FB]">
      <SidebarContent className="flex h-full flex-col px-4 py-6">
        <div className="flex flex-col items-center gap-5">
          <img
            src="assets/cofrinio-logo.png"
            alt="Cofrinio"
            className="h-20 w-auto"
          />
          <div className="h-[1.5px] w-full max-w-[220px] rounded-full bg-[#C2CCE4] shadow-[0_1px_0_rgba(255,255,255,0.7)]" />
        </div>

        <SidebarGroup className="mt-6 flex-1">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navItems.map((item) => {
                const isActive = !!matchPath(
                  { path: item.url, end: item.url === "/" },
                  location.pathname,
                );

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-2xl border border-transparent bg-white px-3.5 py-3 text-sm font-medium text-[#475569] shadow-[0_8px_24px_-20px_rgba(15,23,42,0.3)] transition-all",
                        "hover:-translate-y-[2px] hover:border-[#D7DEED] hover:bg-white hover:text-[#0F172A]",
                        isActive &&
                          "border-[#C7D2FE] bg-[#EEF2FF] text-[#0A64F5] shadow-[0_12px_28px_-18px_rgba(10,132,255,0.35)]",
                      )}
                    >
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="flex w-full items-center gap-3"
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-xl bg-[#E2E8F0] text-[#64748B] transition-colors",
                            "group-hover:bg-[#DBEAFE] group-hover:text-[#0A64F5]",
                            isCollapsed && "h-8 w-8",
                            isActive && "bg-[#DBEAFE] text-[#0A64F5]",
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                        </span>
                        {!isCollapsed && <span className="truncate">{item.title}</span>}
                        <span
                          className={cn(
                            "pointer-events-none absolute bottom-1 left-4 right-4 block h-[2px] origin-left scale-x-0 rounded-full bg-[linear-gradient(90deg,rgba(10,100,245,0),rgba(10,100,245,0.8),rgba(10,100,245,0))] opacity-0 transition-transform transition-opacity duration-300 ease-out",
                            "group-hover:scale-x-100 group-hover:opacity-100",
                            isCollapsed && "hidden",
                            isActive && "scale-x-100 opacity-100",
                          )}
                        />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-10 space-y-4">
          <NavLink
            to="/entradas"
            className={cn(
              "group flex items-center gap-3 rounded-2xl border border-[#D7DEED] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] shadow-[0_8px_24px_-18px_rgba(15,23,42,0.22)] transition-all",
              "hover:-translate-y-[2px] hover:border-[#C7D2FE] hover:bg-[#EEF2FF] hover:text-[#0A64F5]"
            )}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#0A64F5]">
              <PlusCircle className="h-4 w-4" />
            </span>
            {!isCollapsed && <span>Nova transação</span>}
          </NavLink>

          <div className="rounded-2xl border border-[#D7DEED] bg-white px-4 py-3 text-sm shadow-[0_8px_24px_-20px_rgba(15,23,42,0.22)]">
            {!isCollapsed ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-[#94A3B8]">
                  <span>Status</span>
                  <span>Operacional</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#16A34A] shadow-[0_0_0_4px_rgba(22,163,74,0.18)]" />
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">100% uptime</p>
                    <p className="text-xs text-[#64748B]">Último check às 09:24</p>
                  </div>
                </div>
              </div>
            ) : (
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#16A34A] shadow-[0_0_0_4px_rgba(22,163,74,0.18)]" />
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}



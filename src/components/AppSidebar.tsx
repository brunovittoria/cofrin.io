import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Tag,
  CreditCard,
  PlusCircle,
  CalendarClock,
  Moon,
  Sun,
  ArrowLeftRight,
} from "lucide-react";
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
import { useTheme } from "@/providers/ThemeProvider";
import { Switch } from "@/components/ui/switch";

const navItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Transações", url: "/transacoes", icon: ArrowLeftRight },
  { title: "Entradas", url: "/entradas", icon: TrendingUp },
  { title: "Saídas", url: "/saidas", icon: TrendingDown },
  { title: "Categorias", url: "/categorias", icon: Tag },
  { title: "Futuros", url: "/futuros", icon: CalendarClock },
  { title: "Cartões", url: "/cartoes", icon: CreditCard },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  const { theme, toggleTheme } = useTheme();

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarContent className="flex h-full flex-col px-4 py-6">
        <div className="flex flex-col items-center gap-5">
          <img
            src="assets/cofrinio-logo.png"
            alt="Cofrinio"
            className="h-20 w-auto"
          />
          <div className="h-[1.5px] w-full max-w-[220px] rounded-full bg-border" />
        </div>

        <SidebarGroup className="mt-6 flex-1">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navItems.map((item) => {
                const isActive = !!matchPath(
                  { path: item.url, end: item.url === "/" },
                  location.pathname
                );

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-2xl border border-transparent bg-card px-3.5 py-3 text-sm font-medium text-muted-foreground shadow-[0_8px_24px_-20px_rgba(15,23,42,0.3)] transition-all",
                        "hover:-translate-y-[2px] hover:border-border hover:bg-card hover:text-foreground",
                        isActive &&
                          "border-primary/30 bg-accent text-primary shadow-[0_12px_28px_-18px_rgba(10,132,255,0.35)]"
                      )}
                    >
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="flex w-full items-center gap-3"
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors",
                            "group-hover:bg-accent group-hover:text-primary",
                            isCollapsed && "h-8 w-8",
                            isActive && "bg-accent text-primary"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                        </span>
                        {!isCollapsed && (
                          <span className="truncate">{item.title}</span>
                        )}
                        <span
                          className={cn(
                            "pointer-events-none absolute bottom-1 left-4 right-4 block h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-all duration-300 ease-out",
                            "group-hover:scale-x-100 group-hover:opacity-100",
                            isCollapsed && "hidden",
                            isActive && "scale-x-100 opacity-100"
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
          <div className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-[0_8px_24px_-18px_rgba(15,23,42,0.22)] transition-all">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-foreground transition-colors">
                {theme === "light" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </span>
              {!isCollapsed && (
                <span>{theme === "light" ? "Modo Claro" : "Modo Escuro"}</span>
              )}
            </div>
            {!isCollapsed && (
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-primary"
              />
            )}
          </div>

          <NavLink
            to="/transacoes"
            className={cn(
              "group flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-[0_8px_24px_-18px_rgba(15,23,42,0.22)] transition-all",
              "hover:-translate-y-[2px] hover:border-primary/30 hover:bg-accent hover:text-primary"
            )}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-primary">
              <PlusCircle className="h-4 w-4" />
            </span>
            {!isCollapsed && <span>Nova transação</span>}
          </NavLink>

          <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-[0_8px_24px_-20px_rgba(15,23,42,0.22)]">
            {!isCollapsed ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  <span>Status</span>
                  <span>Operacional</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-success shadow-[0_0_0_4px_rgba(22,163,74,0.18)]" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      100% uptime
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Último check às 09:24
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <span className="flex h-2.5 w-2.5 rounded-full bg-success shadow-[0_0_0_4px_rgba(22,163,74,0.18)]" />
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

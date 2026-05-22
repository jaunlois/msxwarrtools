import {
  Gauge,
  Shield,
  ShieldCheck,
  Clock,
  AlertTriangle,
  FileText,
  FileSpreadsheet,
  BarChart3,
  Wrench,
  Car,
  Brain,
  Bot,
  Sparkles,
  Upload,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: Gauge },
  { title: "SLT Lookup", url: "/slt", icon: Clock },
  { title: "Bulk SLT Import", url: "/slt/import", icon: Upload },
  { title: "Parts Coverage", url: "/parts", icon: Shield },
  { title: "Factory Warranty", url: "/factory-warranty", icon: ShieldCheck },
  { title: "Overlap Checker", url: "/overlaps", icon: AlertTriangle },
  { title: "Scheduled Maintenance", url: "/maintenance", icon: Wrench },
  { title: "CCC Codes", url: "/ccc", icon: FileText },
  { title: "Claim Processor", url: "/cor", icon: FileSpreadsheet },
  { title: "Claim Library", url: "/claim-library", icon: Brain },
  { title: "Warranty Consultant", url: "/consultant", icon: Bot },
  { title: "Qwen Chat", url: "/qwen", icon: Sparkles },
  { title: "Weekly Report", url: "/report", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary shrink-0" />
          {!collapsed && (
            <div>
              <h2 className="text-sm font-bold text-foreground tracking-tight">
                Ford Service Tool
              </h2>
              <p className="text-[10px] text-muted-foreground">
                Warranty & SLT Reference
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-medium border-l-2 border-primary"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border px-4 py-2">
        {!collapsed && (
          <p className="text-[10px] text-muted-foreground">
            2022 U704A Everest
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

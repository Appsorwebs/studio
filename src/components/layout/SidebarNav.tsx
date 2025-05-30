
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Search,
  Gift,
  MessageSquare,
  Cpu,
  Users,
  Settings,
  Info,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { 
    label: "Inventory", 
    icon: Package,
    subItems: [
      { href: "/inventory", label: "Manage Drugs", icon: Package },
      { href: "/inventory/add", label: "Add New Drug", icon: PlusCircle },
    ]
  },
  { href: "/predict", label: "Predict Expiration", icon: Cpu },
  { href: "/search", label: "Search Drugs", icon: Search },
  { href: "/donations", label: "Drug Donations", icon: Gift },
  { href: "/contact", label: "Contact Us", icon: MessageSquare },
];

const moreItems = [
  { href: "/profile", label: "Profile", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/about", label: "About RxAlert", icon: Info },
];


export function SidebarNav() {
  const pathname = usePathname();

  const renderNavItem = (item: any, isSubItem = false) => {
    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + (item.href.endsWith('/') ? '' : '/')));
    
    if (isSubItem) {
      return (
        <SidebarMenuSubItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuSubButton isActive={isActive} className="gap-2">
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.label}</span>
            </SidebarMenuSubButton>
          </Link>
        </SidebarMenuSubItem>
      );
    }

    return (
      <SidebarMenuItem key={item.href || item.label}>
        <Link href={item.href!} passHref legacyBehavior>
          <SidebarMenuButton isActive={isActive} tooltip={item.label} className="gap-2">
            {item.icon && <item.icon />}
            <span>{item.label}</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    );
  };
  
  return (
    <nav className="flex flex-col h-full">
      <SidebarMenu className="flex-1">
        {navItems.map((item) =>
          item.subItems ? (
            <Accordion type="single" collapsible className="w-full" key={item.label}>
              <AccordionItem value={item.label} className="border-none">
                <SidebarMenuItem className="p-0">
                   <AccordionTrigger 
                    className={cn(
                      "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg:first-child]:size-4 [&>svg:first-child]:shrink-0 [&>svg.lucide-chevron-down]:ml-auto",
                      item.subItems.some(sub => pathname.startsWith(sub.href)) && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    )}
                  >
                    <item.icon />
                    <span className="flex-1 text-left">{item.label}</span>
                  </AccordionTrigger>
                </SidebarMenuItem>
                <AccordionContent className="pb-0">
                  <SidebarMenuSub className="ml-3.5 mt-0">
                    {item.subItems.map(subItem => renderNavItem(subItem, true))}
                  </SidebarMenuSub>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            renderNavItem(item)
          )
        )}
      </SidebarMenu>
      
      <SidebarMenu className="mt-auto">
         <SidebarMenuItem>
          <span className="p-2 text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">More</span>
        </SidebarMenuItem>
        {moreItems.map((item) => renderNavItem(item))}
      </SidebarMenu>
    </nav>
  );
}

import React from 'react';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Package, ShoppingCart, Users } from 'lucide-react';

// Mục menu chính
const mainNavItems: { key: 'orders' | 'products' | 'customers'; title: string; icon: any }[] = [
    { key: 'orders', title: 'Thông tin đơn hàng', icon: Package },
    { key: 'products', title: 'Quản lý sản phẩm', icon: ShoppingCart },
    { key: 'customers', title: 'Quản lý khách hàng', icon: Users },
];

export function AppSidebar({ selectedMenu, onMenuSelect }: { selectedMenu: 'orders' | 'products' | 'customers'; onMenuSelect: (menu: 'orders' | 'products' | 'customers') => void }) {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6">
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 transition">
                            <span className="sr-only">Toggle Sidebar</span>
                        </button>
                    </div>
                </header>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu className="mt-4 space-y-2">
                    {mainNavItems.map((item) => (
                        <SidebarMenuItem key={item.key}>
                            <SidebarMenuButton
                                onClick={() => onMenuSelect(item.key)}
                                className={selectedMenu === item.key ? "bg-gray-200 font-bold" : ""}
                            >
                                <item.icon className="w-5 h-5 mr-2" />
                                {item.title}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter className="mt-auto" items={[]} />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

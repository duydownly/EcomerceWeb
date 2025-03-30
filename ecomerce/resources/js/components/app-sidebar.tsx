import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, List, Home } from 'lucide-react';
import AppLogo from './app-logo';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Mục menu chính
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Home',
        href: '/',
        icon: Home, // Dùng icon Home
    },
];

// Mục menu footer
const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar({ onCategorySelect }: { onCategorySelect: (category: string | null) => void }) {
    const [categories, setCategories] = useState<Record<string, string>>({});

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await axios.get('/categories', {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });
                if (response.data.status === 'success') {
                    const categoryMap = response.data.data.reduce((acc: Record<string, string>, category: any) => {
                        acc[category.id] = category.name;
                        return acc;
                    }, {});
                    setCategories(categoryMap);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        }
        fetchCategories();
    }, []);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
                    <div className="flex items-center gap-2">
                        <button
                            data-slot="sidebar-trigger"
                            className="inline-flex items-center justify-center gap-2 ..."
                            data-sidebar="trigger"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-panel-left"
                            >
                                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                                <path d="M9 3v18"></path>
                            </svg>
                            <span className="sr-only">Toggssse Sidebar</span>
                        </button>
                    </div>
                </header>
            </SidebarHeader>

            <SidebarContent>
                {/* Menu Chính */}
                <SidebarMenu>
                    {mainNavItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild>
                                <Link href={item.href}>
                                    {item.icon && <item.icon className="w-5 h-5 mr-2" />}
                                    {item.title}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>

                {/* Danh mục sản phẩm */}
                <SidebarMenu className="mt-4">
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => onCategorySelect(null)}>
                            <LayoutGrid className="w-5 h-5 mr-2" />
                            Toàn bộ sản phẩm
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {Object.entries(categories).map(([key, value]) => (
                        <SidebarMenuItem key={key}>
                            <SidebarMenuButton onClick={() => onCategorySelect(key)}>
                                <List className="w-5 h-5 mr-2" />
                                {value}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import React, { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { MainContent } from '@/pages/main-content';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function App() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    return (
        <div className="flex hscreen">
            <AppSidebar 
                selectedMenu={null} 
                onMenuSelect={(menu) => console.log(menu)} 
                onCategorySelect={setSelectedCategory} 
            />
            <MainContent selectedCategory={selectedCategory} />
        </div>
    );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

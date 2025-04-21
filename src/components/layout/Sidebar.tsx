
import React from 'react';
import { Calendar, Clock, User, FileText, MessageSquare, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Calendar },
  { id: 'appointments', label: 'Appointments', icon: Clock },
  { id: 'doctors', label: 'Doctors', icon: User },
  { id: 'pathology', label: 'Pathology Results', icon: FileText },
  { id: 'chats', label: 'Chats', icon: MessageSquare, badge: 2 },
];

const accountTabs = [
  { id: 'settings', label: 'Settings', icon: Settings }
];

interface SidebarProps {
  selectedTab: string;
  onSelectTab: (tabId: string) => void;
}

const Sidebar = ({ selectedTab, onSelectTab }: SidebarProps) => {
  return (
    <div className="h-screen bg-sidebar w-64 p-4 flex flex-col border-r border-sidebar-border">
      <div className="flex items-center mb-10 mt-2">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-white font-bold">H</span>
        </div>
        <h1 className="text-xl font-bold ml-2 text-foreground">HealthSync</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={cn(
                  "flex items-center w-full p-3 rounded-md group",
                  selectedTab === tab.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
                aria-current={selectedTab === tab.id ? 'page' : undefined}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <h3 className="text-xs uppercase text-sidebar-foreground/60 font-semibold tracking-wider mb-2 px-3">
            Account
          </h3>
          <ul className="space-y-2">
            {accountTabs.map((tab) => (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  className={cn(
                    "flex items-center w-full p-3 rounded-md group",
                    selectedTab === tab.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                  aria-current={selectedTab === tab.id ? 'page' : undefined}
                >
                  <tab.icon className="mr-3 h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mt-auto mb-2 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
        <div className="flex items-center">
          <div className="rounded-full bg-red-500 p-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
              <path d="M6 12v-3a6 6 0 1 1 12 0v3"></path>
              <path d="M12 17l0 .01"></path>
              <path d="M3 21h18"></path>
              <path d="M14.996 17.5a1 1 0 1 0 -1.992 0a1 1 0 0 0 1.992 0z" stroke="none" fill="currentColor"></path>
              <path d="M9.996 17.5a1 1 0 1 0 -1.992 0a1 1 0 0 0 1.992 0z" stroke="none" fill="currentColor"></path>
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-red-800 dark:text-red-300">Emergency Hotlines:</p>
            <p className="text-xs text-red-700 dark:text-red-400">+1234 567 890 • +098 765 4321</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

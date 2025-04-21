
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const Layout = ({ children, selectedTab, setSelectedTab }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

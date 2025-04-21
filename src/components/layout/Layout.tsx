import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const AnimatedMain = ({ children, selectedTab }: { children: React.ReactNode; selectedTab: string }) => {
  return (
    <div
      key={selectedTab}
      className="flex-1 overflow-auto p-4 animate-fade-in"
      style={{ minHeight: "100%" }}
    >
      {children}
    </div>
  );
};

const Layout = ({ children, selectedTab, setSelectedTab }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden animate-fade-in">
      <Sidebar selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <AnimatedMain selectedTab={selectedTab}>
          {children}
        </AnimatedMain>
      </div>
    </div>
  );
};

export default Layout;

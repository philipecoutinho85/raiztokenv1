"use client";
import { createContext, useContext, useState } from "react";

// ✅ CONTEXTO DO SIDEBAR
const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);

// ✅ COMPONENTES VISUAIS DO SIDEBAR
export const Sidebar = ({ children }) => (
  <aside className="sidebar">{children}</aside>
);

export const SidebarHeader = ({ children }) => (
  <div className="sidebar-header">{children}</div>
);

export const SidebarContent = ({ children }) => (
  <div className="sidebar-content">{children}</div>
);

export const SidebarMenu = ({ children }) => (
  <ul className="sidebar-menu">{children}</ul>
);

export const SidebarMenuItem = ({ children }) => (
  <li className="sidebar-menu-item">{children}</li>
);

export const SidebarMenuButton = ({ children, asChild }) => (
  <button className="sidebar-menu-button">{children}</button>
);

export const SidebarGroup = ({ children }) => (
  <div className="sidebar-group">{children}</div>
);

export const SidebarGroupLabel = ({ children }) => (
  <div className="sidebar-group-label">{children}</div>
);

export const SidebarGroupContent = ({ children }) => (
  <div className="sidebar-group-content">{children}</div>
);

export const SidebarFooter = ({ children }) => (
  <div className="sidebar-footer">{children}</div>
);

// ✅ EXPORTAÇÃO ÚNICA, SEM CONFLITO
export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarProvider,
  useSidebar,
};

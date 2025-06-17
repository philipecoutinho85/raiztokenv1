"use client";
import { createContext, useContext, useState } from "react";

// ✅ Criação do contexto
const SidebarContext = createContext();

// ✅ Provider que você precisa
export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// ✅ Hook opcional para usar o contexto no app
export const useSidebar = () => useContext(SidebarContext);

// ✅ Componentes visuais do Sidebar (Exemplo simples)
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

// ✅ Exportação de todos os componentes
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
  SidebarProvider, // 🔥 Aqui é onde estava faltando
};

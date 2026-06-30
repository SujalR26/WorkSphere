import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');
  const [globalLoading, setGlobalLoading] = useState(false);
  
  // Modals & Drawers: { type, data }
  const [activeModal, setActiveModal] = useState({ type: null, data: null });
  const [activeDrawer, setActiveDrawer] = useState({ type: null, data: null });
  
  // Toast notifications: [{ id, message, type }]
  const [toasts, setToasts] = useState([]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const changeTheme = useCallback((newTheme) => {
    setTheme(newTheme);
  }, []);

  const openModal = useCallback((type, data = null) => {
    setActiveModal({ type, data });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal({ type: null, data: null });
  }, []);

  const openDrawer = useCallback((type, data = null) => {
    setActiveDrawer({ type, data });
  }, []);

  const closeDrawer = useCallback(() => {
    setActiveDrawer({ type: null, data: null });
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <UIContext.Provider
      value={{
        sidebarCollapsed,
        toggleSidebar,
        theme,
        changeTheme,
        globalLoading,
        setGlobalLoading,
        activeModal,
        openModal,
        closeModal,
        activeDrawer,
        openDrawer,
        closeDrawer,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

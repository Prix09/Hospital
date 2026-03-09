import React, { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) return { showNotification: () => {} };
    return ctx;
};

export const NotificationProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showNotification = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now().toString(36);
        setToasts(prev => [...prev, { id, message, type }]);
        if (duration) setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }, []);

    const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="toast-container">
                {toasts.map(t => (
                    <div key={t.id} className={`toast toast-${t.type}`}>
                        <span>{t.message}</span>
                        <button className="toast-close-btn" onClick={() => remove(t.id)}>✕</button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

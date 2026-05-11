import { useState, createContext, useContext } from "react";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function showToast(message, type = "success") {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div style={{
        position: "fixed", bottom: "30px", right: "30px",
        display: "flex", flexDirection: "column", gap: "10px", zIndex: 9999
      }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            background: toast.type === "error" ? "#e74c3c" : toast.type === "warning" ? "#e67e22" : "#2ecc71",
            color: "white",
            padding: "14px 20px",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            fontSize: "15px",
            fontWeight: "500",
            minWidth: "250px",
            animation: "slideIn 0.3s ease"
          }}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
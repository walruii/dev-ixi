"use client";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AlertContextType {
  alert: ReactNode;
  setAlert: React.Dispatch<React.SetStateAction<ReactNode>>;
}
export const AlertContext = createContext<AlertContextType | null>(null);

export default function AlertProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alert, setAlert] = useState<ReactNode>();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (alert) {
        setAlert(null);
      }
    }, 4000);
    return () => clearTimeout(timeout);
  }, [alert]);
  return (
    <>
      <div className="fixed top-0 right-0 z-50 flex flex-col items-end gap-4 p-4">
        {alert}
      </div>
      <AlertContext.Provider value={{ alert, setAlert }}>
        {children}
      </AlertContext.Provider>
    </>
  );
}

"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AlertContextType {
  alert: ReactNode;
  setAlert: React.Dispatch<React.SetStateAction<ReactNode>>;
  setAlertFunction: ({
    variant,
    title,
    description,
  }: {
    variant: "default" | "destructive";
    title: string;
    description: string;
  }) => void;
}
export const AlertContext = createContext<AlertContextType | null>(null);

export default function AlertProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alert, setAlert] = useState<ReactNode>();
  const setAlertFunction = ({
    variant = "default",
    title,
    description,
  }: {
    variant: "default" | "destructive";
    title: string;
    description: string;
  }) => {
    setAlert(
      <Alert variant={variant}>
        <Terminal className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    );
  };
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
      <AlertContext.Provider value={{ alert, setAlert, setAlertFunction }}>
        {children}
      </AlertContext.Provider>
    </>
  );
}

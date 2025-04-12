"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { createContext, ReactNode, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

interface AlertContextType {
  alert: ReactNode;
  setAlert: React.Dispatch<React.SetStateAction<ReactNode>>;
  setAlertSidebar: ({
    variant,
    title,
    description,
  }: {
    variant: "default" | "destructive";
    title: string;
    description: string;
  }) => void;
  setAlertDialog: ({
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
  const setAlertSidebar = ({
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
  const setAlertDialog = ({
    variant = "default",
    title,
    description,
  }: {
    variant: "default" | "destructive";
    title: string;
    description: string;
  }) => {
    setAlert(
      <AlertDialog defaultOpen={true}>
        <AlertDialogContent
          className={
            variant === "destructive" ? "text-red-600" : "text-green-600"
          }
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Ok</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
      <AlertContext.Provider
        value={{ alert, setAlert, setAlertSidebar, setAlertDialog }}
      >
        {children}
      </AlertContext.Provider>
    </>
  );
}

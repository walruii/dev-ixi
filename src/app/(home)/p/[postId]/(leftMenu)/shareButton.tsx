"use client";
import { AlertContext } from "@/app/(alerts)/alertProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useContext } from "react";
import { CiShare2 } from "react-icons/ci";
export default function ShareButton() {
  const alertContext = useContext(AlertContext);
  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href);
    alertContext?.setAlert(
      <Alert variant={"default"}>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Link Copied to Clipboard!</AlertDescription>
      </Alert>
    );
  };
  return (
    <div
      className="flex flex-col justify-center items-center gap-2"
      onClick={handleClick}
    >
      <CiShare2 size={35} />
    </div>
  );
}

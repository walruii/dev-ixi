import { AlertContext } from "@/context/alertContextProvider";
import { useContext, useState } from "react";

export default function useEditInfo({
  field,
  changeField,
}: {
  field: string;
  changeField: (field: string) => Promise<{ status: number; message: string }>;
}) {
  const alertContext = useContext(AlertContext);
  const [displayField, setDisplayField] = useState(field);
  const [newField, setNewField] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFieldChange = async () => {
    if (loading) return;
    if (newField.trim() == "") {
      setError("Field Can NOT be empty!");
      return;
    }
    setLoading(true);
    try {
      const resp = await changeField(newField);
      if (resp.status !== 200) {
        setError(resp.message);
        alertContext?.setAlertFunction({
          variant: "destructive",
          title: "Error",
          description: resp.message,
        });
      } else {
        setError(null);
        alertContext?.setAlertFunction({
          variant: "default",
          title: "Success",
          description: resp.message,
        });
        setDisplayField(newField);
      }
    } catch (error) {
      setError(error as string);
    }
    setLoading(false);
  };

  return {
    displayField,
    newField,
    setNewField,
    handleFieldChange,
    error,
    loading,
  };
}

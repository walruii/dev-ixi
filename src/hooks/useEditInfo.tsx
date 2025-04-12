import { AlertContext } from "@/context/alertContextProvider";
import { TField } from "@/serveractions/user";
import { useContext, useState } from "react";

export default function useEditInfo({
  fieldName,
  initField,
  changeField,
}: {
  fieldName: TField;
  initField: string;
  changeField: (
    field: TField,
    value: string
  ) => Promise<{ status: number; message: string }>;
}) {
  const alertContext = useContext(AlertContext);
  const [displayField, setDisplayField] = useState(initField);
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
      const resp = await changeField(fieldName, newField);
      if (resp.status !== 200) {
        setError(resp.message);
        alertContext?.setAlertDialog({
          variant: "destructive",
          title: "Error",
          description: resp.message,
        });
      } else {
        setError(null);
        alertContext?.setAlertDialog({
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

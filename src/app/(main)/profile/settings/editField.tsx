"use client";
import useEditInfo from "@/hooks/useEditInfo";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TField } from "@/serveractions/user";

export default function EditField({
  field,
  fieldName,
  changeField = () => {
    return new Promise((resolve) => resolve);
  },
}: {
  field: string;
  fieldName: string;
  changeField?: (
    field: TField,
    value: string
  ) => Promise<{ status: number; message: string }>;
}) {
  const {
    displayField,
    newField,
    setNewField,
    loading,
    handleFieldChange,
    error,
  } = useEditInfo({
    fieldName: fieldName as TField,
    initField: field,
    changeField,
  });

  return (
    <div className="flex flex-col w-full mb-5">
      <h1 className="font-stretch-ultra-expanded font-semibold text-lg mb-4">
        {fieldName}
      </h1>
      <div className="flex flex-col md:flex-row justify-between sm:px-5">
        <h1 className="text-3xl">{displayField}</h1>
        <div className="flex gap-2">
          <Input
            value={newField}
            onChange={(e) => setNewField(e.target.value)}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild className="">
              <Button variant="default">
                {loading ? "Changing..." : "Change"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to change your {fieldName}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {displayField} -&gt; {newField}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleFieldChange}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {error && <p className="sm:px-5 mt-5 text-red-500">{error}</p>}
    </div>
  );
}

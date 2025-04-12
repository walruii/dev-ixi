"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useEditInfo from "@/hooks/useEditInfo";
import { TField } from "@/serveractions/user";
import { Label } from "@radix-ui/react-dropdown-menu";
export default function EditProfilePicture({ image }: { image: string }) {
  const {
    displayField,
    newField,
    setNewField,
    loading,
    handleFieldChange,
    error,
  } = useEditInfo({
    fieldName: "Image" as TField,
    initField: image,
    changeField: () => new Promise((resolve) => resolve),
  });
  return (
    <div className="flex flex-col w-full">
      <h1 className="font-stretch-ultra-expanded font-semibold text-lg mb-4">
        Profile Picture
      </h1>
      <div className="flex flex-col gap-2 mt-4 sm:px-5">
        <Avatar className="w-16 h-16">
          <AvatarImage src={displayField} />
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
        <Label>New Image URL</Label>
        <div className="flex justify-between gap-2">
          <Input
            id="image"
            value={newField}
            onChange={(e) => setNewField(e.target.value)}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default">
                {loading ? "Changing..." : "Change"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to change your Profile picture?
                </AlertDialogTitle>
                <AlertDialogDescription className="flex justify-center items-center gap-2">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={displayField} />
                    <AvatarFallback>AN</AvatarFallback>
                  </Avatar>
                  -&gt;
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={newField} />
                    <AvatarFallback>AN</AvatarFallback>
                  </Avatar>
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

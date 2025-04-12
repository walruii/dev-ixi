"use client";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { followUser } from "@/serveractions/follow";
import { AlertContext } from "@/context/alertContextProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Session } from "next-auth";

export default function FollowButton({
  isfollowed,
  author_id,
  session,
}: {
  isfollowed: boolean;
  author_id: string | number;
  session: Session | null;
}) {
  const alertContext = useContext(AlertContext);
  const [isFollowing, setIsFollowing] = useState(isfollowed);
  const [loading, setLoading] = useState(false);
  const setError = (status: number) => {
    if (status === 401) {
      alertContext?.setAlert(
        <Alert variant={"destructive"}>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            You need to be signed in to follow this user.
          </AlertDescription>
        </Alert>
      );
    } else if (status === 500) {
      alertContext?.setAlert(
        <Alert variant={"destructive"}>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </Alert>
      );
    } else if (status === 400) {
      alertContext?.setAlert(
        <Alert variant={"destructive"}>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Bad request. Please check your input and try again.
          </AlertDescription>
        </Alert>
      );
    }
  };
  const handleFollow = async () => {
    setLoading(true);
    // Simulate an API call to follow
    const response = await followUser({ userId: author_id });
    if (response.status !== 201) {
      setError(response.status);
      setLoading(false);
      return;
    }
    // Handle successful follow
    alertContext?.setAlert(
      <Alert variant={"default"}>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          You have successfully followed this user.
        </AlertDescription>
      </Alert>
    );

    setIsFollowing(true);
    setLoading(false);
  };
  const handleUnfollow = async () => {
    setLoading(true);
    const response = await followUser({ userId: author_id });
    if (response.status !== 200) {
      setError(response.status);
      setLoading(false);
      return;
    }
    alertContext?.setAlert(
      <Alert variant={"default"}>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          You have successfully unfollowed this user.
        </AlertDescription>
      </Alert>
    );
    setIsFollowing(false);
    setLoading(false);
  };
  if (session && session.user && session.user.userId === author_id) {
    return null; // Don't show the button if the user is the author
  }
  return (
    <>
      {isFollowing ? (
        <AlertDialog>
          <AlertDialogTrigger asChild className="mt-4">
            <Button variant="outline">
              {loading ? "Loading..." : "Following"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you absolutely sure You Want to un Follow?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleUnfollow}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button
          variant={"default"}
          onClick={handleFollow}
          disabled={loading}
          className="mt-4"
        >
          {loading ? "Loading..." : "Follow"}
        </Button>
      )}
    </>
  );
}

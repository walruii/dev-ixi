import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CreateComment() {
  return (
    <div className="flex flex-col gap-2">
      <div className="border-b my-2" />
      {/* <h1>Get your Opinion out there!</h1> */}
      <Textarea placeholder="Write your comment here..." className="mb-2" />
      <Button variant={"default"}>Submit</Button>
    </div>
  );
}

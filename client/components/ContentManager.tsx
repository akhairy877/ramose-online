import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllContent, resetAllContent, useContent } from "@/lib/content";

export function ContentManager() {
  const [open, setOpen] = useState(false);
  const { overrides, defaults } = useMemo(() => getAllContent(), []);
  const keys = useMemo(() => Object.keys(defaults) as (keyof typeof defaults)[], [defaults]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        variant="default"
      >
        Customize
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Text Content</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="grid gap-4">
              {keys.map((key) => (
                <Field key={key} k={key} />
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-between gap-2 pt-2">
            <Button variant="outline" onClick={() => { resetAllContent(); setOpen(false); }}>
              Reset All
            </Button>
            <Button onClick={() => setOpen(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({ k }: { k: keyof ReturnType<typeof getAllContent>["defaults"] }) {
  const [value, setValue] = useContent(k);
  return (
    <div className="grid gap-1">
      <Label>{k}</Label>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
}

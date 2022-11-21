import { useState } from "react";
import { Button } from "../button";
import { Drawer } from "./drawer";

export const Index = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Drawer
        props={{
          open: open,
          onClose: () => setOpen(false),
        }}
      >
        <div> This is a test drawer component.</div>
      </Drawer>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
    </>
  );
};

import { Button, Title, Text } from "@mantine/core";
import { useState } from "react";

export default function Grade() {
  const [selected, setSelected] = useState<"great" | "good" | "average" | "bad" | "spam">("average");

  return (
    <div className="flex flex-col">
      <div className="mx-auto px-10 space-y-10 basis-1/6 ">
        <div className="space-y-3">
          <Title order={2} weight={600} className="mb-1">
            {"Review Question"}
          </Title>
          <Text italic color="dimmed">
            Important: You can’t edit this score after submitting. Double check your score and ensure it’s good to go
          </Text>
        </div>
        <div className="flex flex-col space-y-3">
          <Button
            onClick={() => setSelected("great")}
            variant="default"
            disabled={selected === "great"}
            sx={{
              "&[data-disabled]": { backgroundColor: "#D9F0CA", color: "black" },
            }}
          >
            Great
          </Button>
          <Button
            onClick={() => setSelected("good")}
            variant="default"
            disabled={selected === "good"}
            sx={{
              "&[data-disabled]": { backgroundColor: "#D1DEFF", color: "black" },
            }}
          >
            Good
          </Button>
          <Button
            onClick={() => setSelected("average")}
            variant="default"
            disabled={selected === "average"}
            sx={{
              "&[data-disabled]": { backgroundColor: "#EDEDED", color: "black" },
            }}
          >
            Average
          </Button>
          <Button
            onClick={() => setSelected("bad")}
            variant="default"
            disabled={selected === "bad"}
            sx={{
              "&[data-disabled]": { backgroundColor: "#FFE2C2", color: "black" },
            }}
          >
            Bad
          </Button>
          <Button
            onClick={() => setSelected("spam")}
            variant="default"
            disabled={selected === "spam"}
            sx={{
              "&[data-disabled]": { backgroundColor: "#F8D4D7", color: "black" },
            }}
          >
            Spam
          </Button>
        </div>
        <div className="grid grid-cols-2 space-x-2 w-full">
          <Button fullWidth variant="default">
            Cancel
          </Button>
          <Button fullWidth>Submit Score</Button>
        </div>
      </div>
    </div>
  );
}

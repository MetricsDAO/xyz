import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";

export const MarkdownEditor = () => {
  const [value, setValue] = useState<string>();

  return (
    <div>
      <MDEditor data-color-mode="light" value={value} onChange={setValue} />
      <input type="hidden" name="description" value={value} />
    </div>
  );
};

export function ParsedMarkdown({ text }: { text: string }) {
  return <MDEditor.Markdown style={{ backgroundColor: "inherit", color: "gray" }} source={text} />;
}

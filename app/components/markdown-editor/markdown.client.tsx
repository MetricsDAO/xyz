import type { MDEditorProps } from "@uiw/react-md-editor";
import MDEditor from "@uiw/react-md-editor";

export const MarkdownEditor = ({
  value,
  onChange,
}: {
  value: MDEditorProps["value"];
  onChange: MDEditorProps["onChange"];
}) => {
  return <MDEditor data-color-mode="light" value={value} onChange={onChange} />;
};

export function ParsedMarkdown({ text }: { text: string }) {
  return <MDEditor.Markdown style={{ backgroundColor: "inherit", color: "#5c5b5b", fontSize: "14px" }} source={text} />;
}

import { CopyToClipboard } from "./copy-to-clipboad";

export const Basic = () => {
  return (
    <div className="flex flex-col gap-5">
      <CopyToClipboard content="Red text" className="text-red-600" />
      <CopyToClipboard content="This is some content" />
      <CopyToClipboard content="Large text" className="text-lg" />
    </div>
  );
};

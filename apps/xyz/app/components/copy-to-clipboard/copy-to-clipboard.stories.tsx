import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { CopyToClipboard } from "./copy-to-clipboard";

export const Basic = () => {
  return (
    <div className="flex flex-col gap-5 items-center">
      <CopyToClipboard content="Red text" className="text-red-600" />
      <CopyToClipboard content="This is some content" />
      <CopyToClipboard content="Large text" className="text-lg" />
      <CopyToClipboard
        content="Text with icon"
        className="text-lg"
        iconRight={<MagnifyingGlassIcon className="w-5 h-5" />}
      />
    </div>
  );
};

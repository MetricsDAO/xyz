import { Button } from "../button";

export function Error({ error, children }: { error: Error; children?: React.ReactNode }) {
  return (
    <div className="w-full flex items-center justify-center text-gray-800">
      <div className="max-w-lg space-y-2">
        <h1 className="text-xl font-semibold">500 Error</h1>
        <p className="text-xl text-gray-400 pb-4 font-medium">Welp, something broke. This shouldn't be happening </p>
        <Button className="bg-[#5865F2]">Let us know on Discord</Button>
        {children}
      </div>
    </div>
  );
}

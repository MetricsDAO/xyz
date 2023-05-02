import { Button } from "../button";

export function Error({ error }: { error: Error }) {
  return (
    <html lang="en">
      <body>
        <div className="w-full flex items-center justify-center text-gray-800">
          <div className="max-w-lg space-y-2">
            <h1 className="text-2xl">Ooops!</h1>
            <p className="text-neutral-400 text-base">something went wrong</p>
            <img src="/img/error.png" alt="" />
            <p>It seems you've ventured too deep</p>
          </div>
          <Button className="bg-[#5865F2]">Let us know on Discord</Button>
        </div>
      </body>
    </html>
  );
}

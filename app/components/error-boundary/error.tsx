import { Button } from "../button";

export function Error() {
  return (
    <div className="w-full flex flex-col items-center justify-center text-gray-800 gap-5 mt-10">
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#A0DDA9] to-[#01C2FF]">
        Ooops!
      </h1>
      <p className="text-neutral-400 text-2xl font-bold">something went wrong</p>
      <img src="/img/error.png" alt="" className="my-3" />
      <p className="text-neutral-400 font-medium">It seems you've ventured too deep</p>
      <Button variant="gradient" onClick={() => history.back()}>
        Go Back
      </Button>
    </div>
  );
}

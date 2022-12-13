import { ArrowSmallRightIcon } from "@heroicons/react/20/solid";

export default function MarketingButton({ label, link }: { label: string; link: string }) {
  return (
    <a className="border-2 rounded-lg w-fit border-sky-500 h-10 flex items-center" href={link}>
      <div className="text-white bg-sky-500 rounded-lg h-10 px-4 flex items-center">
        <p>{label}</p>
      </div>
      <ArrowSmallRightIcon className="text-sky-500 px-1 h-9 w-9" />
    </a>
  );
}

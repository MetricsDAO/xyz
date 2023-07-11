import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";

export function BadgerLinks() {
  return (
    <div className="flex mt-16 gap-x-2 items-center">
      <InformationCircleIcon className="h-6 w-6 mr-2" />
      <Link to={"https://www.trybadger.com/"} className="text-sm text-blue-600">
        Launch Badger
      </Link>
      <p className="text-sm text-blue-600">|</p>
      <Link to={"https://docs.trybadger.com/"} className="text-sm text-blue-600">
        Badger Docs
      </Link>
    </div>
  );
}

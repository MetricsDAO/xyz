import { useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

const Comments = ({ comments }) => {

  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active)
  };

  return (
    <div onClick={handleClick} className="tw-cursor-pointer">
      <div className={"tw-text-slate-600 tw-flex tw-items-center tw-pt-2 tw-mt-2 tw-border-t tw-border-slate-200 " + (active ? "tw-justify-center" : "")}>
        <FontAwesomeIcon
          className="tw-mr-2"
          icon={faComments}
        />
        <div className="tw-text-sm">
          <p className="tw-max-w-xs sm:tw-max-w-xs md:tw-max-w-screen-md lg:tw-max-w-screen-md xl:tw-max-w-screen-lg 2xl:tw-max-w-screen-xl tw-truncate">
            {active ? "Comments" : comments.join(', ')}
          </p>
        </div>
      </div>
      <ul className={"tw-text-sm tw-max-w-fit tw-list-disc tw-ml-4 tw-overflow-hidden " + (active ? "tw-h-full" : "tw-h-0")}>
        {
          comments?.map((note, index) => <li key={"noteId-" + index} className="tw-list-disc tw-mt-2 tw-ml-4">{note}</li>)
        }
      </ul>
    </div>
  )
}

export default Comments;
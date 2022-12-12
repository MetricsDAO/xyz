// TODO: Reimplement this in typescript.

import algoliasearch from "algoliasearch/lite";
import Header from "~/features/marketing-shell/Header";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faExternalLink,
  faSignal,
  faUserGraduate,
  faFlag,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { InstantSearch, Hits, SearchBox, Pagination, RefinementList, Configure } from "react-instantsearch-dom";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import uniswapLogo from "../../../public/img/uniswap-logo.png";
import olympusLogo from "../../../public/img/olympusdao-logo.png";
import * as Tooltip from "@radix-ui/react-tooltip";
import AppFooter from "~/features/marketing-shell/Footer";

export function loader() {
  return {
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
  };
}

const icons = {
  OlympusDAO: olympusLogo,
  Uniswap: uniswapLogo,
};

function App() {
  const data = useLoaderData();
  const searchClient = algoliasearch(data.ALGOLIA_APP_ID, data.ALGOLIA_API_KEY);
  return (
    <>
      <section className="site-header-skinny">
        <div className="container">
          <Header />
        </div>
      </section>
      <InstantSearch searchClient={searchClient} indexName="submissions">
        <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
          <Filters />
          <Content />
        </div>
      </InstantSearch>
      <AppFooter />
    </>
  );
}
function Filters() {
  return (
    <aside className="sidebar lg:w-80  md:shadow transform hidden md:block transition-transform duration-150 ease-in">
      <div className="sidebar-content px-2 py-6 ml-2 mr-4 mt-14 ">
        <ul className="flex flex-col w-full ">
          <li className="my-px rounded-sm shadow-lg mb-4 p-4 bg-white">
            <div className="text-xl mb-2">Program</div>
            <RefinementList attribute="program_name" />
          </li>
          <li className="my-px rounded-sm shadow-lg mb-4 p-4 bg-white">
            <div className="text-xl mb-2">Quality</div>
            <RefinementList attribute="submission_quality" />
          </li>
          <li className="my-px rounded-sm shadow-lg mb-4 p-4 bg-white">
            <div className="text-xl mb-2">Analyst</div>
            <RefinementList attribute="hunter_discord_id" searchable={true} limit={5} />
          </li>
        </ul>
      </div>
    </aside>
  );
}
function Content() {
  return (
    <main className="main flex flex-col w-full transition-all duration-150 ease-in">
      <div className="main-content flex flex-col flex-1 p-4">
        <h1 className="font-bold text-2xl text-gray-700 mb-4">Submissions</h1>
        <div className="max-w-full mb-4">
          <SearchBox
            translations={{
              submitTitle: "Submit your search query.",
              resetTitle: "Clear your search query.",
              placeholder: "Search all submissions...",
            }}
          />
        </div>
        <div>
          <Hits hitComponent={Hit} />
          <Configure hitsPerPage={7} />
          <Pagination />
        </div>
      </div>
    </main>
  );
}
const Comments = ({ comments }) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <div
        className={
          "text-slate-600 flex items-center pt-2 mt-2 border-t border-slate-200 " + (active ? "justify-center" : "")
        }
      >
        <FontAwesomeIcon className="mr-2" icon={faComments} />
        <div className="text-sm w-full overflow-hidden">
          <p className="max-w-xs sm:max-w-xs md:max-w-screen-md lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl truncate">
            {active ? "Comments" : comments.join(", ")}
          </p>
        </div>
      </div>
      <ul className={"text-sm max-w-fit list-disc ml-4 overflow-hidden " + (active ? "h-full" : "h-0")}>
        {comments?.map((note, index) => (
          <li key={"noteId-" + index} className="list-disc mt-2 ml-4">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
};
function Hit(props) {
  const { hit } = props;
  const { grading_notes = "", overall_score, is_flagged_by_bounty_ops, is_flagged_by_reviewers } = hit;
  const notes = grading_notes?.length ? grading_notes.split("<--review-delimiter-->") : [];
  const bountyOpsFlag = is_flagged_by_bounty_ops == "Yes" ? hit["flag_by_bounty_ops"].split(",") : [];
  const reviewerFlags = is_flagged_by_reviewers == "Yes" ? hit["flags_by_reviewers"].split(",") : [];
  let uniqueOpsFlags = [...new Set(bountyOpsFlag)];
  let uniqueReviewerFlags = [...new Set(reviewerFlags)];

  const toolTipText = is_flagged_by_bounty_ops == "Yes" ? "Flagged by Bounty Ops" : "Flagged By Peer Review";

  const uniqueFlags = is_flagged_by_bounty_ops == "Yes" ? uniqueOpsFlags : uniqueReviewerFlags;
  const flagColor = is_flagged_by_bounty_ops == "Yes" ? "bg-[#55ABFB]" : "bg-[#B5E8FD]";

  return (
    <Tooltip.Provider delayDuration={800} skipDelayDuration={500}>
      <div className="p-4 mb-4 max-w-full mx-auto bg-white rounded-md shadow-md flex space-x-4 hover:shadow-xl hover:rounded-xl">
        <div className="w-full">
          <a href={hit["public_dashboard"]} target="_blank" rel="noreferrer">
            <div className="text-xl font-medium text-black mb-3 flex flex-wrap items-center justify-between">
              <div className="flex items-center">
                <div className="program-icon mr-2">
                  {icons[hit["program_name"]] ? (
                    <img alt="MetricsDao" src={icons[hit["program_name"]]} title={hit["program_name"]} />
                  ) : (
                    <img alt="MetricsDao" src="../img/black-mark@2x.png" title={hit["program_name"]} />
                  )}
                </div>
                <div className="content-start">
                  {hit.question_title}
                  <FontAwesomeIcon className="text-slate-300 align-middle pl-2 text-sm" icon={faExternalLink} />
                </div>
              </div>
              {is_flagged_by_bounty_ops == "No" && is_flagged_by_reviewers == "No" ? (
                <div
                  className="flex items-center justify-around space-x-2 max-w-xs text-sm leading-7
                my-2 px-4 py-0.5 score-label rounded-xl border border-slate-400"
                >
                  <span>Score</span>
                  <span
                    className="w-6 h-6 flex items-center justify-center text-xs rounded-full
                    font-bold text-white bg-slate-400 ml-4 md:ml-0"
                  >
                    {overall_score}
                  </span>
                </div>
              ) : (
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    <div className="flex justify-center items-end space-x-2 border-none border-x-slate-50:ml-4">
                      <div className="flex space-x-2 items-center">
                        <FontAwesomeIcon className="text-slate-500 fa-xs" icon={faFlag} />
                        {uniqueFlags.map((element, i) => (
                          <div
                            key={i}
                            className={`text-xs rounded-full ${flagColor} bg-opacity-50 py-1 px-2 text-black`}
                          >
                            {element}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Content className="flex z-10 py-2 border-none px-3 text-sm font-medium text-white bg-slate-600 rounded-md">
                    {toolTipText}
                    <Tooltip.Arrow fill="rgb(71 85 105)" />
                  </Tooltip.Content>
                </Tooltip.Root>
              )}
            </div>

            <div className="flex flex-row flex-wrap gap-2 text-sm md:justify-start">
              <div className="flex flex-row space-x-2">
                <div>
                  <FontAwesomeIcon className="text-slate-500" icon={faSignal} />
                </div>
                <div className="text-slate-500">{hit["submission_quality"]}</div>
              </div>
              <div className="flex flex-row space-x-2">
                <div>
                  <FontAwesomeIcon className="text-slate-500" icon={faCalendar} />
                </div>
                <div className="text-slate-500">{hit["created_at"]}</div>
              </div>
              <div className="flex flex-row space-x-2 w-min-200">
                <div>
                  <FontAwesomeIcon className="text-slate-500" icon={faUserGraduate} />
                </div>
                <div className="text-slate-500">{hit["hunter_discord_id"]}</div>
              </div>
            </div>
          </a>
          {notes?.length > 0 && <Comments comments={notes} />}
        </div>
      </div>
    </Tooltip.Provider>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;

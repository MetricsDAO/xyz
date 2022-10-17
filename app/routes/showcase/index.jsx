import algoliasearch from "algoliasearch/lite";
import Header from "~/components/Header";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faExternalLink, faSignal, faUserGraduate, faFlag } from "@fortawesome/free-solid-svg-icons";
import { InstantSearch, Hits, SearchBox, Pagination, RefinementList, Configure } from "react-instantsearch-dom";
import { useLoaderData } from "@remix-run/react";
import uniswapLogo from "../../../public/img/uniswap-logo.png";
import olympusLogo from "../../../public/img/olympusdao-logo.png";
import Comments from "~/components/Comments";
import * as Tooltip from "@radix-ui/react-tooltip";
import AppFooter from "~/components/Footer";

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
        <div className="tw-flex tw-flex-row tw-min-h-screen tw-bg-gray-100 tw-text-gray-800">
          <Filters />
          <Content />
        </div>
      </InstantSearch>
      <AppFooter/>
    </>
  );
}
function Filters() {
  return (
    <aside className="tw-sidebar lg:tw-w-80  md:tw-shadow tw-transform -tw-translate-x-full md:tw-translate-x-0 tw-transition-transform tw-duration-150 tw-ease-in">
      <div className="tw-sidebar-content tw-px-2 tw-py-6 tw-ml-2 tw-mr-4 tw-mt-14 ">
        <ul className="tw-flex tw-flex-col tw-w-full ">
          <li className="tw-my-px tw-rounded-sm tw-shadow-lg tw-mb-4 tw-p-4 tw-bg-white">
            <div className="tw-text-xl tw-mb-2">Program</div>
            <RefinementList attribute="program_name" />
          </li>
          <li className="tw-my-px tw-rounded-sm tw-shadow-lg tw-mb-4 tw-p-4 tw-bg-white">
            <div className="tw-text-xl tw-mb-2">Quality</div>
            <RefinementList attribute="submission_quality" />
          </li>
          <li className="tw-my-px tw-rounded-sm tw-shadow-lg tw-mb-4 tw-p-4 tw-bg-white">
            <div className="tw-text-xl tw-mb-2">Analyst</div>
            <RefinementList attribute="hunter_discord_id" searchable={true} limit={5} />
          </li>
        </ul>
      </div>
    </aside>
  );
}
function Content() {
  return (
    <main className="tw-main tw-flex tw-flex-col tw-flex-grow -tw-ml-56 md:tw-ml-0 tw-transition-all tw-duration-150 tw-ease-in">
      <div className="tw-main-content tw-flex tw-flex-col tw-flex-grow tw-p-4">
        <h1 className="tw-font-bold tw-text-2xl tw-text-gray-700 tw-mb-4">Submissions</h1>
        <div className="tw-max-w-full tw-mb-4">
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
  const flagColor = is_flagged_by_bounty_ops == "Yes" ? "tw-bg-[#55ABFB]" : "tw-bg-[#B5E8FD]";

  return (
    <Tooltip.Provider delayDuration={800} skipDelayDuration={500}>
      <div className="tw-p-4 tw-mb-4 tw-max-w-full tw-mx-auto bg-white tw-rounded-md tw-shadow-md tw-flex tw-space-x-4 hover:tw-shadow-xl hover:tw-rounded-xl">
        <div className="tw-w-full">
          <a href={hit["public_dashboard"]} target="_blank" rel="noreferrer">
            <div className="tw-text-xl tw-font-medium tw-text-black tw-mb-3 tw-flex tw-items-center tw-justify-between">
              <div className="tw-flex tw-items-center">
                <div className="program-icon tw-mr-2">
                  {icons[hit["program_name"]] ? (
                    <img alt="MetricsDao" src={icons[hit["program_name"]]} title={hit["program_name"]} />
                  ) : (
                    <img alt="MetricsDao" src="../img/black-mark@2x.png" title={hit["program_name"]} />
                  )}
                </div>
                <div className="tw-content-start">
                  {hit.question_title}
                  <FontAwesomeIcon
                    className="tw-text-slate-300 tw-align-middle tw-pl-2 tw-text-sm"
                    icon={faExternalLink}
                  />
                </div>
              </div>
              {is_flagged_by_bounty_ops == "No" && is_flagged_by_reviewers == "No" ? (
                <div
                  className="tw-flex tw-items-center tw-justify-around tw-space-x-2 tw-max-w-xs tw-text-sm tw-leading-7
                tw-my-2 tw-px-4 tw-py-0.5 score-label tw-rounded-xl tw-border tw-border-slate-400"
                >
                  <span>Score</span>
                  <span
                    className="tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center tw-text-xs tw-rounded-full
                    tw-font-bold tw-text-white tw-bg-slate-400 tw-ml-4 md:tw-ml-0"
                  >
                    {overall_score}
                  </span>
                </div>
              ) : (
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    <div className="tw-flex tw-justify-center tw-items-end tw-space-x-2 tw-border-none tw-border-x-slate-50:tw-ml-4">
                      <div className="tw-flex tw-space-x-2 tw-items-center">
                        <FontAwesomeIcon className="tw-text-slate-500 fa-xs" icon={faFlag} />
                        {uniqueFlags.map((element, i) => (
                          <div
                            key={i}
                            className={`tw-text-xs tw-rounded-full ${flagColor} tw-bg-opacity-50 tw-py-1 tw-px-2 tw-text-black`}
                          >
                            {element}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Content className="flex tw-z-10 tw-py-2 tw-border-none tw-px-3 tw-text-sm tw-font-medium tw-text-white tw-bg-slate-600 tw-rounded-md">
                    {toolTipText}
                    <Tooltip.Arrow fill="rgb(71 85 105)" />
                  </Tooltip.Content>
                </Tooltip.Root>
              )}
            </div>

            <div className="tw-flex tw-flex-row tw-space-x-8 tw-text-sm tw-justify-around md:tw-justify-start">
              <div className="tw-flex tw-flex-row tw-space-x-2">
                <div>
                  <FontAwesomeIcon className="tw-text-slate-500" icon={faSignal} />
                </div>
                <div className="tw-text-slate-500">{hit["submission_quality"]}</div>
              </div>
              <div className="tw-flex tw-flex-row tw-space-x-2">
                <div>
                  <FontAwesomeIcon className="tw-text-slate-500" icon={faCalendar} />
                </div>
                <div className="tw-text-slate-500">{hit["created_at"]}</div>
              </div>
              <div className="tw-flex tw-flex-row tw-space-x-2 tw-w-min-200">
                <div>
                  <FontAwesomeIcon className="tw-text-slate-500" icon={faUserGraduate} />
                </div>
                <div className="tw-text-slate-500">{hit["hunter_discord_id"]}</div>
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

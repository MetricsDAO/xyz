import algoliasearch from "algoliasearch/lite";
import AppHeader from "../../components/app-header-skinny";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faExternalLink,
  faSignal,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  RefinementList,
  Configure,
} from "react-instantsearch-dom";
import { useLoaderData } from "@remix-run/react";
import uniswapLogo from "../../../public/img/uniswap-logo.png";
import olympusLogo from "../../../public/img/olympusdao-logo.png";
import Comments from './Comments';

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
      <AppHeader />
      <InstantSearch searchClient={searchClient} indexName="submissions">
        <div className="tw-flex tw-flex-row tw-min-h-screen tw-bg-gray-100 tw-text-gray-800">
          <Filters />
          <Content />
        </div>
      </InstantSearch>
    </>
  );
}
function Filters() {
  return (
    <aside className="tw-sidebar lg:tw-w-80  md:tw-shadow tw-transform -tw-translate-x-full md:tw-translate-x-0 tw-transition-transform tw-duration-150 tw-ease-in">
      <div className="tw-sidebar-content tw-px-2 tw-py-6  tw-ml-2 tw-mr-4 tw-mt-14 ">
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
            <RefinementList
              attribute="hunter_discord_id"
              searchable={true}
              limit={5}
            />
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
        <h1 className="tw-font-bold tw-text-2xl tw-text-gray-700 tw-mb-4">
          Submissions
        </h1>
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
  const { grading_notes = '', overall_score } = hit;
  const notes = grading_notes?.length ? grading_notes.split('<--review-delimiter-->') : [];
  return (
    <div className="tw-p-4 tw-mb-4 tw-max-w-full tw-mx-auto bg-white tw-rounded-md tw-shadow-md tw-flex tw-items-center tw-space-x-4 hover:tw-shadow-xl hover:tw-rounded-xl">
      <div className="md:tw-w-full">
        <a href={hit["public_dashboard"]} target="_blank" rel="noreferrer">
          <div className="tw-text-xl tw-font-medium tw-text-black tw-mb-3 md:tw-flex tw-items-center">
            <div className="program-icon tw-mr-2">
              {icons[hit["program_name"]] ? (
                <img
                  alt="MetricsDao"
                  src={icons[hit["program_name"]]}
                  title={hit["program_name"]}
                />
              ) : (
                <img
                  alt="MetricsDao"
                  src="../img/black-mark@2x.png"
                  title={hit["program_name"]}
                />
              )}
            </div>{" "}
            {hit.question_title}{" "}
            <FontAwesomeIcon
              className="tw-text-slate-300 tw-align-middle tw-pl-2 tw-text-sm"
              icon={faExternalLink}
            />{" "}
            <div
              className="tw-flex tw-items-center tw-justify-between md:tw-justify-around md:tw-w-24 tw-max-w-xs tw-text-sm tw-leading-7 md:tw-ml-auto 
                sm:tw-ml-0 tw-my-2 md:tw-my-0 tw-px-4 md:tw-px-1 tw-py-0.5 score-label tw-rounded-xl md:tw-rounded tw-border tw-border-slate-400"
            >
              <div className="tw-flex md:tw-hidden tw-flex-row tw-space-x-2 tw-w-min-200">
                <div>
                  <FontAwesomeIcon
                    className="tw-text-slate-500"
                    icon={faUserGraduate}
                  />
                </div>
                <div className="tw-text-slate-500">
                  {hit["hunter_discord_id"]}
                </div>
              </div>
              <span className="md:tw-flex tw-hidden">Score</span>
              <span className="tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center tw-text-xs tw-rounded-full
                tw-font-bold tw-text-white tw-bg-slate-400 tw-ml-4 md:tw-ml-0">
                {overall_score}
              </span>
            </div>
          </div>
          <div className="tw-flex tw-flex-row tw-space-x-8 tw-text-sm tw-justify-around md:tw-justify-start">
            <div className="tw-flex tw-flex-row tw-space-x-2">
              <div>
                <FontAwesomeIcon
                  className="tw-text-slate-500"
                  icon={faSignal}
                />
              </div>
              <div className="tw-text-slate-500">
                {hit["submission_quality"]}
              </div>
            </div>
            <div className="tw-flex tw-flex-row tw-space-x-2">
              <div>
                <FontAwesomeIcon
                  className="tw-text-slate-500"
                  icon={faCalendar}
                />
              </div>
              <div className="tw-text-slate-500">{hit["created_at"]}</div>
            </div>
            <div className="tw-hidden md:tw-flex tw-flex-row tw-space-x-2 tw-w-min-200">
              <div>
                <FontAwesomeIcon
                  className="tw-text-slate-500"
                  icon={faUserGraduate}
                />
              </div>
              <div className="tw-text-slate-500">
                {hit["hunter_discord_id"]}
              </div>
            </div>
          </div>
        </a>
        {
          notes?.length > 0 && (
            <Comments comments={notes} />
          )
        }
      </div>
    </div>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;

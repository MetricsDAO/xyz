import algoliasearch from 'algoliasearch/lite';
import AppHeader from "../../components/app-header-skinny";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faExternalLink, faExternalLinkAlt, faSignal, faUserGraduate } from '@fortawesome/free-solid-svg-icons'
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  RefinementList,
  Configure,
} from 'react-instantsearch-dom';
import { useLoaderData } from "@remix-run/react";


export function loader() {
  return {
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
  };
}

function App() {
  const data = useLoaderData();
  const searchClient = algoliasearch(data.ALGOLIA_APP_ID, data.ALGOLIA_API_KEY);
  return (
    <>
      <AppHeader />
      <InstantSearch searchClient={searchClient} indexName="submissions">
        <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
          <Filters />
          <Content />
        </div>
      </InstantSearch >
    </>
  );
}
function Filters() {
  return (
    <aside
      class="sidebar lg:w-80  md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in">
      <div className="sidebar-content px-2 py-6  ml-2 mr-4 mt-14 ">
        <ul className="flex flex-col w-full ">
          <li className="my-px  rounded-sm shadow-lg mb-4 p-4">
            <div className="text-xl mb-2">Program</div>
            <RefinementList attribute="program_name" />
          </li>
          <li className="my-px  rounded-sm shadow-lg mb-4 p-4">
            <div className="text-xl mb-2">Quality</div>
            <RefinementList attribute="submission_quality" />
          </li>
          <li className="my-px  rounded-sm shadow-lg mb-4 p-4">
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
    <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
      <div className="main-content flex flex-col flex-grow p-4">
        <h1 className="font-bold text-2xl text-gray-700 mb-4">Submissions</h1>
        <div className="max-w-full mb-4">
          <SearchBox
            translations={{
              submitTitle: 'Submit your search query.',
              resetTitle: 'Clear your search query.',
              placeholder: 'Search all submissions...',
            }} />

        </div>
        <div >

          <Hits hitComponent={Hit} />
          <Configure hitsPerPage={7} />
          <Pagination />
        </div>
      </div>
    </main>
  );
}
function Hit(props) {
  return (
    <div className="p-3 mb-3 max-w-full mx-auto bg-white rounded-md shadow-md flex items-center space-x-4 hover:shadow-xl hover:rounded-xl">
      <div>
        <div className="text-xl font-medium text-black mb-3">
          <a href={props.hit['public_dashboard']} target="_blank"> {props.hit.program_name} - {props.hit.question_display_title} <FontAwesomeIcon className='text-slate-300 align-middle pl-2 text-sm' icon={faExternalLink} /> </a>
        </div>
        <div className="flex flex-row space-x-8 text-sm ">
          <div className="flex flex-row space-x-2">
            <div>
              <FontAwesomeIcon className='text-slate-500' icon={faSignal} />
            </div>
            <div className="text-slate-500">
              {props.hit["submission_quality"]}
            </div>

          </div>
          <div className="flex flex-row space-x-2">
            <div>
              <FontAwesomeIcon className='text-slate-500' icon={faCalendar} />
            </div>
            <div className="text-slate-500">
              {props.hit["created_at"]}
            </div>
          </div>
          <div className="flex flex-row space-x-2 w-min-200">
            <div>
              <FontAwesomeIcon className='text-slate-500' icon={faUserGraduate} />
            </div>
            <div className="text-slate-500">
              {props.hit["hunter_discord_id"]}
            </div>
          </div>
        </div>


      </div>
    </div>


  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;
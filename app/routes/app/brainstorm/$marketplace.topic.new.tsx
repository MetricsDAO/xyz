export default function CreateTopic() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <i className="text-xl font-semibold md:col-span-2">{"Create/Update Topic"}</i>
        <div className="bg-gray-400 text-black p-3 rounded-lg border">{"Select a marketplace (w/search)"}</div>
        <div className="bg-black text-white p-3 rounded-lg w-1/2 text-center">New Marketplace</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5 w-full">
        <p className="text-black md:col-span-2">Below is disabled until collection selected</p>
        <input placeholder="Title" className=" text-black p-3 rounded-lg border w-full md:col-span-2" />
        <input placeholder="Descriptions" className="text-black p-3 rounded-lg border w-full md:col-span-2" />
        <input placeholder="Language" className="p-3 rounded-lg border" />
        <input placeholder="Project/Chain" className="p-3 rounded-lg border" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="w-full">
          <input id="start" placeholder="Start" className="p-3 rounded-lg border w-full" />
          <label htmlFor="start" className="text-black italic">
            Author claim dealine is XX/XX/XX
          </label>
        </div>
        <input placeholder="End" className="self-start p-3 rounded-lg border" />
        <div className="w-full">
          <input id="review" placeholder="Review deadline" className="p-3 rounded-lg border w-full" />
          <label htmlFor="review" className="text-black italic">
            Reviewer claim dealine is XX/XX/XX
          </label>
        </div>
        <i className="text-black self-end">Some copy on the review reward priority stuff</i>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5">
        <i className="md:col-span-2">Reward details</i>
        <input placeholder="Reward token" className="p-3 rounded-lg border" />
        <input placeholder="Reward amount" className="p-3 rounded-lg border" />
        <input placeholder="Override reviewer reward priority" className="p-3 rounded-lg border" />
      </div>
      <div>
        <i>If updating</i>
        <div className="flex flex-row space-x-5 mt-2">
          <div className="bg-black text-white p-3 rounded-lg w-full md:basis-1/5 text-center">Cancel topic</div>
          <div className="bg-black text-white p-3 rounded-lg w-full md:basis-1/5 text-center">Save topic</div>
        </div>
      </div>
    </div>
  );
}

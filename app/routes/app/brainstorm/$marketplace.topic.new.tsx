export default function CreateTopic() {
  return (
    <div className="flex">
      <div className="flex flex-col basis-2/3 mx-auto">
        <i className="text-xl font-semibold">{"Create/Update Topic"}</i>
        <div className="grid grid-cols-2 gap-x-5 mt-4">
          <div className="bg-gray-400 text-black p-3 rounded-lg border">{"Select a marketplace (w/search)"}</div>
          <div className="bg-black text-white p-3 rounded-lg w-1/2 text-center">New Marketplace</div>
        </div>
        <p className="text-black mt-6 mb-3">Below is disabled until collection selected</p>
        <input placeholder="Title" className=" text-black p-3 rounded-lg border mb-3"></input>
        <input placeholder="Descriptions" className="text-black p-3 rounded-lg border mb-3"></input>
        <div className="grid grid-cols-2 gap-x-5 w-full mb-10">
          <input placeholder="Language" className="p-3 rounded-lg border" />
          <input placeholder="Project/Chain" className="p-3 rounded-lg border" />
        </div>
        <div className="grid grid-cols-2 gap-x-5 mb-5">
          <div className="w-full">
            <input placeholder="Start" className="p-3 rounded-lg border w-full mb-2" />
            <i className="text-black">Author claim dealine is XX/XX/XX</i>
          </div>
          <input placeholder="End" className="p-3 rounded-lg border h-3/5" />
        </div>
        <div className="grid grid-cols-2 gap-x-5 mb-10">
          <div className="w-full">
            <input placeholder="Review deadline" className="p-3 rounded-lg border w-full mb-2" />
            <i className="text-black">Reviewer claim dealine is XX/XX/XX</i>
          </div>
          <i className="text-black self-end">Some copy on the review reward priority stuff</i>
        </div>
        <i>Reward details</i>
        <div className="grid grid-cols-2 gap-5 mt-2 mb-10">
          <input placeholder="Reward token" className="p-3 rounded-lg border" />
          <input placeholder="Reward amount" className="p-3 rounded-lg border" />
          <input placeholder="Override reviewer reward priority" className="p-3 rounded-lg border" />
        </div>
        <i>If updating</i>
        <div className="flex flex-row space-x-5 mt-2">
          <div className="bg-black text-white p-3 rounded-lg basis-1/5 text-center">Cancel topic</div>
          <div className="bg-black text-white p-3 rounded-lg basis-1/5 text-center">Save topic</div>
        </div>
      </div>
    </div>
  );
}

export function UpdateMarketplace() {
  return (
    <div className="space-y-7 bg-gray-200 p-3">
      <i className="text-xl font-semibold">{"Create/Update Marketplace"}</i>
      <input placeholder="Title" className=" text-black p-3 rounded-lg border w-full" />
      <div className="space-y-5">
        <input placeholder="Descriptions" className="text-black p-3 rounded-lg border w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2">
          <label htmlFor="creator" className="text-black self-center">
            Who can create topics:
          </label>
          <input id="creator" placeholder="Start" className="p-3 rounded-lg border w-full" />
        </div>
        <input placeholder="Badger contact address" className="text-black p-3 rounded-lg border w-full" />
        <input placeholder="Token ID" className="text-black p-3 rounded-lg border w-full" />
      </div>
      <div className="space-y-3">
        <input placeholder="Project/Chain (multiselect)" className="text-black p-3 rounded-lg border w-full" />
        <input placeholder="Author reward tokens (multiselect)" className="text-black p-3 rounded-lg border w-full" />
        <input placeholder="Author reward curve" className="text-black p-3 rounded-lg border w-full" />
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5">
          <p className="md:col-span-2">{"Author rep requirement (optional)"}</p>
          <input placeholder="Min" className="p-3 rounded-lg border" />
          <input placeholder="Max" className="p-3 rounded-lg border" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5">
          <p className="md:col-span-2">{"Reviewer rep requirement (optional)"}</p>
          <input placeholder="Min" className="p-3 rounded-lg border" />
          <input placeholder="Max" className="p-3 rounded-lg border" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-5">
        <p className="md:col-span-3">{"Reviewer rep priority"}</p>
        <input placeholder="Cheap" className="p-3 rounded-lg border" />
        <input placeholder="Average" className="p-3 rounded-lg border" />
        <input placeholder="Aggressive" className="p-3 rounded-lg border" />
      </div>
      <p>Explaner on selected priority</p>
      <div className="bg-black text-white p-3 rounded-lg w-1/2 text-center">Save Marketplace</div>
    </div>
  );
}

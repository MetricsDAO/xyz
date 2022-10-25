import { Select, TextInput, Textarea, NativeSelect, NumberInput, Button } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";

export default function CreateTopic() {
  const marketplace = true;

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        <b className="text-3xl font-semibold md:col-span-3">{"Create Topic"}</b>
        <p className="md:col-span-3">
          Crowdsource the best questions for crypto analysts to answer about an important or timely topic. Create and
          incentivize a question brainstorm for any web3 topic to get started.
        </p>
        <Select
          className="text-black rounded-lg basis-full md:col-span-2"
          data={["React", "Angular", "Svelte", "Vue"]}
          placeholder={"Select a marketplace (w/search)"}
          searchable
          clearable
        />
        <button
          className="bg-white text-black border border-[#00C2FF] rounded-md p-3 font-medium"
          disabled={marketplace}
        >
          Create New Marketplace
        </button>
      </div>
      {marketplace ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-5 w-full">
            <TextInput label="Title" placeholder="Name" className=" text-black w-full md:col-span-2" />
            <Textarea
              label="Details"
              placeholder="Enter text here..."
              className="text-black w-full md:col-span-2"
              autosize
              minRows={3}
              maxRows={5}
            />
            <NativeSelect
              className="text-black"
              data={["React", "Angular", "Svelte", "Vue"]}
              placeholder={"Language"}
            />
            <NativeSelect
              className="text-black"
              data={["React", "Angular", "Svelte", "Vue"]}
              placeholder={"Blockchain/Project"}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5">
            <b className="md:col-span-2">When can questions be submitted</b>
            <DatePicker placeholder="Start date" className="w-full" />
            <TimeInput format="12" className="w-full" />
            <DatePicker placeholder="End date" className="w-full" />
            <TimeInput format="12" className="w-full" />
            <i className="md:col-span-2 text-[#858582]">
              {"Authors must claim this topic by {local timestamp} to submit question ideas"}
            </i>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5">
            <b className="md:col-span-2">When must peer review be complete by</b>
            <DatePicker placeholder="Set date" className="w-full" />
            <TimeInput format="12" className="w-full" />
            <i className="md:col-span-2 text-[#858582]">
              {"Reviewers must claim this topic by {local timestamp} to score questions"}
            </i>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5">
            <b className="md:col-span-2">Rewards</b>
            <NativeSelect
              className="text-black"
              label="Reward Token"
              data={["React", "Angular", "Svelte", "Vue"]}
              placeholder={"Token"}
            />
            <NumberInput defaultValue={1} placeholder="Amount" label="Reward Pool" hideControls />
            <i className="md:col-span-2 text-[#858582]">
              {
                "Rewards will be distributed to eligible authors via the {Reward Curve} reward curve set for the marketplace"
              }
            </i>
          </div>
        </div>
      ) : (
        <br />
      )}

      <div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-center mt-2">
          <button className="bg-white text-black border rounded-md p-3 font-medium">Cancel</button>
          <button className="bg-black text-white rounded-md p-3 font-medium">Submit</button>
        </div>
      </div>
    </div>
  );
}

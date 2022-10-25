import { MultiSelect, NativeSelect, NumberInput, Textarea, TextInput } from "@mantine/core";

export function UpdateMarketplace() {
  const delegateCreate = true;

  return (
    <div className="space-y-7 p-3">
      <div className="space-y-3">
        <b className="text-3xl font-semibold">{"Create/Update Marketplace"}</b>
        <p>
          Brainstorm marketplaces empower our community to crowdsource the best questions for crypto analysts to answer.
          Create a marketplace for you and peers to host, incentivize, and engage in brainstorms for any web3 topic.
        </p>
        <TextInput label="Title" placeholder="Marketplace name" className=" text-black w-full" />
        <Textarea
          label="Details"
          placeholder="Enter text here..."
          className="text-black w-full md:col-span-2"
          autosize
          minRows={3}
          maxRows={5}
        />
        <MultiSelect
          data={["React", "Angular", "Svelte", "Vue"]}
          label="Blockchian/Project"
          placeholder="Choose one or more Bloockchain/Project"
        />
        <NativeSelect
          className="text-black"
          label="Control who can create topics"
          data={["React", "Angular", "Svelte", "Vue"]}
        />
        {delegateCreate ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5">
            <p className="text-sm md:col-span-2">Delegates</p>
            <TextInput placeholder="Badger Contact Address" className=" text-black w-full" />
            <TextInput placeholder="Token ID" className=" text-black w-full" />
          </div>
        ) : (
          <></>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5">
          <b className="md:col-span-2">Rewards</b>
          <NativeSelect
            label="Allow Reward Token"
            data={["React", "Angular", "Svelte", "Vue"]}
            placeholder={"Reward Token"}
          />
          <NativeSelect
            label="Reward Curve"
            data={["React", "Angular", "Svelte", "Vue"]}
            placeholder={"Aggressive: Rewards top 10%"}
          />
          <b className="md:col-span-2">{"Control who can submit questions (Optional)"}</b>
          <NumberInput placeholder="xMetric Min" hideControls />
          <NumberInput placeholder="xMetric Max" hideControls />
          <b className="md:col-span-2">{"Control who can peer review questions (Default)"}</b>
          <TextInput placeholder="{Reviewer Badger Contact Address}" className=" text-black w-full" />
          <TextInput placeholder="Token ID" className=" text-black w-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-center">
        <button className="bg-[#16ABDD] text-white rounded-md p-3 font-medium">Create</button>
        <button className="bg-white text-black border rounded-md p-3 font-medium">Cancel</button>
      </div>
    </div>
  );
}

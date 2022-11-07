import { Select, TextInput, Textarea, NativeSelect, NumberInput, Text, Title, Button } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";

export default function CreateChallenge() {
  const marketplace = true;

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        <Title order={2} weight={600} className="md:col-span-3">
          Create Challenge
        </Title>
        <Text className="md:col-span-3">
          Crowdsource the best questions for crypto analysts to answer about an important or timely challenge. Create
          and incentivize a question brainstorm for any web3 challenge to get started.
        </Text>
        <Select
          className="text-black rounded-lg basis-full md:col-span-2"
          data={["React", "Angular", "Svelte", "Vue"]}
          placeholder={"Select a marketplace (w/search)"}
          size="md"
          searchable
          clearable
        />
        <div className="flex flex-row items-center space-x-5">
          <Text>or</Text>
          <Button variant="outline" color="cyan.3" size="md" radius="md" disabled={marketplace}>
            Create New Marketplace
          </Button>
        </div>
      </div>
      {marketplace ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-5 w-full">
            <TextInput label="Title" placeholder="Name" size="md" className=" text-black w-full md:col-span-2" />
            <Textarea
              label="Details"
              size="md"
              placeholder="Enter text here..."
              className="text-black w-full md:col-span-2"
              autosize
              minRows={3}
              maxRows={5}
            />
            <NativeSelect
              className="text-black"
              size="md"
              data={["React", "Angular", "Svelte", "Vue"]}
              placeholder={"Language"}
            />
            <NativeSelect
              className="text-black"
              size="md"
              data={["React", "Angular", "Svelte", "Vue"]}
              placeholder={"Blockchain/Project"}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5">
            <Text weight={500} className="md:col-span-2">
              When can questions be submitted
            </Text>
            <DatePicker placeholder="Start date" size="md" className="w-full" />
            <TimeInput format="12" size="md" className="w-full" />
            <DatePicker placeholder="End date" size="md" className="w-full" />
            <TimeInput format="12" size="md" className="w-full" />
            <Text italic className="md:col-span-2 text-[#858582]">
              Authors must claim this challenge by &#123; local timestamp &#125; to submit question ideas
            </Text>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5">
            <Text weight={500} className="md:col-span-2">
              When must peer review be complete by
            </Text>
            <DatePicker placeholder="Set date" size="md" className="w-full" />
            <TimeInput format="12" size="md" className="w-full" />
            <Text italic className="md:col-span-2 text-[#858582]">
              Reviewers must claim this challenge by &#123;local timestamp &#125; to score questions
            </Text>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5">
            <Text weight={500} size="lg" className="md:col-span-2">
              Rewards
            </Text>
            <NativeSelect
              className="text-black"
              label="Reward Token"
              size="md"
              data={["React", "Angular", "Svelte", "Vue"]}
              placeholder={"Token"}
            />
            <NumberInput defaultValue={1} placeholder="Amount" size="md" label="Reward Pool" hideControls />
            <Text italic className="md:col-span-2 text-[#858582]">
              Rewards will be distributed to eligible authors via the &#123; Reward Curve &#125; reward curve set for
              the marketplace
            </Text>
          </div>
        </div>
      ) : (
        <br />
      )}

      <div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-center mt-2">
          <Button size="md" color="cyan">
            Submit
          </Button>
          <Button variant="default" color="dark" size="md">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

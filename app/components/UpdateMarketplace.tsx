import { MultiSelect, NativeSelect, NumberInput, Textarea, TextInput, Title, Text, Button } from "@mantine/core";

export function UpdateMarketplace({ title }: { title: string }) {
  const delegateCreate = true;

  return (
    <div className="space-y-7 p-3">
      <div className="space-y-3">
        <Title order={2} weight={600}>
          {title + " Marketplace"}
        </Title>
        <Text>
          Brainstorm marketplaces empower our community to crowdsource the best questions for crypto analysts to answer.
          Create a marketplace for you and peers to host, incentivize, and engage in brainstorms for any web3 topic.
        </Text>
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
            <div className="flex flex-row md:col-span-2 space-x-4">
              <Text variant="link" size="sm">
                Launch Badger
              </Text>
              <Text variant="link" size="sm">
                Badger Docs
              </Text>
            </div>
            <Text size="sm" className="md:col-span-2">
              Delegates
            </Text>
            <TextInput placeholder="Badger Contact Address" className=" text-black w-full" />
            <TextInput placeholder="Token ID" className=" text-black w-full" />
          </div>
        ) : (
          <></>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5">
          <Text weight={600} className="md:col-span-2">
            Rewards
          </Text>
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
          <Text weight={600} className="md:col-span-2">
            {"Control who can submit questions (Optional)"}
          </Text>
          <NumberInput placeholder="xMetric Min" hideControls />
          <NumberInput placeholder="xMetric Max" hideControls />
          <Text weight={600} className="md:col-span-2">
            {"Control who can peer review questions (Default)"}
          </Text>
          <TextInput placeholder="{Reviewer Badger Contact Address}" className=" text-black w-full" />
          <TextInput placeholder="Token ID" className=" text-black w-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-center">
        <Button size="md" color="cyan">
          Create
        </Button>
        <Button variant="default" color="dark" size="md">
          Cancel
        </Button>
      </div>
    </div>
  );
}

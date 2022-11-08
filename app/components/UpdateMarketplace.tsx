import { MultiSelect, NativeSelect, NumberInput, Textarea, TextInput, Title, Text, Button } from "@mantine/core";
import { useNavigate } from "@remix-run/react";
import { useWaitForTransaction } from "wagmi";
import { useCreateMarketplace } from "~/hooks/useCreateMarketplace";
import { useForm, zodResolver } from "@mantine/form";
import type { LaborMarketNew } from "~/domain";
import { LaborMarketNewSchema } from "~/domain";
import { useState } from "react";

export function UpdateMarketplace({ title }: { title: string }) {
  const navigate = useNavigate();
  const [marketplace, setMarketplace] = useState<LaborMarketNew>();

  const form = useForm<LaborMarketNew>({
    initialValues: {
      title: "",
      type: "brainstorm",
      // ...
    },
    validate: zodResolver(LaborMarketNewSchema),
  });
  const { data, write } = useCreateMarketplace(marketplace);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      console.log("success", data);
      // 1. create actual marketplace
      // 2. Navigate to details page? Or to marketplace list?
      navigate("/app/brainstorm");
    },
  });

  const onSubmit = () => {
    write?.();
  };

  const onChange = () => {
    const validation = LaborMarketNewSchema.safeParse(form.values);
    if (validation.success) {
      setMarketplace(validation.data);
    }
  };

  const delegateCreate = true;

  return (
    <form onChange={onChange} className="space-y-7 p-3 max-w-3xl mx-auto">
      <p>data {JSON.stringify(data)}</p>
      <p>Is loading {JSON.stringify(isLoading)}</p>
      <p>is Success {JSON.stringify(isSuccess)}</p>
      <div className="space-y-3 mx-auto">
        <Title order={2} weight={600}>
          {title + " Marketplace"}
        </Title>
        <Text>
          Brainstorm marketplaces empower our community to crowdsource the best questions for crypto analysts to answer.
          Create a marketplace for you and peers to host, incentivize, and engage in brainstorms for any web3 challenge.
        </Text>
        <TextInput
          label="Title"
          placeholder="Marketplace name"
          className=" text-black w-full"
          {...form.getInputProps("title")}
        />
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
          label="Control who can create challenges"
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
        <Button size="md" color="cyan" type="button" onClick={onSubmit}>
          Create
        </Button>
        <Button variant="default" color="dark" size="md">
          Cancel
        </Button>
      </div>
    </form>
  );
}

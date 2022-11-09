import {
  Alert,
  Button,
  LoadingOverlay,
  MultiSelect,
  NumberInput,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useNavigate } from "@remix-run/react";
import { useAccount } from "wagmi";
import type { LaborMarketNew } from "~/domain";
import { LaborMarketNewSchema } from "~/domain";
import { useCreateMarketplace } from "~/hooks/useCreateMarketplace";

export function UpdateMarketplace({ title }: { title: string }) {
  const navigate = useNavigate();
  const { isDisconnected, address } = useAccount();

  const form = useForm<Partial<LaborMarketNew>>({
    initialValues: {
      sponsorAddress: address,
      type: "brainstorm",
      launchAccess: "anyone",
    },
    validate: zodResolver(LaborMarketNewSchema),
  });

  const { write, isLoading } = useCreateMarketplace({
    data: form.isValid() ? (form.values as LaborMarketNew) : undefined,
    onTransactionSuccess() {
      navigate("/app/brainstorm");
    },
    onWriteSuccess() {
      // TODO: toast message or some kind of feedback
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(() => {
        write?.();
      })}
      className="space-y-7 p-3 max-w-3xl mx-auto"
    >
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <div className="space-y-3 mx-auto">
        <Title order={2} weight={600}>
          {title + " Marketplace"}
        </Title>
        <Text>
          Brainstorm marketplaces empower our community to crowdsource the best questions for crypto analysts to answer.
          Create a marketplace for you and peers to host, incentivize, and engage in brainstorms for any web3 challenge.
        </Text>
        <TextInput label="Title" placeholder="Marketplace name" {...form.getInputProps("title")} />
        <Textarea
          label="Details"
          placeholder="Enter text here..."
          minRows={3}
          maxRows={5}
          {...form.getInputProps("description")}
        />
        <MultiSelect
          data={[
            { label: "Ethereum", value: "id-1" },
            { label: "Polygon", value: "id-2" },
          ]}
          label="Blockchain/Project"
          placeholder="Choose one or more Bloockchain/Project"
          {...form.getInputProps("projectIds")}
        />
        <Select
          defaultValue="Anyone"
          className="text-black"
          label="Control who can create challenges"
          data={[
            { label: "Anyone", value: "anyone" },
            { label: "Delegates only", value: "delegates" },
          ]}
          {...form.getInputProps("launchAccess")}
        />
        {form.values.launchAccess === "delegates" && (
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
            <TextInput
              placeholder="Badger Contact Address"
              className=" text-black w-full"
              {...form.getInputProps("launchBadgerAddress")}
            />
            <TextInput
              placeholder="Token ID"
              className=" text-black w-full"
              {...form.getInputProps("launchBadgerTokenId")}
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5">
          <Text weight={600} className="md:col-span-2">
            Rewards
          </Text>
          <MultiSelect
            label="Allow Reward Token"
            data={[
              { label: "Ethereum", value: "ethereum" },
              { label: "Solana", value: "solana" },
            ]}
            placeholder={"Reward Token"}
            {...form.getInputProps("tokenSymbols")}
          />
          <Select
            label="Reward Curve"
            data={[{ label: "Default", value: "0x" }]}
            placeholder={"Aggressive: Rewards top 10%"}
            {...form.getInputProps("rewardCurveAddress")}
          />
          <Text weight={600} className="md:col-span-2">
            {"Control who can submit questions (Optional)"}
          </Text>
          <NumberInput placeholder="xMetric Min" hideControls {...form.getInputProps("submitRepMin")} />
          <NumberInput placeholder="xMetric Max" hideControls {...form.getInputProps("submitRepMax")} />
          <Text weight={600} className="md:col-span-2">
            {"Control who can peer review questions (Default)"}
          </Text>
          <TextInput
            placeholder="{Reviewer Badger Contact Address}"
            className=" text-black w-full"
            {...form.getInputProps("reviewBadgerAddress")}
          />
          <TextInput
            placeholder="Token ID"
            className=" text-black w-full"
            {...form.getInputProps("reviewBadgerTokenId")}
          />
        </div>
      </div>
      {isDisconnected && (
        <Alert color="red" variant="outline" title="Disconnected">
          Please connect wallet
        </Alert>
      )}
      <div className="flex flex-col sm:flex-row gap-5">
        <Button size="md" color="brand.5" type="submit" disabled={isDisconnected}>
          Create
        </Button>
        <Button variant="default" color="dark" size="md">
          Cancel
        </Button>
      </div>
    </form>
  );
}

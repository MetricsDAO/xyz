import { Button, Text, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import type { LaborMarketNew } from "~/domain";
import { LaborMarketNewSchema } from "~/domain";

const DEV_TEST_CONTRACT_ADDRESS = "0xd138D0B4F007EA66C8A8C0b95E671ffE788aa6A9";

export function UpdateMarketplace({ title }: { title: string }) {
  const navigate = useNavigate();

  const form = useForm<LaborMarketNew>({
    initialValues: {
      title: "",
    },
    validate: zodResolver(LaborMarketNewSchema),
  });

  const { config } = usePrepareContractWrite({
    address: DEV_TEST_CONTRACT_ADDRESS,
    abi: [
      {
        inputs: [{ internalType: "uint256", name: "_num", type: "uint256" }],
        name: "test",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "test",
    enabled: form.isValid(),
    args: form.isValid() ? [BigNumber.from(form.values.title.charCodeAt(0))] : [BigNumber.from(0)], //mocking
  });

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onError(error) {
      console.log("error", error);
    },
    onSuccess(data) {
      console.log("success", data);
      // 1. (for test/dev) create marketplace in Prisma
      // 2. Navigate to details page? Or to marketplace list?
      navigate("/app/brainstorm");
    },
  });

  const onCreate = () => {
    write?.();
  };

  return (
    <form className="space-y-7 p-3 max-w-3xl mx-auto">
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-center">
        <Button size="md" color="cyan" type="button" onClick={onCreate}>
          Create
        </Button>
        <Button variant="default" color="dark" size="md">
          Cancel
        </Button>
      </div>
    </form>
  );
}

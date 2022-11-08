import { Button, Text, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useNavigate } from "@remix-run/react";
import { useWaitForTransaction } from "wagmi";
import type { LaborMarketNew } from "~/domain";
import { LaborMarketNewSchema } from "~/domain";
import { useCreateMarketplace } from "~/hooks/useCreateMarketplace";

export function UpdateMarketplace({ title }: { title: string }) {
  const navigate = useNavigate();

  const form = useForm<LaborMarketNew>({
    initialValues: {
      title: "",
    },
    validate: zodResolver(LaborMarketNewSchema),
  });

  const { data, write } = useCreateMarketplace(form);

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

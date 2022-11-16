import { useAccount } from "wagmi";
import { useControlField } from "remix-validated-form";
import { ValidatedInput } from "./Input";
import { ValidatedTextarea } from "./Textarea";
import { ValidatedSelect } from "./Select";
import { ValidatedCombobox } from "./Combobox";
import type { Project, Token } from "@prisma/client";

export function MarketplaceForm({ projects, tokens }: { projects: Project[]; tokens: Token[] }) {
  const { isDisconnected } = useAccount();

  const [launchAccess] = useControlField("launchAccess");

  return (
    <div className="space-y-10 py-5">
      <section className="space-y-1">
        <p className="text-cyan-500 text-lg">
          Crowdsource the best questions for crypto analysts to answer about any web3 topic
        </p>
        <p className="text-sm text-gray-500">
          Control challenge permissions, set up token and blockchain/project allowlists for challenges, and define
          reward curves
        </p>
      </section>

      <ValidatedInput
        label="Challenge Marketplace Title"
        type="text"
        name="title"
        placeholder="e.g Solana Breakpoint 2023"
      />

      <ValidatedTextarea
        label="Details"
        name="description"
        placeholder="What's the goal of this challenge marketplace?"
        rows={7}
      />

      <ValidatedCombobox
        label="Blockchain/Project(s)"
        name="projectIds"
        options={projects.map((p) => ({ label: p.name, value: p.id }))}
      />

      <section className="space-y-4">
        <h4 className="font-semibold">Who has permission to launch challenges?</h4>
        <ValidatedSelect
          name="launchAccess"
          options={[
            { value: "anyone", label: "Anyone" },
            { value: "delegates", label: "Delegates Only" },
          ]}
        />

        {launchAccess === "delegates" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ValidatedInput label="Badger Contract Address" name="launchBadgerAddress" />
            <ValidatedInput label="Badger Token ID" name="launchBadgerTokenId" />
          </div>
        ) : null}
      </section>

      <section>
        <h4 className="font-semibold mb-4">Challenge Rewards</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ValidatedCombobox
            label="Reward Token Allowlist"
            name="tokenSymbols"
            options={tokens.map((t) => ({ value: t.symbol, label: t.name }))}
          />
          <ValidatedSelect
            label="Reward Curve"
            name="rewardCurveAddress"
            options={[{ value: "linear", label: "Linear" }]}
          />
        </div>
      </section>

      <section>
        <h4 className="font-semibold mb-4">Control who hass permission to submit on challenges</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ValidatedInput label="Minimum rMETRIC Balance" name="submitRepMin" />
          <ValidatedInput label="Maximum rMETRIC Balance" name="submitRepMax" />
        </div>
      </section>

      <section>
        <h4 className="font-semibold mb-4">Control who has permission to review challenge submissions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ValidatedInput label="Reviewer Badger Contract Address" type="text" name="reviewBadgerAddress" />
          <ValidatedInput label="Reviewer Badger Token ID" type="text" name="reviewBadgerTokenId" />
        </div>
      </section>
    </div>
  );
}

// function ConfirmTransaction({ laborMarket, onCancel }: { laborMarket?: LaborMarketPrepared; onCancel: () => void }) {
//   invariant(laborMarket, "laborMarket is required"); // this should never happen but just in case

//   const navigate = useNavigate();

//   const { write, isLoading } = useCreateMarketplace({
//     data: laborMarket,
//     onTransactionSuccess() {
//       navigate("/app/brainstorm");
//     },
//     onWriteSuccess() {
//       // TODO: toast message or some kind of feedback
//     },
//   });

//   return (
//     <div className="space-y-8">
//       <Title>Confirm Transaction</Title>
//       <Text>Please confirm that you would like to create a new marketplace.</Text>
//       <div className="flex flex-col sm:flex-row justify-center gap-5">
//         <Button size="md" color="brand.5" type="button" onClick={() => write?.()} loading={isLoading}>
//           Create
//         </Button>
//         <Button variant="default" color="dark" size="md" onClick={onCancel}>
//           Cancel
//         </Button>
//       </div>
//     </div>
//   );
// }

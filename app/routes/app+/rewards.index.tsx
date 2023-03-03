import { Link, useSubmit } from "@remix-run/react";
import { useRef } from "react";
import { Checkbox } from "~/components/checkbox";
import { Pagination } from "~/components/pagination/pagination";
import { Modal } from "~/components/modal";
import { ValidatedInput } from "~/components/input";
import { Button } from "~/components/button";
import { useState } from "react";
import { ValidatedCombobox } from "~/components/combobox";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { Container } from "~/components/container";
import RewardsTab from "~/features/rewards-tab";
import { Card } from "~/components/card";
import { dateHasPassed, fromNow } from "~/utils/date";
import { Header, Table, Row } from "~/components/table";
import { CheckCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { getUser } from "~/services/session.server";
import { findAllWalletsForUser } from "~/services/wallet.server";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { createBlockchainTransactionStateMachine } from "~/utils/machine";
import type { ClaimRewardContractData } from "~/hooks/use-claim-reward";
import { useMachine } from "@xstate/react";
import { ClaimRewardWeb3Button } from "~/features/web3-button/claim-reward";
import invariant from "tiny-invariant";
import type { SendTransactionResult } from "@wagmi/core";
import { defaultNotifyTransactionActions } from "~/features/web3-transaction-toasts";
import { searchUserSubmissions } from "~/services/submissions.server";
import type { CombinedDoc } from "~/domain/submission";
import { RewardsSearchSchema } from "~/domain/submission";
import { Field, Label, ValidatedSelect } from "~/components";
import { listTokens } from "~/services/tokens.server";
import type { Token, Wallet } from "@prisma/client";
import { getParamsOrFail } from "remix-params-helper";
import { fromTokenAmount, toNetworkName, toTokenAbbreviation } from "~/utils/helpers";
import type { EthersError } from "~/features/web3-button/types";
import { RPCError } from "~/features/rpc-error";
import { useGetReward } from "~/hooks/use-get-reward";
import { useHasPerformed } from "~/hooks/use-has-performed";
import { RewardBadge } from "~/components/reward-badge";

const validator = withZod(RewardsSearchSchema);

export const loader = async ({ request }: DataFunctionArgs) => {
  const user = await getUser(request);
  invariant(user, "Could not find user, please sign in");
  const url = new URL(request.url);
  const search = getParamsOrFail(url.searchParams, RewardsSearchSchema);
  const wallets = await findAllWalletsForUser(user.id);
  const rewards = await searchUserSubmissions({ ...search, serviceProvider: user.address });
  const tokens = await listTokens();
  return typedjson({
    wallets,
    rewards,
    user,
    tokens,
    search,
  });
};

export default function Rewards() {
  const { wallets, rewards, tokens, search } = useTypedLoaderData<typeof loader>();
  const reviewedRewards = rewards.filter((r) => r.sr[0] && dateHasPassed(r.sr[0].configuration.enforcementExpiration));

  return (
    <Container className="py-16 px-10">
      <section className="space-y-2 max-w-3xl mb-16">
        <h1 className="text-3xl font-semibold">Rewards</h1>
        <div>
          <p className="text-lg text-cyan-500">Claim reward tokens for all the challenges you’ve won</p>
          <p className="text-gray-500 text-sm">
            View all your pending and claimed rewards and manage all your payout addresses
          </p>
        </div>
      </section>
      <RewardsTab rewardsNum={reviewedRewards.length} addressesNum={wallets.length} />
      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
        <main className="flex-1">
          <div className="space-y-5">
            <RewardsListView rewards={reviewedRewards} wallets={wallets} tokens={tokens} />
            <div className="w-fit m-auto">
              <Pagination page={search.page} totalPages={Math.ceil(reviewedRewards.length / search.first)} />
            </div>
          </div>
        </main>
        <aside className="md:w-1/4 lg:md-1/5">
          <SearchAndFilter tokens={tokens} />
        </aside>
      </section>
    </Container>
  );
}

function RewardsListView({ rewards, wallets, tokens }: { rewards: CombinedDoc[]; wallets: Wallet[]; tokens: Token[] }) {
  if (rewards.length === 0) {
    return (
      <div className="flex">
        <p className="text-gray-500 mx-auto py-12">Participate in Challenges and start earning!</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <RewardsTable rewards={rewards} wallets={wallets} tokens={tokens} />
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <RewardsCards rewards={rewards} wallets={wallets} tokens={tokens} />
      </div>
    </>
  );
}

function RewardsTable({ rewards, wallets, tokens }: { rewards: CombinedDoc[]; wallets: Wallet[]; tokens: Token[] }) {
  return (
    <Table>
      <Header columns={12} className="mb-2">
        <Header.Column span={3}>Challenge Title</Header.Column>
        <Header.Column span={3}>Reward</Header.Column>
        <Header.Column span={2}>Submitted</Header.Column>
        <Header.Column span={3}>Rewarded</Header.Column>
        <Header.Column>Status</Header.Column>
      </Header>
      {rewards.map((r) => {
        return (
          <RewardsTableRow
            key={`${r.id}${r.serviceRequestId}${r.laborMarketAddress}`}
            reward={r}
            wallets={wallets}
            tokens={tokens}
          />
        );
      })}
    </Table>
  );
}

function RewardsTableRow({ reward, wallets, tokens }: { reward: CombinedDoc; wallets: Wallet[]; tokens: Token[] }) {
  const contractReward = useGetReward({
    laborMarketAddress: reward.laborMarketAddress as `0x${string}`,
    submissionId: reward.id,
  });
  const hasClaimed = useHasPerformed({
    laborMarketAddress: reward.laborMarketAddress as `0x${string}`,
    id: reward.id,
    action: "HAS_CLAIMED",
  });
  const token = tokens.find((t) => t.contractAddress === reward.sr[0]?.configuration.pToken);
  const showReward = contractReward !== undefined && hasClaimed === false;
  const showRewarded = contractReward !== undefined && hasClaimed === true;

  return (
    <Row columns={12}>
      <Row.Column span={3}>
        <p>{reward.sr[0]?.appData?.title}</p>
      </Row.Column>
      <Row.Column span={3}>
        {showReward ? (
          <RewardBadge
            amount={fromTokenAmount(contractReward[0].toString())}
            token={token?.symbol ?? "Unknown Token"}
            rMETRIC={contractReward[1].toNumber()}
          />
        ) : (
          <span>--</span>
        )}
      </Row.Column>
      <Row.Column span={2} className="text-black">
        {fromNow(reward.createdAtBlockTimestamp)}{" "}
      </Row.Column>
      <Row.Column span={3} className="text-black" color="dark.3">
        {showRewarded ? (
          <RewardBadge
            amount={fromTokenAmount(contractReward[0].toString())}
            token={token?.symbol ?? "Unknown Token"}
            rMETRIC={contractReward[1].toNumber()}
          />
        ) : (
          <span>--</span>
        )}
      </Row.Column>
      <Row.Column>
        {hasClaimed === false ? (
          <ClaimButton reward={reward} wallets={wallets} tokens={tokens} />
        ) : hasClaimed === true ? (
          <span>Claimed</span>
        ) : (
          <></>
        )}
      </Row.Column>
    </Row>
  );
}

function RewardsCards({ rewards, wallets, tokens }: { rewards: CombinedDoc[]; wallets: Wallet[]; tokens: Token[] }) {
  return (
    <div className="space-y-4">
      {rewards.map((r) => {
        return <RewardCard key={`${r.laborMarketAddress}_${r.id}`} reward={r} wallets={wallets} tokens={tokens} />;
      })}
    </div>
  );
}

function RewardCard({ reward, wallets, tokens }: { reward: CombinedDoc; wallets: Wallet[]; tokens: Token[] }) {
  const contractReward = useGetReward({
    laborMarketAddress: reward.laborMarketAddress as `0x${string}`,
    submissionId: reward.id,
  });
  const hasClaimed = useHasPerformed({
    laborMarketAddress: reward.laborMarketAddress as `0x${string}`,
    id: reward.id,
    action: "HAS_CLAIMED",
  });
  const token = tokens.find((t) => t.contractAddress === reward.sr[0]?.configuration.pToken);
  const showReward = contractReward !== undefined && hasClaimed === false;
  const showRewarded = contractReward !== undefined && hasClaimed === true;
  return (
    <Card className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-2 py-5">
      <div>Challenge Title</div>
      <p>{reward.sr[0]?.appData?.title}</p>
      <div>Reward</div>
      <div>
        {showReward ? (
          <RewardBadge
            amount={fromTokenAmount(contractReward[0].toString())}
            token={token?.symbol ?? "Unknown Token"}
            rMETRIC={contractReward[1].toNumber()}
          />
        ) : (
          <span>--</span>
        )}
      </div>
      <div>Submitted</div>
      <p className="text-black">{fromNow(reward.createdAtBlockTimestamp)} </p>
      <div>Rewarded</div>
      <div className="text-black" color="dark.3">
        {showRewarded ? (
          <RewardBadge
            amount={fromTokenAmount(contractReward[0].toString())}
            token={token?.symbol ?? "Unknown Token"}
            rMETRIC={contractReward[1].toNumber()}
          />
        ) : (
          <span>--</span>
        )}
      </div>
      <div>Status</div>
      {hasClaimed === false ? (
        <ClaimButton reward={reward} wallets={wallets} tokens={tokens} />
      ) : hasClaimed === true ? (
        <span>Claimed</span>
      ) : (
        <></>
      )}
    </Card>
  );
}

const machine = createBlockchainTransactionStateMachine<ClaimRewardContractData>();
function ClaimButton({ reward, wallets, tokens }: { reward: CombinedDoc; wallets: Wallet[]; tokens: Token[] }) {
  const [confirmedModalOpen, setConfirmedModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const tokenAbrev = toTokenAbbreviation(reward.sr[0]?.configuration.pToken ?? "", tokens);
  const networkName = toNetworkName(reward.sr[0]?.configuration.pToken ?? "", tokens);
  const wallet = wallets.find((w) => w.networkName === networkName);

  const [state, send] = useMachine(
    machine.withContext({
      contractData: {
        laborMarketAddress: reward.laborMarketAddress,
        payoutAddress: wallet?.address ?? "",
        submissionId: reward.id,
      },
    }),
    {
      actions: {
        ...defaultNotifyTransactionActions,
      },
    }
  );
  invariant(state.context.contractData, "Contract data should be defined");

  const onWriteSuccess = (result: SendTransactionResult) => {
    transitionModal();
    send({ type: "SUBMIT_TRANSACTION", transactionHash: result.hash, transactionPromise: result.wait(1) });
  };

  function transitionModal() {
    closeConfirmedModal();
    openSuccessModal();
  }

  function openConfirmedModal() {
    setConfirmedModalOpen(true);
  }

  function closeConfirmedModal() {
    setConfirmedModalOpen(false);
  }

  function openSuccessModal() {
    setSuccessModalOpen(true);
  }

  function closeSuccessModal() {
    setSuccessModalOpen(false);
  }

  const [error, setError] = useState<EthersError>();
  const onPrepareTransactionError = (error: EthersError) => {
    setError(error);
  };

  return (
    <>
      <Button onClick={openConfirmedModal}>Claim</Button>
      <Modal isOpen={confirmedModalOpen} onClose={closeConfirmedModal} title="Claim your reward!">
        {wallet ? (
          <div className="space-y-5 mt-5">
            <div className="space-y-2">
              <div className="flex items-center">
                <img alt="" src="/img/trophy.svg" className="h-8 w-8" />
                <p className="text-yellow-700 text-2xl ml-2">{`todo ${tokenAbrev}`}</p>
              </div>
              <div className="flex border-solid border rounded-md border-trueGray-200">
                <p className="text-sm font-semiboldborder-solid border-0 border-r border-trueGray-200 p-3">
                  {networkName}
                </p>
                <div className="flex items-center p-3">
                  <CheckCircleIcon className="mr-1 text-lime-500 h-5 w-5" />
                  <p className="text-sm text-gray-600">
                    {wallet?.address && wallet?.address.length < 30
                      ? wallet?.address
                      : `${wallet?.address.slice(0, 16)}...${wallet?.address.slice(-14)}`}
                  </p>
                </div>
              </div>
              <p className="text-xs">
                To change or update this address head to{" "}
                <Link to="/app/rewards/addresses" className="text-blue-600">
                  Payout Addresses
                </Link>
              </p>
            </div>
            {error && <RPCError error={error} />}
            <div className="flex gap-2 justify-end">
              <Button variant="cancel" onClick={closeConfirmedModal}>
                Cancel
              </Button>
              {!error && (
                <ClaimRewardWeb3Button
                  data={state.context.contractData}
                  onWriteSuccess={onWriteSuccess}
                  onPrepareTransactionError={onPrepareTransactionError}
                />
              )}
            </div>
          </div>
        ) : (
          <p className="my-5">
            No address found for <b>{networkName}</b>. To add an address head to{" "}
            <Link to="/app/rewards/addresses" className="text-blue-600">
              Payout Addresses
            </Link>
          </p>
        )}
      </Modal>
      <Modal isOpen={successModalOpen} onClose={closeSuccessModal}>
        <div className="mx-auto space-y-7">
          <img src="/img/check-circle.svg" alt="" className="mx-auto" />
          <div className="space-y-2">
            <h1 className="text-center text-2xl font-semibold">Claim proccessing</h1>
            <p className="text-gray-500 text-center text-md">
              {"This transaction could take up to {x amount of time}. Please check back in a bit."}
            </p>
            <p className="text-gray-500 text-center text-sm">{"If there are any issues please reach out on Discord"}</p>
          </div>
          <div className="flex gap-2 w-full">
            <Button variant="cancel" fullWidth onClick={closeSuccessModal}>
              Cancel
            </Button>
            <Button fullWidth onClick={closeSuccessModal}>
              Got it
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function SearchAndFilter({ tokens }: { tokens: Token[] }) {
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = () => {
    if (formRef.current) {
      submit(formRef.current, { replace: true });
    }
  };
  return (
    <ValidatedForm
      formRef={formRef}
      method="get"
      validator={validator}
      onChange={handleChange}
      className="space-y-3 p-3 border-[1px] border-solid border-gray-100 rounded-md bg-blue-300 bg-opacity-5"
    >
      <ValidatedInput
        placeholder="Search"
        name="q"
        iconRight={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
      />
      <Field>
        <Label>Sort by</Label>
        <ValidatedSelect
          placeholder="Select option"
          name="sortBy"
          size="sm"
          onChange={handleChange}
          options={[
            { label: "Challenge Title", value: "sr[0].appData.title" },
            { label: "Submitted", value: "createdAtBlockTimestamp" },
          ]}
        />
      </Field>
      <p className="text-lg font-semibold">Filter:</p>
      <Label size="md">Status</Label>
      <Checkbox value="unclaimed" label="Unclaimed" />
      <Checkbox value="claimed" label="Claimed" />
      <Label>Reward Token</Label>
      <ValidatedCombobox
        placeholder="Select option"
        name="token"
        onChange={handleChange}
        size="sm"
        options={tokens.map((t) => ({ label: t.name, value: t.contractAddress }))}
      />
      {/* TODO: Hidden until joins <Label>Challenge Marketplace</Label>
      <Combobox
        placeholder="Select option"
        options={[
          { label: "Solana", value: "Solana" },
          { label: "Ethereum", value: "Ethereum" },
        ]}
      />*/}
    </ValidatedForm>
  );
}

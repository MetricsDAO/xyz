import type { Project, Token } from "database";
import { Button } from "../../components/button";
import { useNavigate, useParams } from "@remix-run/react";
import { FormProvider, useForm } from "react-hook-form";
import type { LaborMarketFormValues } from "./labor-market-creator-values";
import { LaborMarketFormValuesSchema } from "./labor-market-creator-values";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LaborMarket,
  LaborMarketNetwork,
  ReputationModule,
  ReputationToken,
  ScalableLikertEnforcement,
} from "labor-markets-abi";
import { LaborMarketCreatorFields } from "./labor-market-creator-fields";
import { BigNumber, ethers } from "ethers";
import { REPUTATION_REWARD_POOL, REPUTATION_REVIEW_SIGNAL_STAKE, REPUTATION_TOKEN_ID } from "~/utils/constants";
import type { EvmAddress } from "~/domain/address";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { LaborMarketNetwork__factory } from "~/contracts";
import { useCallback } from "react";

interface LaborMarketFormProps {
  projects: Project[];
  tokens: Token[];
  defaultValues?: LaborMarketFormValues;
}

/**
 * Filters and parses the logs for a specific event.
 */
function getEventFromLogs(iface: ethers.utils.Interface, logs: ethers.providers.Log[], eventName: string) {
  return logs
    .filter((log) => log.address === LaborMarketNetwork.address)
    .map((log) => iface.parseLog(log))
    .find((e) => e.name === eventName);
}

export function LaborMarketCreator({ projects, tokens, defaultValues }: LaborMarketFormProps) {
  const { mType } = useParams();

  const methods = useForm<LaborMarketFormValues>({
    resolver: zodResolver(LaborMarketFormValuesSchema),
    defaultValues,
  });

  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        const iface = LaborMarketNetwork__factory.createInterface();
        const event = getEventFromLogs(iface, receipt.logs, "LaborMarketCreated");
        if (event) navigate(`/app/market/${event.args["marketAddress"]}`);
      },
      [navigate]
    ),
  });

  const onSubmit = (values: LaborMarketFormValues) => {
    transactor.start({
      metadata: values.appData,
      config: ({ account, cid }) => configureFromValues({ owner: account, cid, values }),
    });
  };

  return (
    <FormProvider {...methods}>
      <TxModal transactor={transactor} />
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-10 py-5">
        <LaborMarketCreatorFields projects={projects} type={mType} />
        <Button size="lg" type="submit">
          Next
        </Button>
      </form>
    </FormProvider>
  );
}

function configureFromValues({
  owner,
  cid,
  values,
}: {
  owner: EvmAddress;
  cid: string;
  values: LaborMarketFormValues;
}) {
  return configureWrite({
    abi: LaborMarketNetwork.abi,
    address: LaborMarketNetwork.address,
    functionName: "createLaborMarket",
    args: [
      LaborMarket.address,
      {
        marketUri: cid,
        owner: owner as `0x${string}`,
        modules: {
          network: LaborMarketNetwork.address,
          reputation: ReputationModule.address,
          enforcement: ScalableLikertEnforcement.address,
          enforcementKey: ethers.utils.formatBytes32String("aggressive") as `0x${string}`,
        },
        delegateBadge: {
          token: values.configuration.delegateBadge.token as `0x${string}`,
          tokenId: BigNumber.from(values.configuration.delegateBadge.tokenId),
        },
        maintainerBadge: {
          token: values.configuration.maintainerBadge.token as `0x${string}`,
          tokenId: BigNumber.from(values.configuration.maintainerBadge.tokenId),
        },
        reputationBadge: {
          token: ReputationToken.address,
          tokenId: BigNumber.from(REPUTATION_TOKEN_ID),
        },
        reputationParams: {
          rewardPool: BigNumber.from(REPUTATION_REWARD_POOL),
          reviewStake: BigNumber.from(REPUTATION_REVIEW_SIGNAL_STAKE),
          provideStake: BigNumber.from(REPUTATION_REVIEW_SIGNAL_STAKE),
          submitMin: BigNumber.from(values.configuration.reputationParams.submitMin),
          submitMax: BigNumber.from(values.configuration.reputationParams.submitMax ?? ethers.constants.MaxUint256),
        },
      },
    ],
  });
}

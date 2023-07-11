import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/dist/providers/public";
import { mainnet, polygon } from "wagmi/chains";

const { chains, provider } = configureChains([polygon, mainnet], [publicProvider()]);
const { connectors } = getDefaultWallets({
  appName: "MetricsDAO",
  chains,
});

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export { client };

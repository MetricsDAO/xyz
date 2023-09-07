import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/dist/providers/public";
import { mainnet, polygon } from "wagmi/chains";

const { chains, provider } = configureChains([polygon, mainnet], [publicProvider()]);
const { connectors } = getDefaultWallets({
  appName: "MetricsDAO",
  projectId: "ff1ff238a25c6800e3c8c08f5b848ef7",
  chains,
});

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export { chains, client };

import { ethers } from "ethers";
import env from "~/env";

export const nodeProvider = new ethers.providers.JsonRpcProvider(env.QUICKNODE_URL);

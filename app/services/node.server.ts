import { ethers } from "ethers";
import env from "~/env.server";

export const nodeProvider = new ethers.providers.JsonRpcProvider(env.QUICKNODE_URL);

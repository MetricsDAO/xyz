//import { useLoaderData } from "remix";
import { redirect } from "@remix-run/node";

import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";


export async function loader() {
    return redirect("/");
    // let contractData;
    // const network = process.env.NETWORK || "localhost";
    // try {
    //     contractData = require(`core-evm-contracts/deployments/${network}/TopChef.json`);
    // } catch (error) {
    //     console.log("ERROR", error);
    //     contractData = null;
    // }
    // return contractData;
}

export default function Index() {
    // const data = useLoaderData();

    return (
    <WalletProvider>
        <Wrapper>
            <h1>Staking Page</h1>
        </Wrapper>
    </WalletProvider>   
    )
}
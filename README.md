# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Deployment

After having run the `create-remix` command and selected "Vercel" as a deployment target, you only need to [import your Git repository](https://vercel.com/new) into Vercel, and it will be deployed.

If you'd like to avoid using a Git repository, you can also deploy the directory by running [Vercel CLI](https://vercel.com/cli):

```sh
npm i -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will then automatically be deployed by Vercel, through its [Git Integration](https://vercel.com/docs/concepts/git).

## Development

To run your Remix app locally, make sure your project's local dependencies are installed:

```sh
npm install
```

Afterwards, start the Remix development server like so:

```sh
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

If you're used to using the `vercel dev` command provided by [Vercel CLI](https://vercel.com/cli) instead, you can also use that, but it's not needed.  

## TroubleShooting  
when setting up first time you may need to run `npm run dev:css` before running npm run dev

## Claiming and Staking dAPP IN XYZ    
in core-evm-contracts repo run in a terminal  
`npx hardhat node`    
This will run an ethereum blockchain node on your local computer  
make sure you have hardhat with chain id 31337 configured in a wallet  
since we have hardhat deploy package the above command will deploy contracts in your deploy folder automatically    
There are 19 public and private keys assocated with the hardhat network - save these you'll need them  
You'll see some json file in source control changed.
For Local testing you can either use npm link (more on that later) or temporarily  
Create a test branch and push that branch and reference that in your package.json in xyz repo example below notice after hash symbol
`"core-evm-contracts": "git+https://github.com/MetricsDAO/core-evm-contracts.git#testBranchforXyz",`  

Now switch to XYZ Repo  
`npm install`  
this will install core-evm-contracts json files as an npm package  
now if you look in allocationGroups.json file  
it's an array of 4 objects assocated with Accounts 16, 17, 18, 19 in hardhat node  
this will be imported to allocationAssigner now run in the comman line in a new terminal
`node protocol-scripts/allocationAssigner.js`  
If you go back to core-evm-contracts - you should see in the terminal the calls made to allocation Groups  
Now in a seperate terminal run  
`npm run dev`  
now open browser to http://localhost:3000/claim  
connect wallet to account that has allocated metric  
You should see message Eligible for Vesting statement  
Switch account to a non allocated group and you should see not eligible  


using IPFS package node has to be > 15 to using 16.16  
TODO update using .nvmrc file  

## Create Questions and View Questions/Upvote  
Run same steps in core-evm-contracts as claiming and staking then switch to XYZ  
Make sure you clear/reset accounts in Metamask  
Run this command  
`node protocol-scripts/assignxMETRIC.js`  
Now in a seperate terminal run  
`npm run dev`  
visit http://localhost:3000/question-generation to generate questions  
In upper left hand corner you should see view all questions link  

BANDAID - currently copying files from node_modules/core-evm-contracts/deployments to app/evm-contracts


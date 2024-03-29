import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import clsx from "clsx";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { getMDXContent } from "~/utils/mdx.server";

export const loader: LoaderFunction = async () => {
  const { code, frontmatter } = await getMDXContent(mdxSource);
  return { code, frontmatter };
};

export default function Whitepaper() {
  const { code } = useLoaderData<typeof loader>();

  const Component = useMemo(() => getMDXComponent(code), [code]);

  const classes = clsx(
    "prose-base",
    "prose-ol:list-decimal",
    "prose-headings:font-extrabold",
    "prose-a:text-blue-600 prose-a:font-medium prose-a:underline",
    "prose-td:border-t prose-td:p-2",
    "prose-p:text-gray-600 prose-p:text-medium",
    "container max-w-3xl mx-auto py-10"
  );
  return (
    <div className={classes}>
      <Component />
    </div>
  );
}

const mdxSource = `
# MetricsDAO

White Paper - Version 2.0

January 2023

CHANCE* Drake Danner† Meg Lister†

MetricsDAO unites analysts in a service DAO to provide on-demand data analytics using a scalable system enabled by on-chain primitives and democratized access to experts.

## Why MetricsDAO?

Data-driven insights impact decisions and success. The growth of the most successful Web2 organizations has been driven by readily available, queryable data, and mighty internal analytics organizations to make sense of it. This will be especially critical for Web3 organizations - without high-quality data, communities fail to launch, protocols fail to grow, and blockchains fail to succeed. Traditional methods of analytics, however, fail to move at the pace or capture the breadth of knowledge that every Web3 organization will need to succeed.

We believe that a Service DAO is uniquely capable of providing this specialized service to other Web3 organizations. Service DAOs are an opportunity to reinvent the Web2 gig economy by creating transparent and fair relationships between freelance workers and organizations. They provide a home for the most talented analysts to collaborate, compete, and thrive, and offer the structure needed to efficiently deliver high-quality insights to partners.

Using an EVM protocol powered by Localized Liquid Labor Markets, [Badger](https://trybadger.com), and Cross Chain Payments, MetricsDAO enables aligned incentives and managed participant reputation to facilitate services in a scalable and decentralized manner.

### Why Analysts Benefit from MetricsDAO

Analysts often face artificial financial and geographic constraints in their careers. Unequal distribution of resources keeps quality analysts from being discovered, leading them to be passed over for a small selection of highly-priced consulting groups that may or may not actually provide greater value.

MetricsDAO democratizes analytics by removing barriers to participation and providing mechanisms for analysts to earn partner payment tokens, $METRIC, and to increase their reputation in the MetricsDAO ecosystem. Ongoing engagement and positive contributions increase an analyst's access to future opportunities.

In addition to facilitating insight production, MetricsDAO provides a data-agnostic community for analysts to network and grow within. Analysts may use MetricsDAO to begin their analytics journey, to find a full-time position, or as their main source of income.

### Why Clients Benefit from MetricsDAO

Data is critical to every organization's decision-making process. In order to be useful, data often needs to be analyzed through a series of processes that are complex, time-consuming, and difficult. Additionally, data needs are in constant flux, as new protocols, frameworks, and relationships emerge overnight — and often require immediate attention.

By partnering with MetricsDAO, clients are able to access the world's first analytics-focused Liquid Labor Market. Through a modular system that allows a variety of participant behaviors to be solicited, partners can access analytics talent at a fair market price.

## How MetricsDAO Works

MetricsDAO provides a modular three-step process for the delivery of client requests. Each step works as a distinct component of on-demand analytics and serves a unique purpose depending on the desired outcomes.

1. **Community Brainstorming**

   _Engage & Educate_

   Ask the broader community what analytics they would like to see created or finalize specifications for a piece of work. Anyone can submit questions and/or prioritize others' so that the most relevant prompts are prioritized, and spam is filtered out.

   The goal of the Community Brainstorming Component is to drive engagement with the broader community: to understand what is currently relevant, confusing, or worrisome to them. Rewarding participants in this module incentivizes newcomers to learn how your protocol works and ensures the best ideas to rise to the top.

2. **Analytics**

   _Generate Insights_

   Tap MetricsDAO's community of analysts to create the analytics, tooling, and content you need. With this component, organizations can choose to activate the questions sourced from the community brainstorm, or submit their own questions or tasks that need solving.

   This component allows organizations to not only generate the insights they need, but also onboard new analysts and new users to their protocol. Through a flexible reputation gating system, the right quality of analysts can be targeted on a per Challenge basis.

3. **Peer Review**

   _Create Legitimacy & Promote Insights_

   Scoped requests result in analytics charts, tools, and supporting content that are peer-reviewed by a dynamic network of top analysts in order to validate and score community-sourced submissions. This component is tokengated to high reputation participants ensuring that Peer Reviewers are qualified to score submissions.

   Beyond removing low-quality or spam submissions, the Peer Review Component allows highlighting (and promotion) of the best outputs. This curates valuable marketing material for your protocol.

Through this 3 step process, MetricsDAO is able to source and develop peer-reviewed answers to questions.

Throughout 2021 and 2022, Flipside Crypto operated analytics challenges that solicited over 100,000 submissions from analysts. Knowledge and experience gained from operating this system have been contributed by Flipside Crypto and provide the foundation for MetricsDAO's organized on-demand analytics process. Sophisticated implementation of nascent on-chain primitives empowers MetricsDAO to scale its three-step process in a decentralized manner while staying responsive to supply and demand mismatches that impact pricing.

## The MetricsDAO Product

As a network of stakeholders with varying levels of access, MetricsDAO participants, contributors, and partners primarily interface with MetricsDAO through a decentralized application. This application utilizes a set of on-chain primitives to support service delivery by a decentralized participant network.

These primitives provide generic nomenclature and a mapping of terms from the primitives to MetricsDAO is provided in the Appendix.

The MetricsDAO application supports two primary Challenge types: _Brainstorm_ and _Analyze_. Both flows leverage the same underlying primitives and behavior incentivization, however, the application will encourage different behaviors depending on the use case.

Challenges in MetricsDAO are organized into Marketplaces. Each Challenge within a Marketplace follows the rules of that Marketplace including the types of Payment Tokens (pTOKENs) that may be used by Sponsors, the reward distribution style, $rMETRIC required to participate, etc. To launch a Challenge, Sponsors must provide pTOKENs and $METRIC.

The Brainstorm Challenge type is used to source and refine questions. Question sourcing is generally focused around a partner client or a topic and is a time-bound process wherein submitted questions are prioritized and may be refined by others. Questions may be prioritized at scale with a simple Likert scale.

The Analyze Challenge type is used to solicit queries, dashboards, tooling, etc. as requested by the Sponsor. Upon submitting analytics for Peer Review, a network of Reviewers determine the quality of work and assign a score utilizing a Likert scale.

In both Challenge types, Authors and Analysts compete and collaborate to earn pTOKENs while Reviewers enforce quality and earn $METRIC. While pTOKEN amounts are supplied purely at the discretion of the Sponsor, the amount of $METRIC required to launch a Challenge is dynamic based on Network Capacity.

Through the composition of these primitive concepts, the Metrics protocol enables MetricsDAO and its partner network to engage in a functioning digital labor market. We anticipate that the protocol will be used to source high-quality answers for MetricsDAO clients with greater efficiency and scale while creating conduits to monetize unused Network Capacity.

## $METRIC Token & Protocol Economics

MetricsDAO utilizes a two-token system to facilitate token-agnostic payments for analytics services provided. The $METRIC token directly incentivizes quality enforcement of the MetricsDAO network while $rMETRIC acts as a pseudonym-bound reputation token that enables local-stake participation.

### $METRIC & $rMETRIC

Reputation is a critical component of MetricsDAO. Authors, Analysts, and Reviewers signal their intent to participate by leveraging their reputation and must temporarily lock $rMETRIC against a Challenge at the time of service or in advance of delivery. In cases where a participant fails to meet their obligations, their $rMETRIC balance is not returned. While it may only be earned by Submitting, $rMETRIC also serves Reviewers as it allows them to earn $METRIC. To earn access to Peer Review that is gated with $rMETRIC, an Analyst must first earn $rMETRIC by participating in Challenges.

As $rMETRIC enables access to work opportunities paid in pTOKENs, there are a number of mechanisms that mitigate potential exploits. In addition to being bound to the holder, $rMETRIC balances decay at rates established by protocol parameters to ensure that the reputation of individuals within the network always represents their most recent actions. Decay is meant to ensure that reputation is not unfairly amassed and that the participants who are most currently active have the most access. For this reason, if a participant plans to step away from participating in MetricsDAO for a period of time, they may freeze their reputation and decrease the rate of decay.

Through these mechanisms, MetricsDAO is able to evaluate its Network Capacity at any time.

Reputation Leveraging by participants directly impacts the Network Capacity. As participants signal their intent, their ability to service new Challenges decreases. As Network Capacity decreases, the cost to access that capacity increases. More directly, as $rMETRIC is locked, available $rMETRIC in the system decreases, and the $METRIC cost to launch a new Challenge increases. This capacity-responsive fluctuation is enabled by a relationship between $METRIC usage and $rMETRIC issuance as the reputation available to participants on a per Challenge basis is dependent on the amount of $METRIC associated with that Challenge.

Authors and Analysts leverage $rMETRIC against a Challenge to signal their intent to complete it. By leveraging their reputation, Authors and Analysts ensure their opportunity to compete for pTOKENs and more $rMETRIC. Once someone has locked $rMETRIC against a Challenge, it may no longer be edited.

Reviewers lock $rMETRIC against a Challenge to signal what volume of Submissions they will Review. By leveraging their reputation, Reviewers ensure access to $METRIC earnings. As the $METRIC cost to launch a Challenge increases as Leveraged $rMETRIC increases, Reviewers are incentivized to lock as much $rMETRIC as they are able with respect to their availability to review submissions.

High $METRIC costs to launch Challenges may be decreased by an infusion of $rMETRIC. This may be done by the DAO through direct issuance or by increasing Challenge volume to provide reputation-earning opportunities.

Low $METRIC cost to launch Challenges may be increased by decreasing Network Capacity. Participants can decrease Network Capacity by locking, freezing, or purposefully slashing $rMETRIC. The DAO may impact Network Capacity using the protocol parameters made available by the primitives.

Importantly, protocol tokens ($METRIC & $rMETRIC) do not represent the value of the service accessed through the protocol. Protocol tokens only represent access to the service, otherwise known as the ability to consume capacity. No piece of MetricsDAO defines the value accessed by the Sponsor, which is entirely in control of the individual submitting the work request.

### pTOKENs

Challenges launched by Sponsors are incentivized with payment tokens (pTOKENs). MetricsDAO imposes an allowlist of tokens that may be used as pTOKENs. Through the use of custodial payment gates, permissioned members of MetricsDAO may configure a Challenge that supports reward distribution on a different chain.

In all cases of use, MetricsDAO ensures that pTOKENs are flowing to the DAO treasury on a per Challenge basis at a rate determined by a protocol parameter.

## MetricsDAO Governance

Governance within MetricsDAO operates according to the processes established by the DAO within the framework provided by the Delaware Charitable Nonstock MetricsDAO Association Bylaws. The Constitution of MetricsDAO in its most up-to-date form may be viewed in the [MetricsDAO documentation](https://docs.metricsdao.xyz/metricsdao/constitution). The bylaws of the legal entity may be reviewed [here](https://drive.google.com/file/d/1LItjh_igK1KMMcx4L35RKuaQ7eh23x99/view).

Common and Special Members may govern usage of assets in the protocol treasury, common DAO decision-making, and protocol parameters. These parameters enable MetricsDAO to make adjustments that will impact the behavior of various actor groups and may be adjusted manually or through implementations that execute adjustments based on voting activities of the DAO. Examples of parameters include: fee collection address, fee rate, reputation decay rate, etc.

## The Future

The next era of DAOs is here, presenting a marketplace that already includes thousands of decentralized organizations and $9 billion in value, a figure that could quickly boom into the trillions by taking over market share from existing centralized industries ripe for disruption. Analytics is one of those industries ripe for disruption - while obtaining access to the right data and translating it into direct outcomes is possible, the current process is messy, inefficient, and often lacks the necessary quality and bias control components. Meanwhile, there are numerous Analysts capable of meeting these challenges, but many of them don't know where to direct their abilities. With MetricsDAO, organizations get access to the community of minds they need to adapt and scale to find solutions for the myriad challenges they encounter. At the same time, Analysts are given a clear path for directing their abilities toward meaningful challenges and valuable work, through an operating system that empowers them to create impact in and beyond Web3.

The data is already out out there - but it is difficult to obtain, and even more difficult to understand. There are still too many key questions that need to be developed and answered to empower DAOs, protocols, and blockchains to succeed. MetricsDAO is an operating system built to deliver that future by bringing together both Analysts and Web3 Organizations to take on the most pressing challenges facing the blockchain ecosystem. In doing so, MetricsDAO serves to not just provide answers for the problems facing decentralized organizations today but to also provide the questions necessary to address the challenges of tomorrow.

## Appendix

The following mapping shows how concepts defined by Liquid Labor are utilized in MetricsDAO to support on-demand analytics services.

<table>
  <tr>
    <td>
      <strong>Scope</strong>
    </td>
    <td>
      <strong>Primitive Term</strong>
    </td>
    <td>
      <strong>MetricsDAO Term</strong>
    </td>
    <td>
      <strong>Definition</strong>
    </td>
  </tr>
  <tr>
    <td>Activity</td>
    <td>Enforcement</td>
    <td>Peer Review</td>
    <td>Process of reviewing the submissions from Authors and/or Analysts and applying a score</td>
  </tr>
  <tr>
    <td>Activity</td>
    <td>Signaling</td>
    <td>Reputation Leveraging</td>
    <td>
      Process of locking a reputation token to signal intent to perform an action and risking that reputation based on
      delivery
    </td>
  </tr>
  <tr>
    <td>Activity</td>
    <td>Submit, Submitting</td>
    <td>Submit, Submitting</td>
    <td>Process of service delivery by an Author or Analyst for Peer Review</td>
  </tr>
  <tr>
    <td>Activity</td>
    <td>Reputation Freezing</td>
    <td>Reputation Freezing</td>
    <td>Process of signaling lack of availability and opting into a decreased Reputation Decay Rate</td>
  </tr>
  <tr>
    <td>Actor</td>
    <td>Requester</td>
    <td>Sponsor</td>
    <td>Launches a Challenge in a Marketplace and funds to incentivize participation</td>
  </tr>
  <tr>
    <td>Actor</td>
    <td>Service Provider</td>
    <td>Author, Analyst</td>
    <td>Sources questions for MetricsDAO or creates analytics</td>
  </tr>
  <tr>
    <td>Actor</td>
    <td>Maintainer</td>
    <td>Reviewer</td>
    <td>Reviews submissions from Authors and/or Analysts</td>
  </tr>
  <tr>
    <td>Actor</td>
    <td>Market Manager</td>
    <td>Market Manager</td>
    <td>Controls the parameters of a Marketplace</td>
  </tr>
  <tr>
    <td>Actor</td>
    <td>Network Governor</td>
    <td>Network Governor</td>
    <td>Controls the parameters of the MetricsDAO protocol</td>
  </tr>
  <tr>
    <td>Object</td>
    <td>Service Request</td>
    <td>Challenge</td>
    <td>A request for action, generally in the form of a Brainstorm or Insights</td>
  </tr>
  <tr>
    <td>Object</td>
    <td>Labor Market</td>
    <td>Challenge Marketplace, Marketplace</td>
    <td>A set of configurations that determine how Challenges are rewarded and how quality is enforced</td>
  </tr>
  <tr>
    <td>Token</td>
    <td>Reputation Token</td>
    <td>rMETRIC</td>
    <td>
      Value that tracks an individual's reputation within a localized system and is impacted by action in and state of
      that network
    </td>
  </tr>
  <tr>
    <td>Token</td>
    <td>Protocol Token</td>
    <td>METRIC</td>
    <td>Token used by MetricsDAO to incentivize Reviewers to enforce quality in MetricsDAO Marketplaces</td>
  </tr>
  <tr>
    <td>Token</td>
    <td>Payment Token</td>
    <td>pTOKEN</td>
    <td>Token used by Requesters to incentivize Authors and/or Analysts to Submit to a Challenge</td>
  </tr>
  <tr>
    <td>Value</td>
    <td>Network Capacity</td>
    <td>Network Capacity</td>
    <td>The available (not Leveraged) Reputation in the system. Determines the METRIC cost to access Reviewers</td>
  </tr>
</table>
`.trim();

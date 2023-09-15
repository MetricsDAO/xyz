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
White Paper - Version 3.0
June 2023
CHANCE* Drake Danner† Meg Lister†
MetricsDAO unites analysts in a service DAO to provide on-demand data analytics using a scalable system enabled by onchain primitives and democratized access to experts.
## Why MetricsDAO?
Data-driven insights impact decisions and success. The growth of the most successful Web2 organizations has been driven by readily available, queryable data, and mighty internal analytics organizations to make sense of it. This will be especially critical for Web3 organizations - without high-quality data, communities fail to launch, protocols fail to grow, and blockchains fail to succeed. Traditional methods of analytics, however, fail to move at the pace or capture the breadth of knowledge that every Web3 organization will need to succeed.
We believe that a Service DAO is uniquely capable of providing this specialized service to other Web3 organizations. Service DAOs are an opportunity to reinvent the Web2 gig economy by creating transparent and fair relationships between freelance workers and organizations. They provide a home for the most talented analysts to collaborate, compete, and thrive, and offer the structure needed to efficiently deliver high-quality insights to partners.
Using an EVM protocol powered by [Localized Labor Markets](https://flipsidecrypto.xyz/papers/labor-markets) and [Badger](https://trybadger.com), MetricsDAO enables aligned incentives and managed participant reputation to facilitate services in a scalable and decentralized manner.
### Why Analysts Benefit from MetricsDAO
Analysts often face artificial financial and geographic constraints in their careers. Unequal distribution of resources keeps quality analysts from being discovered, leading them to be passed over for a small selection of highly-priced consulting groups that may or may not actually provide greater value.
MetricsDAO democratizes analytics by removing barriers to participation and providing mechanisms for analysts to earn payment for their work. Ongoing engagement and positive contributions increase an analyst's access to future opportunities.
Through the use of Localized Labor Markets, MetricsDAO takes advantage of infrastructure that empowers a diverse set of specialized networks to coordinate and create analytics based outputs. In addition to facilitating insight production, MetricsDAO provides a data-agnostic community for analysts to network and grow within. Analysts may use MetricsDAO to begin their analytics journey, to find a full-time position, or as their main source of income.
### Why Clients Benefit from MetricsDAO
Data is critical to every organization's decision-making process. In order to be useful, data often needs to be analyzed through a series of processes that are complex, time-consuming, and difficult. Additionally, data needs are in constant flux, as new protocols, frameworks, and relationships emerge overnight — and often require immediate attention.
By partnering with MetricsDAO, clients are able to access the world's first analytics-focused onchain Labor Markets. Through a modular system that allows a variety of participant behaviors to be solicited, partners can access analytics talent at a fair market price.
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
Throughout 2021 and 2022, Flipside Crypto operated analytics challenges that solicited over 100,000 submissions from analysts. Knowledge and experience gained from operating this system have been contributed by Flipside Crypto and provide the foundation for MetricsDAO's organized on-demand analytics process. Sophisticated implementation of nascent onchain primitives empowers MetricsDAO to scale its three-step process in a decentralized manner while staying responsive to supply and demand mismatches that impact pricing.
## The Metrics Application
As a network of stakeholders with varying levels of access, MetricsDAO participants, contributors, and partners primarily interface with MetricsDAO through a decentralized application. This application utilizes a set of onchain primitives to support service delivery by a decentralized participant network.
These primitives provide generic nomenclature and a mapping of terms from the primitives to MetricsDAO is provided in the Appendix.
Challenges in MetricsDAO are organized into Marketplaces. Each Challenge within a Marketplace follows the rules of that Marketplace including the types of Payment Tokens (pTOKENs) that may be used by Sponsors, the reward distribution style, and the set of Badge Networks that may act as Sponsors, Analysts, or Reviewers.
The Analyze Challenge type is used to solicit queries, dashboards, tooling, etc. as requested by the Sponsor. Upon submitting analytics for Peer Review, a network of Reviewers determine the quality of work and assign a score utilizing a Likert scale. Final scores along with the Marketplace's reward distribution style determine the pTOKEN amount paid to each Analyst. While Analysts are paid based on quality, Reviewers are paid based on quantity of scores applied.
Through the composition of these primitive concepts, the Metrics protocol enables MetricsDAO and its partner network to engage in a functioning digital labor market for analytics. 
## MetricsDAO as a Network of Networks
Through use of Localized Labor Markets, MetricsDAO exists as a network of networks. Each Marketplace operates as a coordination mechanism with layered incentives for three Badge Networks. As Marketplaces proliferate, Networks may find themselves in different positions within the coordination stack. As MetricsDAO grows and takes on increasingly diverse work requests, Networks are empowered to become more niche through the action of Network Managers who define, grow, and prune membership to the Badge networks they oversee.
While participants within a given Network are incentivized to collaborate and raise the profile of their Network, the Networks as a whole may see themselves as competitive with each other. As Sponsors instantiate funded Requests within various Marketplaces, they indicate interest in engaging with Networks in the coordination stack established by the Market Manager.
## The Future
The next era of DAOs is here, presenting a marketplace that already includes thousands of decentralized organizations and $9 billion in value, a figure that could quickly boom into the trillions by taking over market share from existing centralized industries ripe for disruption. Analytics is one of those industries ripe for disruption - while obtaining access to the right data and translating it into direct outcomes is possible, the current process is messy, inefficient, and often lacks the necessary quality and bias control components. Meanwhile, there are numerous Analysts capable of meeting these challenges, but many of them don't know where to direct their abilities. With MetricsDAO, organizations get access to the community of minds they need to adapt and scale to find solutions for the myriad challenges they encounter. At the same time, Analysts are given a clear path for directing their abilities toward meaningful challenges and valuable work, through an operating system that empowers them to create impact in and beyond Web3.
The data is already out out there - but it is difficult to obtain, and even more difficult to understand. There are still too many key questions that need to be developed and answered to empower DAOs, protocols, and blockchains to succeed. MetricsDAO is an operating system built to deliver that future by bringing together both Analysts and Web3 Organizations to take on the most pressing challenges facing the blockchain ecosystem. In doing so, MetricsDAO serves to not just provide answers for the problems facing decentralized organizations today but to also provide the questions necessary to address the challenges of tomorrow.
## Appendix
The following mapping shows how concepts defined by Localized Labor Markets are utilized in MetricsDAO to support on-demand analytics services.
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
    <td>Submit, Submitting</td>
    <td>Submit, Submitting</td>
    <td>Process of service delivery by an Author or Analyst for Peer Review</td>
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
    <td>Network Manager</td>
    <td>Network Manager</td>
    <td>Grows and prunes networks of Sponsors, Analysts, and Reviewers</td>
  </tr>
      <tr>
    <td>Actor Group</td>
    <td>Network</td>
    <td>Network</td>
    <td>An ERC-1155 based token network which may represent a set of Sponsors, Analysts, Reviewers, or other actor group</td>
  </tr>
    <tr>
    <td>Balance</td>
    <td>Badge</td>
    <td>Badge</td>
    <td>An ERC-1155 token used to manage onchain access to various functions within a given Marketplace</td>
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
    <td>Balance</td>
    <td>Badge</td>
    <td>Badge</td>
    <td>An ERC-1155 token used to manage onchain access to various functions within a given Marketplace</td>
  </tr>
  </table>
`.trim();

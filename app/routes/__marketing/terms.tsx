import Footer from "~/features/marketing-shell/footer";

export default function Index() {
  return (
    <div>
      <div className="px-10 md:px-24 py-40 space-y-40">
        <h1 className="text-5xl md:text-7xl font-bold mx-auto max-w-2xl text-center">
          Terms of Service & Privacy Policy
        </h1>
        <div className="space-y-5">
          <Paragraph header="Privacy Policy">
            <p className="text-sm text-stone-500">
              This Privacy Policy (the “Policy”) explains how MetricsDAO Association (“MetricsDAO”, the “Company”, “we”,
              “us” or “our”) collects, uses, and shares data in connection with the MetricsDAO web app
              (www.metricsdao.xyz/app), www.metricsdao.xyz website and all of our other properties, products, and
              services (the “Services”). Your use of the Services is subject to this Policy as well as our Terms of
              Service . By accessing and using the Services, you signify your acceptance of the terms of this Privacy
              Policy and the Terms of Service. If you do not agree to the Privacy Policy and/or the Terms of Service,
              you should immediately cease to continue the use of the Services.
            </p>
          </Paragraph>
          <Paragraph header="Data Collection">
            <p className="text-sm text-stone-500">
              Privacy and transparency is very important to MetricsDAO. Accordingly, we aspire to be transparent about
              the data we do collect. We collect site-usage analytics to improve our service, the current session’s
              active wallet, and optionally external blockchain addresses for cross-chain payments. We also Our website
              leverages traditional centralized hosting and our application uses a combination of centralized hosting as
              well as a public blockchain where all of the core functionality of the app is performed on chain.
              Therefore, almost all activity in our app is visible and accessible through public blockchain
              infrastructure.
              <ul className="list-disc text-stone-500 pl-5">
                <li>
                  <b>Public blockchain data.</b> Our web app’s core functionality is performed on a public blockchain,
                  and the app will access (index) blockchain data to ensure data consistency. Users sign into the web
                  app with their wallet and our services will show the signed in user’s ENS name or wallet address.
                </li>
                <li>
                  <b>Browser data.</b> We use 3rd party web analytics tools with all our services to learn more about
                  user behavior and enable service improvements. We can leverage browser storage for maintaining user
                  preferences and login sessions.
                </li>
                <li>
                  <b>Web application database.</b> If a user is interested in receiving cross-chain payments, our
                  services will allow them to add and remove wallets on different blockchains. The web app will store a
                  given user’s cross-chain addresses in a private database. As a user performs actions with our
                  services, pending transaction information will also be stored in our app database to ensure a positive
                  user experience.
                </li>
                <li>
                  <b>Partners and vendors.</b> We partner with 3rd party tools to check for illicit wallet activity and
                  prevent sanctioned addresses from using our app.
                </li>
                <li>
                  <b>Direct correspondence.</b> We will receive any communications and information you provide directly
                  to us via email, customer support, social media, or another support channel (such as Twitter or
                  Discord), or when you participate in any surveys or questionnaires
                </li>
              </ul>
            </p>
          </Paragraph>
          <Paragraph header="Data Usage">
            <p className="text-sm text-stone-500">
              We use the data we collect in accordance with your instructions, including any applicable terms in our
              Terms of Service, and as required by law. We may also use data for the following purposes:
              <ul className="list-disc text-stone-500 pl-5">
                <li>
                  <b className="font-semibold">Providing the Services.</b> Providing, maintaining, customizing, and
                  improving our Services and features of our Services.
                </li>
                <li>
                  <b className="font-semibold">Customer support.</b> Providing information as well as troubleshooting
                  and resolving issues.
                </li>
                <li>
                  <b className="font-semibold">Safety and security.</b> Protect against, investigating, addressing,
                  solving, enforcing, protecting and stopping fraudulent, unauthorized, illegal, or harmful activity
                  relating to enforcement of our agreements and protection of our users and the Company.
                </li>
                <li>
                  <b className="font-semibold">Legal.</b> Complying with applicable laws and regulations and may share
                  with regulators, government agencies, and law enforcement. Exercising or defending legal rights
                </li>
                <li>
                  <b className="font-semibold">Aggregated data.</b> We are an analytics DAO and therefore will encourage
                  our community and ourselves to access public blockchain data and perform aggregations and analytics.
                </li>
              </ul>
            </p>
          </Paragraph>
          <Paragraph header="Data Sharing">
            <p className="text-sm text-stone-500">
              We may share or disclose the data we collect:
              <ul className="list-disc text-stone-500 pl-5">
                <li>
                  <b className="font-semibold">With service providers.</b> We may share your information with our
                  service providers and vendors to assist us in providing, delivering, and improving the Services. For
                  example, we may share your wallet address with service providers including, but not limited to Infura
                  and Cloudflare to provide technical infrastructure services, your wallet address with blockchain
                  analytics providers to detect, prevent, and mitigate financial crime and other illicit or harmful
                  activities, and your activity on our social media pages with our analytics provider to learn more
                  about you interact with us and the Services.
                </li>
                <li>
                  <b className="font-semibold">To comply with our legal obligations.</b> We may share your data in the
                  course of litigation, regulatory proceedings, compliance measures, and when compelled by subpoena,
                  court order, or other legal procedure. We may also share data when we believe it is necessary to
                  prevent harm to our users, our Company, or others, and to enforce our agreements and policies,
                  including our Terms of Service.
                </li>
                <li>
                  <b className="font-semibold">Safety and Security.</b> We may share data to protect against,
                  investigate, and stop fraudulent, unauthorized, or illegal activity. We may also use it to address
                  security risks, solve potential security issues such as bugs, enforce our agreements, and protect our
                  users, Company, and ecosystem.
                </li>
                <li>
                  <b className="font-semibold">Business changes.</b> We may transfer or share data to another entity in
                  the event of a merger, acquisition, bankruptcy, dissolution, reorganization, asset or stock sale, or
                  other business transaction.
                </li>
                <li>
                  <b className="font-semibold">With your consent.</b> We may share your information any other time you
                  provide us with your consent to do so.
                </li>
              </ul>
            </p>
          </Paragraph>
          <Paragraph header="Data Storage and Security">
            <p className="text-sm text-stone-500">
              We implement and maintain reasonable administrative, physical, and technical security safeguards to help
              protect data from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
              Nevertheless, transmission via the internet is not completely secure and we cannot guarantee the security
              of information about you. We accept no liability for data transmitted to us via the Internet. You are
              responsible for all of your activity on the Services, including the security of your blockchain network
              addresses, cryptocurrency wallets, and their cryptographic keys.
            </p>
          </Paragraph>
          <Paragraph header="Additional Notice to California Residents (“CCPA Notice”)">
            <p className="text-sm text-stone-500">
              The California Consumer Privacy Act of 2018 (“CCPA”) requires certain businesses to provide a CCPA Notice
              to California residents to explain how we collect, use, and share their personal information, and the
              rights and choices we offer California residents regarding our handling of their information.
              <ul className="list-disc text-stone-500 pl-5">
                <li>
                  <b className="font-semibold">Privacy Practices.</b> We do not “sell” personal information as defined
                  under the CCPA. Please review the “Sharing and Disclosure of Information” section above for further
                  details about the categories of parties with whom we share information.
                </li>
                <li>
                  <b className="font-semibold">Privacy Rights.</b> The CCPA gives individuals the right to request
                  information about how we have collected, used, and shared your personal information. It also gives you
                  the right to request a copy of any information we may maintain about you. You may also ask us to
                  delete any personal information that we may have received about you. Please note that the CCPA limits
                  these rights, for example, by prohibiting us from providing certain sensitive information in response
                  to access requests and limiting the circumstances under which we must comply with a deletion request.
                  We will respond to requests for information, access, and deletion only to the extent we are able to
                  associate, with a reasonable effort, the information we maintain with the identifying details you
                  provide in your request. If we deny the request, we will communicate the decision to you. You are
                  entitled to exercise the rights described above free from discrimination.
                </li>
                <li>
                  <b className="font-semibold">Submitting a Request.</b> You can submit a request for information,
                  access, or deletion to privacy@metricsdao.xyz.
                </li>
                <li>
                  <b className="font-semibold">Minors.</b> We do not knowingly collect or store any personal information
                  about children under 13 without verifiable prior parental consent.
                </li>
                <li>
                  <b className="font-semibold">Identity Verification.</b> The CCPA requires us to collect and verify the
                  identity of any individual submitting a request to access or delete personal information before
                  providing a substantive response.
                </li>
                <li>
                  <b className="font-semibold">Authorized Agents.</b> California residents can designate an “authorized
                  agent” to submit requests on their behalf. We will require the authorized agent to have a written
                  authorization confirming their authority.
                </li>
              </ul>
            </p>
          </Paragraph>
          <Paragraph header="Disclosures for European Union Data Subjects">
            <div className="text-sm text-stone-500 space-y-3">
              <p>
                We process personal data for the purposes described in the section titled “Data Collection” above. Our
                bases for processing your data include: (i) you have given consent to the process to us or our service
                provides for one or more specific purposes; (ii) processing is necessary for the performance of a
                contract with you; (iii) processing is necessary for compliance with a legal obligation; and/or (iv)
                processing is necessary for the purposes of the legitimate interested pursued by us or a third party,
                and your interests and fundamental rights and freedoms do not override those interests.
              </p>
              <p>
                Your rights under the General Data Protection Regulations (“GDPR”) include the right to (i) request
                access and obtain a copy of your personal data, (ii) request rectification or erasure of your personal
                data, (iii) object to or restrict the processing of your personal data; and (iv) request portability of
                your personal data. Additionally, you may withdraw your consent to our collection at any time.
                Nevertheless, we cannot edit or delete information that is stored on a particular blockchain.
                Information such as your transaction data, blockchain wallet address, and assets held by your address
                that may be related to the data we collect is beyond our control.
              </p>
              <p>
                To exercise any of your rights under the GDPR, please contact us at privacy@metricsdao.xyz. We may
                require additional information from you to process your request. Please note that we may retain
                information as necessary to fulfill the purpose for which it was collected and may continue to do so
                even after a data subject request in accordance with our legitimate interests, including to comply with
                our legal obligations, resolves disputes, prevent fraud, and enforce our agreements.
              </p>
            </div>
          </Paragraph>
          <Paragraph header="Updates to this Policy">
            <p className="text-sm text-stone-500">
              This Policy may change from time to time. By continuing to use the Services, you agree to the changes
              made, so periodically check the Privacy Policy for updates.
            </p>
          </Paragraph>
          <Paragraph header="Questions about this Policy">
            <p className="text-sm text-stone-500">
              If you have any questions about this Policy or how we collect, use, or share your information, please
              contact us at privacy@metricsdao.xyz
            </p>
          </Paragraph>
          <Paragraph header="Terms of Service">
            <p className="text-sm text-stone-500 space-y-3">
              <p>
                These Terms of Service (the “Agreement”) explains the terms and conditions by which you may access and
                use https://metricsdao.xyz/app, a website-hosted user interface (the “Interface” or “App”) provided by
                MetricsDAO Association (“MetricsDAO”, “we”, “our”, or “us”). You must read this Agreement carefully as
                it governs your use of the Interface. By agreeing to these Terms of Service, you also agree to the terms
                of our Privacy Policy, which is expressly incorporated herein. All information provided to us as a
                result of your use of this Site will be handled in accordance with our Privacy Policy. To the extent
                there are inconsistencies between these Terms of Use and our Privacy Policy, these Terms of Service
                control. By accessing or using the Interface, you signify that you have read, understand, and agree to
                be bound by this Agreement in its entirety. If you do not agree, you are not authorized to access or use
                the Interface and should not use the Interface.
              </p>
              <p>
                NOTICE: This Agreement contains important information, including a binding arbitration provision and a
                class action waiver, both of which impact your rights as to how disputes are resolved. The Interface is
                only available to you — and you should only access the Interface — if you agree completely with these
                terms.
              </p>
            </p>
          </Paragraph>
          <Paragraph header="Introduction">
            <p className="text-sm text-stone-500 space-y-3">
              <p>
                These terms and conditions ("Terms") govern the use of the blockchain-based analytics application (the
                "Application") provided by MetricsDAO Association (“MetricsDAO”, “we”, “our”, or “us”). By accessing or
                using the Application, you acknowledge that you have read, understood, and agree to be bound by these
                Terms. You hereby represent and warrant that you are fully able and competent to enter into the terms,
                conditions, obligations, affirmations, representations and warranties set forth in these Terms and to
                abide by and comply with these Terms.
              </p>
              <p>
                The Application is a platform for providing analytics and insights to users. The Application utilizes
                blockchain technology and requires users to have a crypto wallet in order to access and use the
                platform.
              </p>
              <p>
                All interactions and transactions conducted through the Application will be recorded on the blockchain
                and made publicly available as part of the public record. By using the Application, you acknowledge and
                agree that your interactions and transactions will be recorded and made publicly available in this
                manner.
              </p>
              <p>
                Please read these Terms carefully and contact us if you have any questions. We may update these Terms
                from time to time, so please check back periodically for any changes. Your continued use of the
                Application after any such changes constitutes your acceptance of the revised Terms.
              </p>
            </p>
          </Paragraph>
          <Paragraph header="Access Eligibility">
            <p className="text-sm text-stone-500 space-y-3">
              <p>
                The Application is intended for use by individuals and organizations that are not located in or
                affiliated with any country or territory that is subject to economic sanctions, embargoes, or other
                restrictions under the laws of the United States.
              </p>
              <p>
                We reserve the right to block access to the Application for users that are located in or affiliated with
                any such country or territory, as well as for users that are identified as bad actors or otherwise pose
                a threat to the security or integrity of the Application.
              </p>
              <p>
                By using the Application, you represent and warrant that you are not located in or affiliated with any
                such country or territory, and that you are not a bad actor or otherwise a threat to the security or
                integrity of the Application. If we determine, in our sole discretion, that you are in violation of
                these eligibility requirements, we reserve the right to immediately terminate your access to the
                Application.
              </p>
            </p>
          </Paragraph>
          <Paragraph header="IP Ownership">
            <p className="text-sm text-stone-500 space-y-3">
              <p>
                The Application and all related software, technology, and intellectual property rights are owned by
                Flipside Crypto LLC and MetricsDAO Association, and are protected by applicable copyright, trademark,
                and other intellectual property laws. You acknowledge and agree that these rights are valid and
                enforceable.
              </p>
              <p>
                The Application enables users to upload and share content, including text, images, audio, and video. You
                acknowledge and agree that any content that you upload to the Application is considered to be in the
                public domain and is not subject to any proprietary rights. We do not claim any ownership rights in any
                such content, and you retain all rights that you may have in such content.
              </p>
              <p>
                If you believe that any content on the Application infringes your copyrights, you may submit a notice to
                us in accordance with the Digital Millennium Copyright Act ("DMCA"). We will investigate such notices
                and, if appropriate, take appropriate action in accordance with the DMCA. However, we do not control the
                content on the Application, and we cannot guarantee the removal of any infringing content. You
                acknowledge and agree that we are not responsible for any content that is available on the Application.
              </p>
            </p>
          </Paragraph>
          <Paragraph header="Additional Rights">
            <p className="text-sm text-stone-500 space-y-3">
              <p>
                We reserve the right to release updates, improvements, and enhancements to the Application at any time
                and without notice. These updates may modify, delete, or add features to the Application, and you
                acknowledge and agree that we have no obligation to provide any support or maintenance for the
                Application.
              </p>
              <p>
                We also reserve the right to change, remove, or discontinue any aspect of the Application at any time
                and without notice. This includes the right to change, remove, or discontinue any content, features, or
                functionality of the Application, as well as the right to remove the Application from any app stores or
                other distribution platforms.
              </p>
              <p>
                We may also add, update, or remove marketing materials, advertisements, and other content from the
                Application at any time and without notice. This content may be provided by third parties, and you
                acknowledge and agree that we are not responsible for the accuracy or reliability of any such content.
              </p>
              <p>
                We may also disclose your information, including personal information, to law enforcement, government
                agencies, or other third parties if we are required to do so by law or if we believe in good faith that
                such disclosure is necessary to protect our rights, property, or the safety of our users or the public.
                You acknowledge and agree that we have the right to make such disclosures as defined in our Privacy
                Policy.
              </p>
            </p>
          </Paragraph>
          <Paragraph header="Prohibited Actions">
            <p className="text-sm text-stone-500">
              By accessing and using the Application, you agree to comply with all applicable laws and regulations, as
              well as these Terms. You also agree not to engage in any of the following prohibited actions:
              <ul className="list-disc text-stone-500 pl-5">
                <li>Using the Application for any illegal, fraudulent, or unauthorized purposes.</li>
                <li>
                  Infringing on the intellectual property rights, privacy rights, or any other rights of any third
                  party.
                </li>
                <li>Misrepresenting your identity or affiliation with any person or organization.</li>
                <li>Tampering with, hacking, or attempting to access any unauthorized areas of the Application.</li>
                <li>Interfering with the operation of the Application or its servers or networks.</li>
                <li>
                  Transmitting any viruses, worms, defects, Trojan horses, or other items of a destructive nature.
                </li>
                <li>
                  Impersonating another person or entity, or otherwise attempting to mislead others about your identity
                  or affiliation.
                </li>
                <li>
                  Using the Application in a manner that could damage, disable, overburden, or impair the Application or
                  its servers or networks.
                </li>
                <li>
                  We reserve the right to investigate and take appropriate legal action against anyone who engages in
                  any of the prohibited actions, including without limitation, reporting such activity to law
                  enforcement authorities. You acknowledge and agree that we are not responsible for any damages or
                  losses resulting from your violation of these restrictions, and that you will indemnify and hold us
                  harmless from any claims arising from your violation of these restrictions.
                </li>
              </ul>
            </p>
          </Paragraph>
          <Paragraph header="MetricsDAO Legal Entity Standing">
            <p className="text-sm text-stone-500 space-y-3">
              <p>
                MetricsDAO Association is a non-stock, non-profit organization incorporated in the state of Delaware,
                United States of America. As a non-profit organization, MetricsDAO is not organized for the profit or
                financial benefit of its members, directors, or officers.
              </p>
              <p>
                Nothing in these terms and conditions shall be deemed to create any relationship of agency, partnership,
                joint venture, or any other form of association between MetricsDAO and any user of the Application.
              </p>
            </p>
          </Paragraph>
          <Paragraph header="Not Financial Advice">
            <p className="text-sm text-stone-500">
              We do not offer financial advice and our partnerships and collaborations are not a representation of
              financial advice. Any information provided on our website or through our services should not be considered
              financial advice and should not be relied upon as such. We encourage you to seek the advice of a qualified
              financial professional before making any financial decisions.
            </p>
          </Paragraph>
          <Paragraph header="Non-Custodial and Non-Fiduciary">
            <p className="text-sm text-stone-500 space-y-3">
              <p>
                We do not provide custody, possession, or control of your wallets or digital assets. The user is solely
                responsible for the security and proper use of their wallet, including but not limited to keeping their
                wallet password and private keys secure and not sharing them with any third parties. The web3
                application and its developers provide no warranty or guarantees and shall not be held responsible for
                any losses or damages resulting from the user's failure to properly secure and manage their wallet.
              </p>
              <p>
                This Agreement is not intended to, and does not, create or impose any fiduciary duties on us. To the
                fullest extent permitted by law, you acknowledge and agree that we owe no fiduciary duties or
                liabilities to you or any other party, and that to the extent any such duties or liabilities may exist
                at law or in equity, those duties and liabilities are hereby irrevocably disclaimed, waived, and
                eliminated. You further agree that the only duties and obligations that we owe you are those set out
                expressly in this Agreement.
              </p>
            </p>
          </Paragraph>
          <Paragraph header="Compliance and Tax">
            <p className="text-sm text-stone-500">
              By accessing and using the app and its features, including the ability to earn money through MetricsDAO,
              the user agrees to comply with all applicable local legal and tax laws and regulations. The user is solely
              responsible for complying with any tax and legal obligations related to their use of the app and any
              earnings generated through it. The app and its developers shall not be held responsible for the user's
              failure to comply with local laws and regulations.
            </p>
          </Paragraph>
          <Paragraph header="Risk">
            <p className="text-sm text-stone-500 space-y-3">
              <p>
                By using our app, the user acknowledges that they are sufficiently comfortable with blockchain-based
                technology and the implications of using digital assets and wallets. The user understands that smart
                contract interactions are not reversible and are public record, and that funds locked in a smart
                contract are not accessible or withdrawable until the contract deems the recipient and amount
                appropriate. The user also understands the inherent risks of bridging blockchain assets across different
                blockchains, and accepts that issues may arise in doing so. You expressly understand and agree that your
                use of the Interface is at your sole risk.
              </p>
              <p>
                In summary, the user acknowledges that the app and its developers are not responsible for any of the
                variables or risks associated with accessing and using the app, and cannot be held liable for any
                resulting losses. The user understands and agrees to assume full responsibility for all of the risks of
                accessing and using the app to interact with the underlying protocol.
              </p>
            </p>
          </Paragraph>
          <Paragraph header="Partners and Marketing and Collaboration">
            <p className="text-sm text-stone-500 space-y-3">
              <p>
                The application and website may include links to third-party partners and services that are not owned or
                controlled by the app or website. The user acknowledges and agrees that the app and its developers are
                not responsible for any content or information shared by these partners and services. The app and its
                developers do not monitor or approve third-party hosted content, and shall not be held liable for any
                implications of financial advice provided by such partners or services. Third party partners and
                marketing collaboration is not an indication of financial advice.
              </p>
              <p>
                By using the app or website, the user expressly relieves the app and its developers of any and all
                liability arising from their use of any third-party resources or participation in any promotions offered
                by these partners or services.
              </p>
            </p>
          </Paragraph>
          <Paragraph header="Release of Claims">
            <p className="text-sm text-stone-500">
              You expressly agree that you assume all risks in connection with your access and use of the Interface. You
              further expressly waive and release us from any and all liability, claims, causes of action, or damages
              arising from or in any way relating to your use of the Interface. If you are a California resident, you
              waive the benefits and protections of California Civil Code § 1542, which provides: "[a] general release
              does not extend to claims that the creditor or releasing party does not know or suspect to exist in his or
              her favor at the time of executing the release and that, if known by him or her, would have materially
              affected his or her settlement with the debtor or released party."
            </p>
          </Paragraph>
          <Paragraph header="Indemnity">
            <p className="text-sm text-stone-500">
              You agree to hold harmless, release, defend, and indemnify us and our officers, directors, employees,
              contractors, agents, affiliates, and subsidiaries from and against all claims, damages, obligations,
              losses, liabilities, costs, and expenses arising from: (a) your access and use of the Interface; (b) your
              violation of any term or condition of this Agreement, the right of any third party, or any other
              applicable law, rule, or regulation; and (c) any other party's access and use of the Interface with your
              assistance or using any device or account that you own or control. We reserve the right to defend any such
              claim, and you agree to provide us with such reasonable cooperation and information as we may request.
            </p>
          </Paragraph>
          <Paragraph header="No Warranty">
            <p className="text-sm text-stone-500 space-y-3">
              <p>
                The Interface is provided on an "AS IS" and "AS AVAILABLE" basis. TO THE FULLEST EXTENT PERMITTED BY
                LAW, WE DISCLAIM ANY REPRESENTATIONS AND WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY,
                INCLUDING (BUT NOT LIMITED TO) THE WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
                You acknowledge and agree that your use of the Interface is at your own risk. We do not represent or
                warrant that access to the Interface will be continuous, uninterrupted, timely, or secure; that the
                information contained in the Interface will be accurate, reliable, complete, or current; or that the
                Interface will be free from errors, defects, viruses, or other harmful elements. No advice, information,
                or statement that we make should be treated as creating any warranty concerning the Interface. We do not
                endorse, guarantee, or assume responsibility for any advertisements, offers, or statements made by third
                parties concerning the Interface.
              </p>
              <p>
                Similarly, the Protocol is provided "AS IS", at your own risk, and without warranties of any kind.
                Although we contributed to the initial code for the Protocol, we do not provide, own, or control the
                Protocol, which is run autonomously by smart contracts deployed on various blockchains. Upgrades and
                modifications to the Protocol are generally managed in a community-driven way. No developer or entity
                involved in creating the Protocol will be liable for any claims or damages whatsoever associated with
                your use, inability to use, or your interaction with other users of, the Protocol, including any direct,
                indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits,
                cryptocurrencies, tokens, or anything else of value. We do not endorse, guarantee, or assume
                responsibility for any advertisements, offers, or statements made by third parties concerning the
                Interface.
              </p>
            </p>
          </Paragraph>
          <Paragraph header="Limitation of Liability">
            <p className="text-sm text-stone-500">
              UNDER NO CIRCUMSTANCES SHALL WE OR ANY OF OUR OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS, AGENTS,
              AFFILIATES, OR SUBSIDIARIES BE LIABLE TO YOU FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING (BUT NOT LIMITED TO) DAMAGES FOR LOSS OF PROFITS, GOODWILL,
              USE, DATA, OR OTHER INTANGIBLE PROPERTY, ARISING OUT OF OR RELATING TO ANY ACCESS OR USE OF THE INTERFACE,
              NOR WILL WE BE RESPONSIBLE FOR ANY DAMAGE, LOSS, OR INJURY RESULTING FROM HACKING, TAMPERING, OR OTHER
              UNAUTHORIZED ACCESS OR USE OF THE INTERFACE OR THE INFORMATION CONTAINED WITHIN IT. WE ASSUME NO LIABILITY
              OR RESPONSIBILITY FOR ANY: (A) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT; (B) PERSONAL INJURY OR
              PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM ANY ACCESS OR USE OF THE INTERFACE; (C)
              UNAUTHORIZED ACCESS OR USE OF ANY SECURE SERVER OR DATABASE IN OUR CONTROL, OR THE USE OF ANY INFORMATION
              OR DATA STORED THEREIN; (D) INTERRUPTION OR CESSATION OF FUNCTION RELATED TO THE INTERFACE; (E) BUGS,
              VIRUSES, TROJAN HORSES, OR THE LIKE THAT MAY BE TRANSMITTED TO OR THROUGH THE INTERFACE; (F) ERRORS OR
              OMISSIONS IN, OR LOSS OR DAMAGE INCURRED AS A RESULT OF THE USE OF, ANY CONTENT MADE AVAILABLE THROUGH THE
              INTERFACE; AND (G) THE DEFAMATORY, OFFENSIVE, OR ILLEGAL CONDUCT OF ANY THIRD PARTY.
            </p>
          </Paragraph>
          <Paragraph header="Dispute Resolution">
            <p className="text-sm text-stone-500 space-y-3">
              <p>
                We will use our best efforts to resolve any potential disputes through informal, good faith
                negotiations. If a potential dispute arises, you must contact us by sending an email to
                privacy@metricsdao.xyz so that we can attempt to resolve it without resorting to formal dispute
                resolution. If we aren't able to reach an informal resolution within sixty days of your email, then you
                and we both agree to resolve the potential dispute according to the process set forth below.
              </p>
              <p>
                Any claim or controversy arising out of or relating to the Interface, this Agreement, or any other acts
                or omissions for which you may contend that we are liable, including (but not limited to) any claim or
                controversy as to arbitrability ("Dispute"), shall be finally and exclusively settled by arbitration
                under the JAMS Optional Expedited Arbitration Procedures. You understand that you are required to
                resolve all Disputes by binding arbitration. The arbitration shall be held on a confidential basis
                before a single arbitrator, who shall be selected pursuant to JAMS rules. The arbitration will be held
                in Boston, Massachusetts, unless you and we both agree to hold it elsewhere. Unless we agree otherwise,
                the arbitrator may not consolidate your claims with those of any other party. Any judgment on the award
                rendered by the arbitrator may be entered in any court of competent jurisdiction.
              </p>
            </p>
          </Paragraph>
          <Paragraph header="Class Action and Jury-Trial waiver">
            <p className="text-sm text-stone-500">
              You must bring any and all Disputes against us in your individual capacity and not as a plaintiff in or
              member of any purported class action, collective action, private attorney general action, or other
              representative proceeding. This provision applies to class arbitration. You and we both agree to waive the
              right to demand a trial by jury.
            </p>
          </Paragraph>
          <Paragraph header="Governing Law">
            <p className="text-sm text-stone-500">
              You agree that the laws of the State of Delaware, without regard to principles of conflict of laws, govern
              this Agreement and any Dispute between you and us. You further agree that the Interface shall be deemed to
              be based solely in the State of New York, and that although the Interface may be available in other
              jurisdictions, its availability does not give rise to general or specific personal jurisdiction in any
              forum outside the State of New York. Any arbitration conducted pursuant to this Agreement shall be
              governed by the Federal Arbitration Act. You agree that the federal and state courts of New York County,
              New York are the proper forum for any appeals of an arbitration award or for court proceedings in the
              event that this Agreement's binding arbitration clause is found to be unenforceable.
            </p>
          </Paragraph>
          <Paragraph header="Updates to these Terms">
            <p className="text-sm text-stone-500 space-y-3">
              <p>If we make material changes to the Terms & Conditions we will notify you via the application.</p>
              <p>
                By using the services you acknowledge periodic review of all MetricsDAO terms and indicate your consent
                to them.
              </p>
            </p>
          </Paragraph>
          <Paragraph header="These Terms">
            <p className="text-sm text-stone-500">
              These terms constitute the entire agreement between you and us with respect to the subject matter hereof.
              This Agreement supersedes any and all prior or contemporaneous written and oral agreements, communications
              and other understandings (if any) relating to the subject matter of the terms.
            </p>
          </Paragraph>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Paragraph({ header, children }: { header: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-base">{header}</p>
      {children}
    </div>
  );
}

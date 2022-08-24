import Header from "~/components/Header";


export default function Index() {

    return (
        <div className="three-step">
            <section className="hero-3-step">
                <div className="container site-header">
                    <Header />
                    <div className="content intro tw-text-center tw-h-screen lg:tw-h-auto tw-flex tw-flex-col tw-justify-center">
                        <h1 className="section-title" data-aos="fade" data-aos-duration="1000">Switch on the analytics engine.</h1>
                        <p className="tw-text-3xl tw-mb-14 tw-max-w-3xl tw-mx-auto tw-font-medium">Partner with our community of world-class blockchain data analysts to generate actionable analytics and onboard new users</p>
                        <div data-aos="fade" data-aos-delay="300" data-aos-duration="2000">
                            <a className="btn-main" href="https://discord.gg/p3GMjK2zAr">
                                <span>PARTNER WITH US</span>
                                <span>
                                <i className="bi bi-arrow-right-short"></i>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section className="how-it-works section-1">
                <div className="container tw-flex tw-items-center tw-justify-around">
                    <div className="" data-aos="fade-up" data-aos-duration="1000">
                        <h2 className="section-label tw-text-2xl">HOW IT WORKS</h2>
                    </div>
                    <div className="tw-max-w-2xl">
                        <h4 className="tw-text-4xl tw-mb-8">
                        MetricsDAO provides an <strong>organized three step process </strong> for DAOs to receive the analytics, tooling and content they need in near real time. 
                        </h4>

                        <h4 className="tw-text-4xl tw-mb-8">Each step works as a distinct component of on-demand analytics, and serves a unique purpose that can be activated alone or in combination with the other two.</h4>

                        <a target="_blank" href="https://metricsdao.xyz/dashboard" rel="noreferrer" className="tw-text-4xl"><h5>Let the data speak for itself → </h5></a>
                        <p className="tw-max-w-xs tw-text-xl tw-mt-3">Over 160 analysts have created 900+ dashboards in the first half of 2022.</p>
                    </div>
                    <div className="image-holder tw-invisible">
                        Empty text Empty text Empty text Empty text
                    </div>
                </div>
            </section>
            <section className="overview-steps tw-py-20">
                <div className="community-brainstorm container tw-flex tw-mb-40 tw-justify-around">
                    <div className="">
                        <h2 className="tw-text-lg rotate"><span className="component">Component</span><span className="component-step">01</span></h2>
                    </div>
                    <div className="">
                        <h1 className="tw-font-bold tw-text-6xl tw-max-w-md">Community Brainstorming</h1>
                        <h4 className="sub-heading-3step tw-font-medium tw-text-4xl tw-mb-20 tw-max-w-lg">To Engage &amp; Educate</h4>
                        <p className="tw-text-xl tw-max-w-lg tw-mb-10">Ask the broader community what analytics they would like to see created. Anyone can submit questions and/or upvote others’ so that the most relevant questions are prioritized, and spam is filtered out.</p>
                        <p className="tw-text-xl tw-max-w-lg">The goal of the Community Brainstorming Component is to drive engagement with the broader community: to understand what is currently relevant, confusing, or worrisome to them. At the same time, rewarding participants at this level works to educate newcomers on how your protocol works and incentivizes the best ideas to rise to the top.</p>
                    </div>
                    <div className="image-holder">
                        <img src="/img/three-step-process/step-1-image.png" alt="step one" />
                    </div>
                </div>
                <div className="analytics container tw-flex tw-mb-40  tw-justify-around">
                    <div className="">
                        <h2 className="tw-text-lg rotate"><span className="component">Component</span><span className="component-step">02</span></h2>
                    </div>
                    <div className="">
                        <h1 className="tw-font-bold tw-text-6xl tw-max-w-md">Analytics</h1>
                        <h4 className="sub-heading-3step tw-font-medium tw-text-4xl tw-mb-20 tw-max-w-lg"> To Generate Insights &amp; Drive User Onboarding</h4>
                        <p className="tw-text-xl tw-max-w-lg tw-mb-10">Tap MetricsDAO’s community of analysts to create the analytics, tooling and content you need. With this component, organizations can choose to activate the questions sourced from the community brainstorm, or submit their own questions or tasks that need solving.</p>
                        <p className="tw-text-xl tw-max-w-lg">This component allows organizations to not only generate the insights they need, but also onboard new analysts and new users to their protocol.</p>
                        <p className="tw-mt-5">
                            <a
                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                            href="https://metricsdao.xyz/showcase"
                            >
                            VIEW EXAMPLE ANALYTICS{" "}
                            <i className="bi bi-arrow-right-short"></i>
                            </a> 
                        </p>
                    </div>
                    <div className="image-holder">
                        <img src="/img/three-step-process/step-2-image.png" alt="step two" />
                    </div>
                </div>
                <div className="peer-review container tw-flex tw-mb-20  tw-justify-around">
                    <div className="">
                        <h2 className="tw-text-lg rotate"><span className="component">Component</span><span className="component-step">03</span></h2>
                    </div>
                    <div className="">
                        <h1 className="tw-font-bold tw-text-6xl tw-max-w-md">Analytics</h1>
                        <h4 className="sub-heading-3step tw-font-medium tw-text-4xl tw-mb-20 tw-max-w-lg"> To Generate Insights &amp; Drive User Onboarding</h4>
                        <p className="tw-text-xl tw-max-w-lg tw-mb-10">Analytics, tools and content are peer reviewed by a dynamic network of top analysts in order to validate and score results. This component is gated to participants, and requires a certain amount of tokens for someone to become a Reviewer.</p>
                        <p className="tw-text-xl tw-max-w-lg">Beyond removing low quality or spam submissions (spam should already be reduced by the token gating mechanisms in place in Component 2), the Peer Review Component allows us to highlight (and promote) the best outputs. This creates valuable marketing for your protocol.</p>
                    </div>
                    <div className="image-holder">
                        <img src="/img/three-step-process/step-3-image.png" alt="step three" />
                    </div>
                </div>
            </section>
            <section className="protocols">
                <div className="container tw-flex tw-items-center tw-justify-between">
                    <div>
                        <img src="/img/three-step-process/protocols.png" alt="protocol logos" />
                    </div>
                    <div className="tw-max-w-2xl">
                        <p className=" tw-text-4xl tw-mb-10">
                        <strong>“MetricsDAO has been a pleasure to work with. </strong> We were already impressed with the team and the quality of output, so a further collaboration was a no-brainer. The Harmony community now has access to extremely valuable insights to understand critical metrics.”
                        </p>
                        <p className="tw-text-xl"><strong className="tw-block">Giv Parvaneh</strong> Senior Blockchain Engineer – Harmony</p>
                    </div>
                </div>
            </section>
        </div>
    )

}
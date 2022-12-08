import { Button, Container, Input, Textarea } from "~/components";

export default function SubmitQuestion() {
  return (
    <Container className="py-16 mx-auto`">
      <div className="flex flex-col-reverse justify-center lg:flex-row  space-y-reverse space-y-8 lg:space-y-0 lg:space-x-16">
        <main className="lg:max-w-xl space-y-7">
          <h1 className="text-3xl font-semibold">Submit Question</h1>
          <h2 className="text-lg text-cyan-500">
            Brainstorm the best question for crypto analysts to answer about Challenge title
          </h2>
          <p className="text-gray-500">
            Submit your best question idea. Peers will review and score your question. If you're a winner, you'll earn
            tokens and rMETRIC from the challenge reward pool!
          </p>
          <div className="space-y-5">
            <Input label="Question Title" placeholder="Question title" className="mt-1 w-full" />
            <Textarea
              placeholder="Don't assume we will “know what you mean.” Be specific. Define metrics. Specify time boundaries."
              className="p-black w-full md:col-span-2"
              rows={7}
            />
            <p className="italic p-gray-500">
              Important: You can't edit this question after submitting. Double check your work for typos and ensure your
              question is good to go.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-5 items-center">
            <Button>Submit Question</Button>
            <Button variant="cancel">Cancel</Button>
          </div>
        </main>
        <aside className="lg:basis-1/3 ">
          <div className="rounded-lg border-2 p-5 bg-sky-100 bg-opacity-5 space-y-6">
            <p className="font-bold">Be specific:</p>
            <div className="text-gray-500 space-y-3">
              <p>"How many people actively use Sushi?"</p>
              <p>
                The original question has many interpretations: SUSHI the token? SUSHI the dex? What is a person? Are we
                talking Ethereum? What about Polygon?
              </p>
              <p className="font-medium italic">
                UPDATE: How many addresses actively use the SUSHI token on Ethereum?{" "}
              </p>
            </div>
            <p className="font-bold">Define metrics:</p>
            <div className="text-gray-500 space-y-3">
              <p>
                What is “active“? What is “use”? These terms can (and will) mean different things to different people.
                It doesn't matter what definition you use as long as you communicate your expectations. Alternatively,
                you can ask for the metric to be defined as part of the question.
              </p>
              <p className="font-medium italic">UPDATE: How many addresses have transferred SUSHI on Ethereum?</p>
            </div>
            <div className="space-y-3">
              <p className="font-bold">Specify time boundaries:</p>
              <div className="text-gray-500 space-y-3">
                <p>
                  We still haven't fully defined “active”. Specifying time makes the result easier to understand, don't
                  rely on the person answering the question to specify time for you if you didn’t ask them to.
                </p>
                <p className="font-medium italic">
                  UPDATE: How many addresses have transferred SUSHI on Ethereum in the last 90 days?
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}

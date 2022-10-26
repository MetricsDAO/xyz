import { Button, Textarea, TextInput } from "@mantine/core";

export default function SubmitQuestion() {
  return (
    <div className="container mx-auto px-10 md:px-32 space-y-3">
      <b className="text-3xl font-semibold">{"Submit Question for {Topic}"}</b>
      <p>{"Submit at least one question idea before the submission deadline in {countdown}."}</p>
      <div className="flex flex-col md:flex-row md:space-x-20">
        <div className="md:basis-2/3 space-y-10 md:space-y-28">
          <TextInput label="Title" placeholder="Name" className=" text-black w-full" />
          <Textarea
            label="Question"
            placeholder="Text"
            className="text-black w-full md:col-span-2"
            autosize
            spellCheck="true"
            minRows={5}
            maxRows={10}
          />
          <i>
            Important: Questions can’t be edited once submitted. Double check your work for typos and ensure your
            question is good to go.
          </i>
          <div className="flex flex-col md:flex-row gap-5 items-center">
            <Button variant="default" color="dark" size="md">
              Cancel
            </Button>
            <Button color="dark" size="md">
              Submit Question
            </Button>
          </div>
        </div>
        <div className="mt-10 md:mt-0 md:basis-1/3">
          <h3>How to Write a Good Question</h3>
          <div className="border text-[#858582] rounded-lg p-4">
            <p>Don’t assume we will “know what you mean.” </p>
            <ul className="list-disc list-inside">
              <li>Be specific</li>
              <li>Define metrics </li>
              <li>Specify time boundaries</li>
            </ul>
          </div>
          <div className="border text-[#858582] rounded-lg p-4 mt-10 space-y-6">
            <p>ORIGINAL: How many people actively use Sushi? </p>
            <p>
              <b>Be specific:</b>
            </p>
            <p>
              The original question has many interpretations: SUSHI the token? SUSHI the dex? What is a person? Are we
              talking Ethereum? What about Polygon?
            </p>
            <p>UPDATE: How many addresses actively use the SUSHI token on Ethereum? </p>
            <p>
              <b>Define metrics: </b>
            </p>
            <p>
              What is “active“? What is “use”? These terms can (and will) mean different things to different people. It
              doesn’t matter what definition you use as long as you communicate your expectations. Alternately you can
              ask for the metric to be defined as part of the question.
            </p>
            <p>UPDATE: How many addresses have transferred SUSHI on Ethereum?</p>

            <p>
              <b>Specify time boundaries:</b>
            </p>
            <p>
              We still haven’t fully defined “active”. Specifying time makes the result easier to understand, don’t rely
              on the person answering the question to specify time for you if you didn’t ask them to.
            </p>
            <p> UPDATE: How many addresses have transferred SUSHI on Ethereum in the last 90 days?</p>
          </div>
        </div>
      </div>
    </div>
  );
}

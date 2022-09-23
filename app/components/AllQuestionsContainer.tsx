import AllQuestionsByState from "~/components/AllQuestionsByState";
import { useQuestionsWithIpfsData } from "~/hooks/question";

export default function AllQuestionContainer() {
  const { questionsWithIpfsData } = useQuestionsWithIpfsData();

  if (questionsWithIpfsData === undefined) {
    return <>Loading...</>;
  }
  return (
    <section className="tw-mx-auto tw-mb-7 tw-container">
      <AllQuestionsByState questions={questionsWithIpfsData} />
    </section>
  );
}

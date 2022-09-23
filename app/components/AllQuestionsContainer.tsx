import AllQuestionsByState from "~/components/AllQuestionsByState";
import { useQuestionsWithIpfsData } from "~/hooks/questions";

export default function AllQuestionContainer() {
  const { questionsWithIpfsData } = useQuestionsWithIpfsData();

  // TODO: Better Loading UI
  if (questionsWithIpfsData === undefined) {
    return <>Loading...</>;
  }
  return (
    <section className="tw-mx-auto tw-mb-7 tw-container">
      <AllQuestionsByState questions={questionsWithIpfsData} />
    </section>
  );
}

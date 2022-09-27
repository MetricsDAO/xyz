import { useQuestionsWithMetaData } from "~/hooks/useQuestionsWithMetadata";
import AllQuestionsByState from "./AllQuestionsByState";

export default function AllQuestionContainer() {
  const { questions, isLoadingQuestions, ipfsDataByQuestionId } = useQuestionsWithMetaData();
  // TODO: Better Loading UI
  if (isLoadingQuestions) {
    return <>Loading...</>;
  }
  return (
    <section className="tw-mx-auto tw-mb-7 tw-container">
      <AllQuestionsByState questions={questions} ipfsDataByQuestionId={ipfsDataByQuestionId} />
    </section>
  );
}

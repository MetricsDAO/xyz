import AllQuestionsByState from "~/components/AllQuestionsByState";

export default function AllQuestionContainer({
  address,
  questionAPI,
  xmetric,
  questionStateController,
  bountyQuestion,
  networkMatchesWallet,
  currentQuestion,
}: {
  address?: string;
  questionAPI: Record<string, string>;
  xmetric?: Record<string, string>;
  questionStateController: Record<string, string>;
  bountyQuestion: Record<string, string>;
  networkMatchesWallet: boolean;
  currentQuestion?: number;
}) {
  return (
    <>
      <section className="tw-mx-auto tw-mb-7 tw-container">
        {currentQuestion && (
          <AllQuestionsByState
            questionAPI={questionAPI}
            latestQuestion={currentQuestion}
            questionStateController={questionStateController}
            networkMatchesWallet={networkMatchesWallet}
          />
        )}
      </section>
    </>
  );
}

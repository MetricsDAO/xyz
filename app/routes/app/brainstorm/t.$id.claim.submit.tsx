export default function ClaimToSubmit() {
  return (
    <div className="container mx-auto px-10 md:px-32 space-y-3">
      <b className="text-3xl font-semibold">{"Claim {Topic} to Submit"}</b>
      <p>
        Claiming is an up front commitment to submit at least one question idea on a topic. Having at least one claim on
        a topic also ensures the topic sponsor can’t cancel it once work has started. To claim, you must stake your
        reputation by locking xMETRIC.
      </p>
      <h3>How Claims Work</h3>
      <ul className="list-disc list-inside">
        <li>Commit to submitting at least one question by locking xMETRIC against this topic</li>
        <li>Submit at least one question before the submission deadline</li>
        <li>If you submit before the deadline, your xMETRIC will be unlocked</li>
        <li>If you claim and don’t submit, your xMETRIC will be slashed</li>
      </ul>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-5 gap-y-10">
        <div className="col-span-2">
          <h3>Claim Deadline</h3>
          <div className="border text-[#858582] border-[#858582] p-3 rounded-md w-full col-span-2">
            <p>4d 2h 3m</p>
          </div>
        </div>
        <div className="col-span-2">
          <h3>Submit Deadline</h3>
          <div className="border text-[#858582] border-[#858582] p-3 rounded-md w-full col-span-2">
            <p>4d 2h 3m</p>
          </div>
        </div>
        <div className="col-span-2">
          <h3>Lock xMetric</h3>
          <div className="border text-[#858582] border-[#858582] p-3 rounded-md w-full col-span-2">
            <p>You must lock 10 xMetric to claim</p>
          </div>
        </div>
      </div>
      <button className="bg-black text-white rounded-md py-4 px-8 font-medium">Lock xMetric</button>
      <div className="flex flex-col md:flex-row gap-5 items-center">
        <button className="bg-white text-black border rounded-md py-4 px-12 font-medium">Cancel</button>
        <button className="bg-black text-white rounded-md py-4 px-8 font-medium">Claim Topic</button>
      </div>
    </div>
  );
}

import { Container } from "~/components/Container";

export default function Ecosystem() {
  return (
    <Container className="py-16 px-10">
      <section className="space-y-2 max-w-3xl mb-16">
        <h1 className="text-3xl font-semibold">Ecosystem</h1>
        <div>
          <p className="text-lg text-cyan-500">
            Discover top submissions, rMETRIC holders, participants, and ecosystem metrics
          </p>
          <p className="text-gray-500 text-sm">Quickly surface relevant challenge activity and metrics over time</p>
        </div>
      </section>
      <p>buttons</p>
      <section>
        <p>Activity</p>
        <p>Participants</p>
        <p>Rewards</p>
        <p>Reputation</p>
      </section>
    </Container>
  );
}

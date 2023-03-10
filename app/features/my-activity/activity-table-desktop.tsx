import { Header, Row, Table } from "~/components/table";
import type { ActivityDoc } from "~/domain";

export function ActivityTable({ activities }: { activities: ActivityDoc[] }) {
  return (
    <Table>
      <Header columns={12} className="mb-2">
        <Header.Column span={3}>Challenge Title</Header.Column>
        <Header.Column span={3}>Reward</Header.Column>
        <Header.Column span={2}>Submitted</Header.Column>
        <Header.Column span={3}>Rewarded</Header.Column>
        <Header.Column>Status</Header.Column>
      </Header>
      {activities.map((a) => {
        return <ActivityTableRow activity={a} key={a.id} />;
      })}
    </Table>
  );
}

function ActivityTableRow({ activity }: { activity: ActivityDoc }) {
  return (
    <Row columns={12}>
      <Row.Column span={3}>
        <p>title</p>
      </Row.Column>
      <Row.Column span={3}>column</Row.Column>
      <Row.Column span={2} className="text-black">
        timestamp
      </Row.Column>
      <Row.Column span={3} className="text-black" color="dark.3">
        testing
      </Row.Column>
      <Row.Column>
        {/* {hasClaimed === false ? (
          <ClaimButton reward={reward} wallets={wallets} tokens={tokens} />
        ) : hasClaimed === true ? (
          <span>Claimed</span>
        ) : (
          <></>
        )} */}
      </Row.Column>
    </Row>
  );
}

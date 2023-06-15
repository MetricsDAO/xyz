import { TabNav, TabNavLink } from "../../components/tab-nav";

export default function RewardsTab({ rewardsNum, addressesNum }: { rewardsNum: number; addressesNum: number }) {
  return (
    <TabNav className="mb-8">
      <TabNavLink to="/app/rewards" end>
        Submissions ({rewardsNum})
      </TabNavLink>
      <TabNavLink to="/app/rewards/reviews" end>
        Reviews
      </TabNavLink>
      <TabNavLink to="/app/rewards/addresses">Payout Addresses ({addressesNum})</TabNavLink>
    </TabNav>
  );
}

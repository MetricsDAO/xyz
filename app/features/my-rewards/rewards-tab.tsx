import { TabNav, TabNavLink } from "../../components/tab-nav";

export default function RewardsTab({
  submissionCount,
  reviewCount,
  addressesNum,
}: {
  submissionCount: number;
  reviewCount: number;
  addressesNum: number;
}) {
  return (
    <TabNav className="mb-8">
      <TabNavLink to="/app/rewards" end>
        Submissions ({submissionCount})
      </TabNavLink>
      <TabNavLink to="/app/rewards/reviews" end>
        Reviews ({reviewCount})
      </TabNavLink>
      <TabNavLink to="/app/rewards/addresses">Payout Addresses ({addressesNum})</TabNavLink>
    </TabNav>
  );
}

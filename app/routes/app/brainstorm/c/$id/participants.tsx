import { Link } from "@remix-run/react";
import { UserBadge } from "~/components/UserBadge";
import { Badge } from "~/components/Badge";
import { Card } from "~/components/Card";

export default function ChallengeIdParticipants() {
  return (
    <section className="space-y-7">
      <p className="text-sm text-gray-700">
        Average user rMETRIC <Badge className="ml-2 px-5 text-gray-900">1,000</Badge>
      </p>

      <div className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
        <main className="w-full border-spacing-4 border-separate space-y-4">
          <Card asChild className="px-6 py-4">
            <Link to="/u/0x123" className="flex justify-between items-center">
              <UserBadge url="u/id" name="jo.Eth" balance={200} />
              <p className="text-sm text-gray-500">12 hours ago</p>
            </Link>
          </Card>
          {/* {[1, 2].map((m) => {
            return (
              <Link
                to="/u/[uId]"
                className="flex flex-col md:flex-row gap-3 border-solid border-2 border-[#EDEDED] py-3 px-4 rounded-lg hover:bg-stone-100 items-center space-between"
                key={m}
              >
                <div className="flex flex-col md:flex-row items-center flex-1 gap-2">
                  <Avatar alt="" />
                  <Text weight={500}>user.ETH</Text>
                  <Badge color="gray" radius="sm">
                    <Text weight={400} className="normal-case">
                      400 xMetric
                    </Text>
                  </Badge>
                </div>
                <Text>12 hours ago</Text>
              </Link>
            );
          })} */}
        </main>
        <aside className="md:w-1/5">filters here</aside>
      </div>
    </section>
  );
}

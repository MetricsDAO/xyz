import { Link, NavLink } from "@remix-run/react";
import { Button } from "~/components/Button";
import { TopicList } from "~/components/TopicList";
import { useTopics } from "~/hooks/useTopics";

export default function BrainstormCollection() {
  const { data: topics, isLoading } = useTopics({});
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex">
      <main className="flex-1 py-5 px-10">
        <header className="pb-10 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Brainstorms</h3>
          <nav className="space-x-4">
            <NavLink to="." className={({ isActive }) => (isActive ? "underline" : ``)}>
              Brainstorm
            </NavLink>
            <NavLink to="./review" className={({ isActive }) => (isActive ? "underline" : ``)}>
              Review
            </NavLink>
          </nav>
        </header>

        {topics ? (
          <TopicList>
            {topics.map((topic) => (
              <TopicList.Item key={topic.id} topic={topic} />
            ))}
          </TopicList>
        ) : null}
      </main>

      <aside className="w-1/4  rounded-lg p-4">
        <Button asChild fullWidth>
          <Link to="/">New Brainstorm</Link>
        </Button>
      </aside>
    </div>
  );
}

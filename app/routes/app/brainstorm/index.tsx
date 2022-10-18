import { Link } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Button } from "~/components/Button";
import type { Program } from "~/domain";
import { fakeProgram } from "~/utils/fakes";

export const loader = async () => {
  return typedjson({ programs: Array.from({ length: 10 }).map(fakeProgram) });
};

export default function Brainstorm() {
  const data = useTypedLoaderData<typeof loader>();
  return (
    <div className="flex">
      <main className="mx-auto container">
        <header className="pb-10 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Brainstorms</h3>
        </header>

        <div className="flex space-x-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 flex-1">
            {data.programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
          <aside className="w-1/5">
            <Button fullWidth>New Program</Button>
            filters
          </aside>
        </div>
      </main>
    </div>
  );
}

function ProgramCard({ program }: { program: Program }) {
  return (
    <Link to="/brainstorm/id" className="rounded bg-neutral-100 p-5 flex flex-col space-y-2">
      <h4 className="text-lg font-semibold">{program.title}</h4>
      <p className="text-sm text-neutral-500 text-ellipsis">{program.description}</p>
      <p className="text-xs">Created By {program.creator}</p>
      <p className="text-sm">42 Questions</p>
    </Link>
  );
}

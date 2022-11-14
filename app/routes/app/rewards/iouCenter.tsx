import { ChevronSort16, ChevronSortDown16, ChevronSortUp16, Search16, WarningAltFilled16 } from "@carbon/icons-react";
import {
  Input,
  Title,
  Text,
  Button,
  Tabs,
  MultiSelect,
  Pagination,
  Checkbox,
  UnstyledButton,
  Modal,
  Center,
} from "@mantine/core";
import { Form, useSearchParams } from "@remix-run/react";
import { useState } from "react";

export default function IOUCenter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openedCreate, setOpenedCreate] = useState(false);

  const onPaginationChange = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  //to be replaced
  const rewards = [{ id: 123, name: "silly string" }];
  const totalResults = rewards.length;
  const params = { first: 1, page: 1 };
  const validAddress = false;

  return (
    <>
      <Modal opened={openedCreate} onClose={() => setOpenedCreate(false)} withCloseButton={false}>
        <div className="space-y-5">
          <Title order={4}>Create an iouToken</Title>
          <Text>Coming soon!</Text>
          <div className="flex gap-2 justify-end">
            <Button radius="md" variant="default" onClick={() => setOpenedCreate(false)}>
              Cancel
            </Button>
            <Button radius="md" disabled={!validAddress}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
      <div className="mx-auto container mb-12 px-10 space-y-16">
        <div className="space-y-2">
          <section className="flex flex-wrap gap-5 justify-between">
            <Title order={2} weight={600}>
              iouCenter
            </Title>
            <Center className="flex flex-wrap gap-5">
              <Button radius="md" className="mx-auto" onClick={() => setOpenedCreate(true)}>
                Create iouToken
              </Button>
            </Center>
          </section>
          <section className="max-w-3xl">
            <Title order={4} color="brand.4" weight={400}>
              Create iouTokens to facilitate multi-chain payouts in partners’ native tokens
            </Title>
            <div className="bg-[#FFD991] flex items-center rounded-md p-2">
              <WarningAltFilled16 className="text-[#946100] mx-2" />
              <Text color="#946100">
                You must ensure the DAO has enough token liquidity before issuing more iouTokens
              </Text>
            </div>
          </section>
        </div>

        <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
          <main className="flex-1">
            <Tabs defaultValue="iouTokens">
              <Tabs.List className="mb-5">
                <Tabs.Tab value="iouTokens">iouTokens (3)</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="iouTokens" pt="xs">
                <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
                  <main className="flex-1">
                    <div className="space-y-5">
                      <RewardsTable iouTokens={rewards} />
                      <div className="w-fit m-auto">
                        <Pagination
                          page={params.page}
                          hidden={totalResults === 0}
                          total={Math.ceil(totalResults / params.first)}
                          onChange={onPaginationChange}
                        />
                      </div>
                    </div>
                  </main>
                  <aside className="md:1/4 lg:w-1/5">
                    <SearchAndFilter />
                  </aside>
                </section>
              </Tabs.Panel>
            </Tabs>
          </main>
        </section>
      </div>
    </>
  );
}

function SearchAndFilter() {
  return (
    <Form className="space-y-3 p-3 border-[1px] border-solid border-[#EDEDED] rounded-md bg-brand-400 bg-opacity-5">
      <Input placeholder="Search" name="q" radius="md" rightSection={<Search16 />} />
      <Text size="lg" weight={600}>
        Filter:
      </Text>
      <Checkbox.Group spacing="xs">
        <Checkbox value="noBalance" label="No available balance" />
      </Checkbox.Group>
      <MultiSelect
        radius="md"
        label="iouToken"
        placeholder="Select option"
        name="iouToken"
        clearable
        data={[
          { label: "Solana", value: "Solana" },
          { label: "Ethereum", value: "Ethereum" },
          { label: "USD", value: "USD" },
        ]}
      />
    </Form>
  );
}

// Responsive layout for displaying marketplaces. On desktop, takes on a pseudo-table layout. On mobile, hide the header and become a list of self-contained cards.
function RewardsTable({ iouTokens }: { iouTokens: any }) {
  const [openedBurn, setOpenedBurn] = useState(false);
  const [openedIssue, setOpenedIssue] = useState(false);
  if (iouTokens.length === 0) {
    return <Text>No results. Try changing search and filter options.</Text>;
  }
  return (
    <>
      <Modal opened={openedBurn} onClose={() => setOpenedBurn(false)} withCloseButton={false}>
        <div className="space-y-5">
          <Title order={4}>Burn iouTODO</Title>
          <div className="space-y-2">
            <Text color="dimmed" size="sm">
              The tokens will be burned and cease to exist.
            </Text>
            <div className="flex border-solid border rounded-md border-[#DEDEDE] justify-between items-center pl-2">
              <Input variant="unstyled" placeholder="Burn amount" />
              <Text size="sm" weight={600} td="underline" className="p-3">
                Max 150
              </Text>
            </div>
          </div>
          <div className="flex gap-2">
            <Button radius="md">Burn</Button>
            <Button radius="md" variant="default" onClick={() => setOpenedBurn(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      <Modal opened={openedIssue} onClose={() => setOpenedIssue(false)} withCloseButton={false}>
        <div className="space-y-5">
          <Title order={4}>Issue iouTODO</Title>
          <div className="space-y-2">
            <Text color="dimmed" size="sm">
              The tokens will be created and start circulating.
            </Text>
            <div className="flex border-solid border rounded-md border-[#DEDEDE] items-center pl-2">
              <Input variant="unstyled" placeholder="Issue amount" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button radius="md">Issue</Button>
            <Button radius="md" variant="default" onClick={() => setOpenedIssue(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      {/* Header (hide on mobile) */}
      <div className="hidden lg:grid grid-cols-6 gap-x-1 items-end px-2">
        <SortButton title="Name" label="todo" />
        <SortButton title="Circulating" label="todo" />
        <SortButton title="Burned" label="todo" />
      </div>
      {/* Rows */}
      <div className="space-y-3">
        {iouTokens.map((t: { id: string; name: string }) => {
          return (
            <div
              // On mobile, two column grid with "labels". On desktop hide the "labels".
              className="grid grid-cols-2 lg:grid-cols-6 gap-y-3 gap-x-1 items-center border-solid border-2 border-[#EDEDED] px-3 py-5 rounded-lg hover:border-brand-400 hover:shadow-md shadow-sm"
              key={t.id}
            >
              <div className="lg:hidden">Name</div>

              <Text>{t.name}</Text>

              <div className="lg:hidden">Circulating</div>
              <Text color="dark.3">1000</Text>
              <div className="lg:hidden">Burned</div>
              <Text color="dark.3">1000</Text>
              <div className="flex flex-wrap gap-2 lg:col-span-3 justify-end">
                <Button onClick={() => setOpenedBurn(true)} variant="default">
                  Burn
                </Button>
                <Button onClick={() => setOpenedIssue(true)}>Issue</Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function SortButton({ label, title }: { label: string; title: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const onSort = (header: string) => {
    searchParams.set("sortBy", header);
    if (searchParams.get("order") === "asc") {
      searchParams.set("order", "desc");
    } else {
      searchParams.set("order", "asc");
    }
    setSearchParams(searchParams);
  };

  return (
    <UnstyledButton onClick={() => onSort(label)} className="flex">
      <Text color="dark.3">{title}</Text>
      {searchParams.get("sortBy") === label ? (
        searchParams.get("order") === "asc" ? (
          <ChevronSortUp16 className="mt-2" />
        ) : (
          <ChevronSortDown16 />
        )
      ) : (
        <ChevronSort16 className="mt-1" />
      )}
    </UnstyledButton>
  );
}

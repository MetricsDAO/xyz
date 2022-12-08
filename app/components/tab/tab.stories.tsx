import { Tabs } from "./tab";

export function basic() {
  return (
    <Tabs>
      <Tabs.List>
        <Tabs.Tab> Tab 1 </Tabs.Tab>
        <Tabs.Tab> Tab 2 </Tabs.Tab>
        <Tabs.Tab> Tab 3 </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Panel>
          <div>Tab 1 Content</div>
        </Tabs.Panel>
        <Tabs.Panel>
          <div>Tab 2 Content</div>
        </Tabs.Panel>
        <Tabs.Panel>
          <div>Tab 3 Content</div>
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}

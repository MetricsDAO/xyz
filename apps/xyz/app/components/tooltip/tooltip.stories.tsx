import { Tooltip } from "./tooltip";
export default {
  title: "Tooltip",
  component: Tooltip,
};

export const Basic = () => {
  return <Tooltip content="Hi it's the tooltip message">Hover over me</Tooltip>;
};

export const HtmlContent = () => {
  return (
    <Tooltip
      content={
        <div>
          <h1 className="text-lg font-bold">Header</h1>
          <p className="text-sm">This is the tooltip message</p>
        </div>
      }
    >
      <div className="bg-gray-15 rounded-md p-3">
        <h1 className="text-lg font-bold">Hover over me</h1>
        <p className="text-sm">I have HTML in my tooltip and my trigger</p>
      </div>
    </Tooltip>
  );
};

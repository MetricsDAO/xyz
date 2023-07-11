import { Button } from "./button";

export const Basic = () => {
  return (
    <div className="space-y-5">
      <h3>Sizes</h3>
      <div className="flex space-x-4 border rounded-lg border-gray-200 p-6">
        <Button size="sm">Small (sm)</Button>
        <Button size="md">Medium (md)</Button>
        <Button size="lg">Large (lg)</Button>
      </div>

      <h3>Variants</h3>
      <div className="flex space-x-4 border rounded-lg border-gray-200 p-6">
        <Button variant="primary">Primary</Button>
        <Button variant="gradient">Gradient</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="cancel">Cancel</Button>
      </div>
    </div>
  );
};

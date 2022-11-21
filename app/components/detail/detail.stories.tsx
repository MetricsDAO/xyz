import { Badge } from "../Badge";
import { Detail, DetailItem } from "./detail";

export const Index = () => {
  return (
    <div>
      <Detail>
        <DetailItem title="Title">
          <p>Content</p>
        </DetailItem>
        <DetailItem title="Title 2">
          <Badge>Different Content</Badge>
        </DetailItem>
      </Detail>
    </div>
  );
};

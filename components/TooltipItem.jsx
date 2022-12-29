import { Stack, TextStyle } from '@shopify/polaris';
import { SquareColorPreview } from '@shopify/polaris-viz';

function TooltipItem({ data }) {
  return (
    <Stack.Item>
      <div className="Tooltip__Item">
        <SquareColorPreview color={data?.color} />
        <TextStyle variation="strong">
          {data?.key} : {data?.value}
        </TextStyle>
      </div>
    </Stack.Item>
  );
}

export default TooltipItem;

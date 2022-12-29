import { TooltipContainer } from '@components/charts.styles';
import Table from '@components/Table';
import TooltipItem from '@components/TooltipItem';
import { Button, Card, FormLayout, Heading, Stack } from '@shopify/polaris';
const LineChart = dynamic(() => import('@shopify/polaris-viz').then((module) => module.LineChart), { ssr: false });
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { cloneDeep } from 'lodash';
import dynamic from 'next/dynamic';
import useCompareChart from './useCompareChart';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function CompareChart({ selectedDates }) {
  const { handleClick, rows, datasets } = useCompareChart({ selectedDates });

  const renderTooltip = (data) => {
    const sortedData = cloneDeep(data.data[0].data.sort((a, b) => b.value - a.value));
    return (
      <TooltipContainer>
        <FormLayout>
          <Heading>{data.title}</Heading>
          <Stack vertical spacing="tight">
            {sortedData.map((item, index) => {
              return <TooltipItem data={item} key={index} />;
            })}
          </Stack>
        </FormLayout>
      </TooltipContainer>
    );
  };

  return (
    <Card>
      <Card.Header title="Sales comparison">
        <Button onClick={handleClick} plain>
          Post to Slack
        </Button>
      </Card.Header>
      <Table rows={rows} />
      <Card.Section subdued>
        <div style={{ height: '500px' }}>
          <LineChart
            data={datasets}
            isAnimated
            theme="Light"
            tooltipOptions={{
              renderTooltipContent: renderTooltip,
            }}
          />
        </div>
      </Card.Section>
    </Card>
  );
}
export default CompareChart;

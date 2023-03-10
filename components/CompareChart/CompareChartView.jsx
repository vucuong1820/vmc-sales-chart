import { TooltipContainer } from '@components/charts.styles';
import DateSelector from '@components/DateSelector';
import LegendItem from '@components/LegendItem.jsx';
import Table from '@components/Table';
import TooltipItem from '@components/TooltipItem';
import { Button, Card, FormLayout, Heading, Stack } from '@shopify/polaris';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { cloneDeep } from 'lodash';
import dynamic from 'next/dynamic';
import useCompareChart from './useCompareChart.jsx';
const LineChart = dynamic(() => import('@shopify/polaris-viz').then((module) => module.LineChart), { ssr: false });

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function CompareChart() {
  const { handleSelectLegend, selectedDatasets, handleChange, handleChangeDate, selectedDate, handleClick, loading, rows, datasets } =
    useCompareChart();

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
      <Card.Header
        title={
          <Stack vertical>
            <Stack.Item>
              <Heading variation="strong">Sales comparison</Heading>
            </Stack.Item>
            <Stack.Item>
              <DateSelector onConfirm={handleChange} onlyDefault={true} selectedDate={selectedDate} onChangeSelectedDate={handleChangeDate} />
            </Stack.Item>
          </Stack>
        }
      >
        <Button onClick={handleClick} plain>
          Post to Slack
        </Button>
      </Card.Header>
      <Table rows={rows} loading={loading} />
      <Card.Section subdued>
        <div style={{ height: '500px', position: 'relative' }}>
          {datasets?.length > 0 && (
            <LineChart
              data={selectedDatasets?.length ? selectedDatasets : datasets}
              isAnimated
              theme="Light"
              tooltipOptions={{
                renderTooltipContent: renderTooltip,
              }}
              showLegend={true}
              renderLegendContent={({ getColorVisionStyles, getColorVisionEventAttrs }) => {
                return datasets.map((item) => {
                  return (
                    <LegendItem
                      onSelect={() => handleSelectLegend(item)}
                      key={item?.name}
                      data={item}
                      styles={getColorVisionStyles()}
                      attributes={getColorVisionEventAttrs()}
                      selected={selectedDatasets.findIndex((data) => data?.name === item?.name) !== -1}
                    />
                  );
                });
              }}
            />
          )}
        </div>
      </Card.Section>
    </Card>
  );
}
export default CompareChart;

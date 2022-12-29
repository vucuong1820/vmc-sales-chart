import { TooltipContainer } from '@components/charts.styles';
import Loading from '@components/Loading';
import TooltipItem from '@components/TooltipItem';
import { CHART_GROWTH_MAPPING } from '@constants/chart';
import {
  Button,
  Card,
  Checkbox,
  DisplayText,
  FormLayout,
  Grid,
  Heading,
  Icon,
  Popover,
  Select,
  Stack,
  TextContainer,
  TextStyle,
} from '@shopify/polaris';
import { ArrowDownMinor, ArrowUpMinor, CalendarMinor } from '@shopify/polaris-icons';
const LineChart = dynamic(() => import('@shopify/polaris-viz').then((module) => module.LineChart), { ssr: false });
import { Chart as ChartJs, Legend, LinearScale, PointElement, TimeScale, Tooltip } from 'chart.js';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import ComparedDate from './components/ComparedDate';
import SelectedDate from './components/SelectedDate';
import { DateWrapper } from './salesGrowth.styles';
import useSalesGrowth from './useSalesGrowth';

ChartJs.register(LinearScale, PointElement, Tooltip, Legend, TimeScale);

function SaleGrowthChart({ dates, mode = CHART_GROWTH_MAPPING.SALES.key }) {
  const {
    loading,
    compare,
    handleChangeSelect,
    options,
    selected,
    defaultDatasets,
    handleConfirm,
    selectedDates,
    comparedDates,
    setSelectedDates,
    setComparedDates,
    datePickerActive,
    toggleDatePicker,
    datasets,
    total,
    growthRate,
    rating,
    totalSelectedQty,
    setSelected,
    setOptions,
    setCompare,
  } = useSalesGrowth({ dates, mode });
  const activator = (
    <Button icon={CalendarMinor} onClick={toggleDatePicker}>
      <div style={{ textTransform: 'capitalize' }}>{options.find((x) => x.value === selected)?.label}</div>
    </Button>
  );

  const fixedValue = useMemo(() => {
    const smallest = Math.min(...(defaultDatasets?.[0]?.data?.map((item) => item.originValue) ?? []));
    return smallest - (smallest % 10);
  }, [defaultDatasets]);

  const renderTooltip = (data) => {
    const activeIndex = data?.activeIndex;
    const selectedValue = data?.dataSeries?.[0]?.data[activeIndex]?.value;
    const comparedValue = data?.dataSeries?.[1]?.data[activeIndex]?.value;
    let percentage = 0;
    if (selectedValue && comparedValue) {
      percentage = (((selectedValue - comparedValue) / comparedValue) * 100)?.toFixed(0) ?? 0;
    }
    return (
      <TooltipContainer>
        <FormLayout>
          <Heading>Minimog</Heading>
          <Stack vertical spacing="tight">
            {data.dataSeries.map((item, index) => {
              const info = item.data[activeIndex];
              const indexColor = data?.data?.[0]?.data?.length === 1 ? 0 : index;
              const color = data?.data?.[0]?.data?.[indexColor]?.color;

              return info && <TooltipItem data={{ ...info, color, value: info?.originValue ?? info?.value }} key={index} />;
            })}
            {percentage && (
              <Stack.Item>
                <div className="Tooltip__Percentage">
                  <Icon color={percentage > 0 ? 'success' : 'critical'} source={percentage > 0 ? ArrowUpMinor : ArrowDownMinor} />
                  <TextStyle variation={percentage > 0 ? 'positive' : 'negative'}>{`${percentage > 0 ? '+' : ''}${percentage}%`}</TextStyle>
                </div>
              </Stack.Item>
            )}
          </Stack>
        </FormLayout>
      </TooltipContainer>
    );
  };

  return (
    <Card>
      <Card.Section>
        <Stack>
          <Stack.Item fill>
            <TextContainer>
              <Stack vertical>
                <Stack.Item>
                  <Heading>{CHART_GROWTH_MAPPING[mode].title}</Heading>
                </Stack.Item>
                <Stack.Item>
                  <Stack alignment="center">
                    <Stack.Item>
                      <Checkbox checked={compare} onChange={(newValue) => setCompare(newValue)} label="Compare with custom period" />
                    </Stack.Item>
                    {compare && (
                      <Stack.Item>
                        <Popover active={datePickerActive} activator={activator} onClose={toggleDatePicker} fluidContent fullHeight>
                          <Popover.Pane>
                            <Popover.Section>
                              <DateWrapper>
                                <div style={{ marginBottom: 'var(--p-space-6)' }}>
                                  <Select options={options} value={selected} onChange={handleChangeSelect} label="Date range" />
                                </div>
                                <Grid columns={{ xl: 2, lg: 2, md: 2, sm: 3 }} gap={{ xl: '50px', lg: '50px', md: '50px', sm: '50px' }}>
                                  <Grid.Cell>
                                    <ComparedDate onChangeDate={setComparedDates} dates={comparedDates} />
                                  </Grid.Cell>
                                  <Grid.Cell>
                                    <SelectedDate
                                      onChangeDate={setSelectedDates}
                                      dates={selectedDates}
                                      onChangeOptions={setOptions}
                                      onSetSelected={setSelected}
                                    />
                                  </Grid.Cell>
                                </Grid>
                              </DateWrapper>
                            </Popover.Section>
                          </Popover.Pane>

                          <Popover.Pane fixed>
                            <Popover.Section>
                              <Stack>
                                <Stack.Item fill>
                                  <Button onClick={toggleDatePicker}>Cancel</Button>
                                </Stack.Item>
                                <Button
                                  primary
                                  onClick={() => {
                                    handleConfirm();
                                    // handleChange();
                                    toggleDatePicker();
                                  }}
                                >
                                  Apply
                                </Button>
                              </Stack>
                            </Popover.Section>
                          </Popover.Pane>
                        </Popover>
                      </Stack.Item>
                    )}
                  </Stack>
                </Stack.Item>
              </Stack>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <DisplayText>{totalSelectedQty}</DisplayText>
                {growthRate ? (
                  <div
                    style={{
                      paddingLeft: 15,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Icon color={growthRate > 0 ? 'success' : 'critical'} source={growthRate > 0 ? ArrowUpMinor : ArrowDownMinor} />
                    <span style={{ fontSize: '2rem' }}>
                      <TextStyle variation={growthRate > 0 ? 'positive' : 'negative'}>{growthRate.toFixed(2)}%</TextStyle>
                    </span>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </TextContainer>
          </Stack.Item>
          <Stack.Item>
            <div style={{ paddingRight: 30 }}>
              <DisplayText>{rating}</DisplayText>
              <TextStyle variation="subdued">Rating</TextStyle>
            </div>
          </Stack.Item>
          <Stack.Item>
            <DisplayText>{total?.toLocaleString('en-US')}</DisplayText>
            <TextStyle variation="subdued">{CHART_GROWTH_MAPPING[mode].total}</TextStyle>
          </Stack.Item>
        </Stack>
      </Card.Section>
      <Card.Section>
        <div
          style={{
            height: '500px',
            position: 'relative',
          }}
        >
          {loading && <Loading.Center size="large" />}

          <LineChart
            data={compare ? datasets : defaultDatasets}
            isAnimated
            skipLinkText="Skip chart content"
            theme="Light"
            tooltipOptions={{
              renderTooltipContent: renderTooltip,
            }}
            yAxisOptions={{
              labelFormatter: (value) => {
                if (compare) return value?.toString() ?? '';
                return (value + fixedValue)?.toString() ?? '';
              },
            }}
          />
        </div>
      </Card.Section>
    </Card>
  );
}
export default SaleGrowthChart;

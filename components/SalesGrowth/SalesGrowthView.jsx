import { TooltipContainer } from '@components/charts.styles';
import Skeleton from '@components/layout/Skeleton';
import Loading from '@components/layout/Loading';
import TooltipItem from '@components/TooltipItem';
import { CHART_GROWTH_MAPPING } from '@constants/chart';
import {
  Button,
  Card,
  Checkbox,
  DisplayText,
  FormLayout,
  Heading,
  Icon,
  Popover,
  Select,
  SkeletonThumbnail,
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
import useSalesGrowth, { FIXED_REVIEW_VALUE, selectOptions } from './useSalesGrowth';
import { format } from 'date-fns';

ChartJs.register(LinearScale, PointElement, Tooltip, Legend, TimeScale);

function SaleGrowthChart({ dates, mode = CHART_GROWTH_MAPPING.SALES.key }) {
  const {
    setCompare,
    compare,
    handleChangeSelect,
    options,
    selected,
    handleConfirm,
    selectedDate,
    comparedDate,
    setSelectedDate,
    setComparedDate,
    datePickerActive,
    toggleDatePicker,
    total,
    growthRate,
    rating,
    totalSelectedQty,
    setSelected,
    setOptions,
    loading,
    datasets,
  } = useSalesGrowth({ dates, mode });

  console.log(loading, datasets);

  const activator = (
    <Button icon={CalendarMinor} onClick={toggleDatePicker}>
      <div style={{ textTransform: 'capitalize' }}>{selectOptions.find((x) => x.value === selected)?.label ?? `${format(selectedDate?.start, 'MM/dd/yyyy')} - ${format(selectedDate?.end, 'MM/dd/yyyy')}`}</div>
    </Button>
  );

  const fixedValue = useMemo(() => {
    if (compare && mode === CHART_GROWTH_MAPPING.REVIEWS.key) return FIXED_REVIEW_VALUE;
    const smallest = Math.min(...(datasets?.[0]?.data?.map((item) => item.originValue) ?? []));
    return smallest - (smallest % 10);
  }, [datasets]);

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
              <Stack alignment="center">
                <Stack.Item>
                  <Heading>{CHART_GROWTH_MAPPING[mode].title}</Heading>
                </Stack.Item>
              </Stack>
              <Popover active={datePickerActive} activator={activator} onClose={toggleDatePicker} fluidContent fullHeight>
                <Popover.Pane>
                  <Popover.Section>
                    <DateWrapper expand={compare}>
                      <FormLayout>
                        <Select options={options} value={selected} onChange={handleChangeSelect} label="Date range" />
                        <Checkbox checked={compare} onChange={setCompare} label="Compare with custom period" />
                        <SelectedDate onChangeDate={setSelectedDate} dates={selectedDate} onChangeOptions={setOptions} onSetSelected={setSelected} />
                      </FormLayout>
                      {compare && (
                        <div className="compare-date">
                          <ComparedDate onChangeDate={setComparedDate} dates={comparedDate} />
                        </div>
                      )}
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
            </TextContainer>
          </Stack.Item>
          {loading ? (
            <Skeleton width={300} height={50} />
          ) : (
            <Stack>
              <Stack.Item>
                <div style={{ display: 'flex', alignItems: 'center', paddingRight: '20px' }}>
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
              </Stack.Item>
              <Stack.Item>
                <div style={{ paddingRight: 30 }}>
                  <DisplayText>{rating}</DisplayText>
                  <TextStyle variation="subdued">Rating</TextStyle>
                </div>
              </Stack.Item>
              <Stack.Item>
                {loading ? <SkeletonThumbnail size="small" /> : <DisplayText>{total?.toLocaleString('en-US')}</DisplayText>}
                <TextStyle variation="subdued">{CHART_GROWTH_MAPPING[mode].total}</TextStyle>
              </Stack.Item>
            </Stack>
          )}
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

          {!loading && datasets?.length > 0 && (
            <LineChart
              data={datasets}
              isAnimated
              skipLinkText="Skip chart content"
              theme="Light"
              tooltipOptions={{
                renderTooltipContent: renderTooltip,
              }}
              yAxisOptions={{
                labelFormatter: (value) => {
                  if (compare && mode === CHART_GROWTH_MAPPING.REVIEWS.key) {
                    const newValue = value - fixedValue;
                    const condition = Number.isInteger(newValue) && newValue >= 0;
                    return condition ? newValue?.toString() ?? '' : '';
                  }
                  if (compare) return value?.toString() ?? '';
                  return (value + fixedValue)?.toString() ?? '';
                },
              }}
            />
          )}
        </div>
      </Card.Section>
    </Card>
  );
}
export default SaleGrowthChart;

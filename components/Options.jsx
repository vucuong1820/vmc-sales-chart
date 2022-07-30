import {Button, DatePicker, Select, Card, Popover, Stack, Checkbox, FormLayout} from "@shopify/polaris";
import {format, getMonth, getYear} from "date-fns";
import React, {useState, useCallback, useEffect} from "react";
import {getDateRange, getCompareDate} from "../helpers/utils";
import {CalendarMinor} from '@shopify/polaris-icons';

const selectOptions = [
	{label: "This week", value: "this_week"},
	{label: "This month", value: "this_month"},
	{label: "Last 7 days", value: "last_7_days"},
	{label: "Last 30 days", value: "last_30_days"},
	{label: "Last 90 days", value: "last_90_days"},
	{label: "This year", value: "this_year"},
	{label: "Last year", value: "last_year"},
];

const Options = ({handleChange}) => {
	const [selectedDates, setSelectedDates] = useState(getDateRange('this_week'));
	const [compareDates, setCompareDates] = useState(null);
	const [options, setOptions] = useState(selectOptions)
	const [compare, setCompare] = useState(false)
	const [popoverActive, setPopoverActive] = useState(false);
	const [selected, setSelected] = useState("this_week");

	const [{month, year}, setDate] = useState({
		month: getMonth(new Date()),
		year: getYear(new Date())
	});

	useEffect(() => {
		handleChange({selectedDates})
	}, [])

	const togglePopoverActive = useCallback(
		() => setPopoverActive((popoverActive) => !popoverActive),
		[]
	);

	const activator = (
		<Stack alignment={'center'}>
			<Button onClick={togglePopoverActive} icon={CalendarMinor}>
				{selected !== 'custom' ? selectOptions.find(option => option.value === selected)?.label : `${format(selectedDates?.start, 'MM/dd/yyyy')} - {format(selectedDates?.end, 'MM/dd/yyyy')}`}
			</Button>
			{compare && (
				<span>Compare to</span>
			)}
			{compare && (
				<Button onClick={togglePopoverActive} icon={CalendarMinor}>
					{format(compareDates?.start, 'MM/dd/yyyy')} - {format(compareDates?.end, 'MM/dd/yyyy')}
				</Button>
			)}
		</Stack>
	);

	const handleChangeSelect = (value) => {
		setSelected(value);
		setSelectedDates(getDateRange(value));
		handleChange({selectedDates: getDateRange(value), compareDates})
		togglePopoverActive()
	};
	const handleDatePickerChange = (dates) => {
		setSelectedDates(dates)

		setCompareDates(getCompareDate(dates))
		setOptions([...selectOptions, {label: 'Custom', value: 'custom'}])
		setSelected('custom')
	}

	return (
		<Popover
			active={popoverActive}
			activator={activator}
			onClose={togglePopoverActive}
			fluidContent
			fullHeight
			preferredAlignment={'left'}
		>
			<div style={{width: compare ? 1100 : 550}}>
				<Card>
					<Card.Section>
						<div style={{display: 'flex', gap: '3rem'}}>
							<FormLayout>
								<Select
									options={options}
									value={selected}
									onChange={v => handleChangeSelect(v)}
								/>
								<DatePicker
									month={month}
									year={year}
									onChange={v => handleDatePickerChange(v)}
									onMonthChange={(month, year) => setDate({month, year})}
									selected={selectedDates}
									disableDatesAfter={new Date()}
									allowRange
									multiMonth
								/>
							</FormLayout>
							{compare && (
								<DatePicker
									month={month}
									year={year}
									onChange={dates => setCompareDates(dates)}
									onMonthChange={(month, year) => setDate({month, year})}
									selected={compareDates}
									disableDatesAfter={new Date()}
									allowRange
									multiMonth
								/>
							)}
						</div>
						{/*<div style={{paddingTop: 30}}>*/}
						{/*	<Checkbox checked={compare} onChange={v => {*/}
						{/*		setCompare(v);*/}
						{/*		setCompareDates(v ? getCompareDate(selectedDates) : null)*/}
						{/*	}} label={'Add comparisons data'} />*/}
						{/*</div>*/}
					</Card.Section>
					<Card.Section>
						<Stack>
							<Stack.Item fill>
								<Button onClick={togglePopoverActive}>Cancel</Button>
							</Stack.Item>
							<Button primary onClick={() => {
								handleChange({selectedDates, compareDates})
								togglePopoverActive()
							}}>Apply</Button>
						</Stack>
					</Card.Section>
				</Card>
			</div>
		</Popover>
	);
};

export default Options;

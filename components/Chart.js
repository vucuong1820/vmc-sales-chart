import React, {useState} from "react";
import {Line} from "react-chartjs-2";
import Chart from "chart.js/auto";
import {Card, Stack, Button} from "@shopify/polaris";
import Options from "./Options";
import Table from "./Table";
import {themeChart} from "../constants/themeChart";
import axios from "axios";
import {format} from "date-fns";
import {sendAlert} from "../helpers/utils";
import {themeShop} from "../constants/themeShop";
import {dataSolving} from "../helpers/dataSolving";

const ChartPreview = () => {
	const [datasets, setDatasets] = useState([]);
	const [labels, setLabels] = useState([]);
	const [rows, setRows] = useState([
		["Minimog", 0, 0, 0],
		["Wokiee", 0, 0, 0],
		["Kalles", 0, 0, 0],
		["Shella", 0, 0, 0],
		["Gecko", 0, 0, 0],
		["Ella", 0, 0, 0]
	]);

	const handleChange = async ({selectedDates}) => {
		const result = await fetchData(selectedDates);
		if (result) {
			formatData(result.items);
			const filterData = themeChart.map((theme) => {
				return result.items
					.filter((item) => item.name === theme.label)
					.map((item) => {
						return item.sales;
					});
			});

			setDatasets(() => {
				return themeChart.map((v, i) => {
					return {...v, data: filterData[i]};
				});
			});

			const labels = [
				...new Map(
					result.items.map((item) => [item.created_at, item.created_at])
				).values()
			];
			setLabels(labels);
		}
	};

	const fetchData = async (dates) => {
		const result = await axios.get(
			`/api/chart?startingDay=${format(dates?.start, 'MM/dd/yyyy')}&endingDay=${format(dates?.end, 'MM/dd/yyyy')}`
		);
		return result?.data;
	};

	const formatData = (data) => {
		const filterData = [];

		for (let i = 0; i < themeShop.length; i++) {
			filterData.push({
				items: data.filter((item) => themeShop[i].name === item.name),
				fixedSales: themeShop[i].fixedSales
			});
		}

		setRows(dataSolving(rows, filterData));
	};

	const handleClick = () => {
		sendAlert(rows);
	};

	return (
		<Card>
			<div className={'Polaris-Card__Section'}>
				<Stack alignment={'center'}>
					<Stack.Item fill>
						<Options handleChange={handleChange}/>
					</Stack.Item>
					<Stack.Item>
						<Button onClick={handleClick} plain>Post to Slack</Button>
					</Stack.Item>
				</Stack>
			</div>
			<Table rows={rows}/>
			<Card.Section title="Sales growth through time">
				<Line
					data={{
						datasets: datasets,
						labels: labels
					}}
				/>
			</Card.Section>
		</Card>
	);
};
export default ChartPreview;

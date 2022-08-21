import React, {useEffect, useState} from "react";
import {Line} from "react-chartjs-2";
import {Card, Stack, Button} from "@shopify/polaris";
import Table from "./Table";
import {themeChart} from "../constants/themeChart";
import axios from "axios";
import {format} from "date-fns";
import {sendAlert} from "../helpers/utils";
import {themeShop} from "../constants/themeShop";
import {dataSolving} from "../helpers/dataSolving";

const ChartPreview = ({selectedDates}) => {
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

	useEffect(() => {
		(async () => {
			if (selectedDates) await handleChange()
		})();
	}, [selectedDates])

	const handleChange = async ({}) => {
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
			<Card.Header title="Sales comparison">
				<Button onClick={handleClick} plain>Post to Slack</Button>
			</Card.Header>
			<Table rows={rows}/>
			<Card.Section subdued>
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

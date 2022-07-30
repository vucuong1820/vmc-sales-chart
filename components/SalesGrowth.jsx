import React, {useEffect, useState} from "react";
import {Chart as ChartJS} from 'chart.js/auto';
import {Line} from "react-chartjs-2";
import {Card, Layout, Heading, TextContainer, DisplayText, TextStyle, Stack, Icon} from "@shopify/polaris";
import Options from "./Options";
import {themeChart} from "../constants/themeChart";
import {themeShop} from "../constants/themeShop";
import axios from "axios";
import {format} from "date-fns";
import {getCompareDate} from "../helpers/utils";
import {ArrowUpMinor, ArrowDownMinor} from '@shopify/polaris-icons';

const minimog = themeShop.find(theme => theme.themeId === 33380968);
const minimogChart = themeChart.find(theme => theme.label === 'Minimog');

const SaleGrowthChart = () => {
	const [datasets, setDatasets] = useState([]);
	const [labels, setLabels] = useState([]);
	const [totalSales, setTotalSales] = useState(0);
	const [growthRate, setGrowthRate] = useState(null);
	const [rating, setRating] = useState(5.0);
	let [totalSelectedSales, setTotalSelectedSales] = useState(0);

	const handleChange = async ({selectedDates, compareDates}) => {
		console.log(selectedDates, 'selectedDates');
		const promises = [];
		if (selectedDates) {
			promises.push(fetchData(selectedDates));
		}
		// if (compareDates) {
		//   promises.push(fetchData(compareDates))
		// }
		const results = await Promise.all(promises);
		// const max = Math.max(results?.[0]?.length ?? 0, results?.[1]?.length ?? 0);
		// let labels = [];
		// for (let i = 0; i < max; i++) {
		// 	labels.push(`${results[0]?.[i] ? results[0]?.[i].created_at : ''} ${results[1]?.[i] ? '- ' + results[1]?.[i]?.created_at : ''}`);
		// }
		setLabels(results[0]?.items?.map(item => {
			return item.created_at;
		}));
		totalSelectedSales = 0
		results[0]?.items?.forEach(item => {
			totalSelectedSales += item.sales;
			setRating(item.review)
		});
		setTotalSelectedSales(totalSelectedSales);
		setDatasets(results?.map(result => {
			return {
				...minimogChart,
				borderColor: '#00a19f',
				data: result.items?.map(i => i.quantity + minimog.fixedSales)
			};
		}));

		await fetchPreviousPeriodSales(selectedDates);
	};

	const fetchPreviousPeriodSales = async (selectedDates) => {
		const compareDates = getCompareDate(selectedDates);
		const result = await fetchData(compareDates);
		let sales = 0;
		result?.items?.forEach(item => {
			sales += item.sales;
		});

		const rate = (totalSelectedSales - sales) / sales * 100;
		setGrowthRate(rate);
	};

	const fetchData = async (dates) => {
		const result = await axios.get(
			`/api/chart?startingDay=${format(dates?.start, 'MM/dd/yyyy')}&endingDay=${format(dates?.end, 'MM/dd/yyyy')}&themeId=${minimog.themeId}`
		);
		if (result) {
			setTotalSales(result.data?.totalSales);
		}
		return result?.data;
	};

	return (
		<Card>
			<Card.Section>
				<Stack>
					<Stack.Item fill>
						<DisplayText>Analytics for Minimog</DisplayText>
						<div style={{marginTop: '1.5rem'}}>
							<Options handleChange={handleChange}/>
						</div>
					</Stack.Item>
					<Stack.Item>
						<div style={{paddingRight: 30}}>
							<DisplayText>{rating}</DisplayText>
							<TextStyle variation={"subdued"}>Rating</TextStyle>
						</div>
					</Stack.Item>
					<Stack.Item>
						<DisplayText>{totalSales.toLocaleString('en-US')}</DisplayText>
						<TextStyle variation={"subdued"}>Total sales</TextStyle>
					</Stack.Item>
				</Stack>
			</Card.Section>
			<Card.Section>
				<div style={{paddingBottom: '3rem'}}>
					<TextContainer>
						<Heading>Sales growth</Heading>
						<div style={{display: 'flex', alignItems: 'center'}}>
							<DisplayText>{totalSelectedSales}</DisplayText>
							{growthRate ? <div style={{paddingLeft: 15, display: 'flex', alignItems: 'center'}}>
								<Icon color={growthRate > 0 ? 'success' : 'critical'}
											source={growthRate > 0 ? ArrowUpMinor : ArrowDownMinor}/>
								<span style={{fontSize: '2rem'}}><TextStyle
									variation={growthRate > 0 ? 'positive' : 'negative'}>{growthRate.toFixed(2)}%</TextStyle></span>
							</div> : ''}
						</div>
					</TextContainer>
				</div>
				<Line
					data={{
						datasets: datasets,
						labels: labels
					}}
					options={{
						plugins: {
							legend: {
								display: false
							}
						}
					}}
				/>
			</Card.Section>

		</Card>
	);
};
export default SaleGrowthChart;

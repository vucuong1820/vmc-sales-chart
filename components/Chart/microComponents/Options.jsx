import { Button, DatePicker, Select } from "@shopify/polaris";
import axios from "axios";
import { format, getMonth, getYear } from "date-fns";
import React, { useEffect, useState } from "react";
import { getDateChart } from "../../../helpers/utils";
const Options = ({ setState }) => {
  const [selected, setSelected] = useState("this_week");
  const [{ month, year }, setDate] = useState({
    month: getMonth(new Date(new Date().setMonth(new Date().getMonth()))),
    year: getYear(new Date()),
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState({
    start: new Date(),
    end: new Date(),
  });
  useEffect(() => {
    const getData = async () => {
      let time;
      if (selected === "custom_time") {
        time = {
          start: format(selectedTimeRange.start, "MM/dd/yyyy"),
          end: format(selectedTimeRange.end, "MM/dd/yyyy"),
        };
      } else {
        time = getDateChart(selected);
        setSelectedTimeRange({
          ...selectedTimeRange,
          start: new Date(time.start),
          end: new Date(time.end),
        });
      }
      const { data } = await axios.get(
        `/api/chart?startingDay=${time?.start}&endingDay=${time?.end}`
      );
      setState(data);
    };
    getData();
  }, [selected]);

  const options = [
    { label: "This week", value: "this_week" },
    { label: "Last week", value: "last_week" },
    { label: "This month", value: "this_month" },
    { label: "Select time", value: "custom_time" },
  ];

  const handleClick = async () => {
    let time;
    time = {
      start: format(selectedTimeRange.start, "MM/dd/yyyy"),
      end: format(selectedTimeRange.end, "MM/dd/yyyy"),
    };
    const { data } = await axios.get(
      `/api/chart?startingDay=${time?.start}&endingDay=${time?.end}`
    );
    setState(data);
  };

  return (
    <div style={{ width: "25%" }}>
      <Select
        options={options}
        value={selected}
        onChange={(v) => setSelected(v)}
      />
      {selected === "custom_time" && (
        <div>
          <DatePicker
            month={month}
            year={year}
            onChange={setSelectedTimeRange}
            onMonthChange={(month, year) => setDate({ month, year })}
            selected={selectedTimeRange}
            allowRange
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button onClick={handleClick}>Pick time</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Options;

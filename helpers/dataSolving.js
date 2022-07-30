export const dataSolving = (rows, filterData) => {
  const result = [...rows];
  const data = filterData?.map((theme) => {
    return theme.items?.reduce(
      (prev, cur) => {
        console.log(prev[3], cur.sales)
        prev[0] = cur.name;
        prev[1] = (cur.quantity + theme.fixedSales).toLocaleString('en-US');
        prev[2] = cur.review;
        prev[3] += cur.sales;
        return prev;
      },
      ["", 0, 0, 0]
    );
  });

  result.map((result) => {
    data?.forEach((item) => {
      if (result[0] === item[0]) {
        result[1] = item[1];
        result[2] = item[2];
        result[3] = item[3];
      }
    });
  });

  result.sort((a, b) => {
    return b[3] - a[3];
  });
  return result;
};

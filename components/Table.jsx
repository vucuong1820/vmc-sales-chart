import { Card, DataTable } from "@shopify/polaris";
import React from "react";
const Table = ({rows}) => {

  return (
    <Card.Section>
      <DataTable
        columnContentTypes={["text", "numeric", "numeric", "numeric"]}
        headings={["Name", "All-time sales", "Rating", "Sales"]}
        rows={rows}
      />
    </Card.Section>
  );
};

export default Table;

import { Box, SimpleGrid } from "@chakra-ui/react";
import ComplexTable from "views/admin/orders/components/ComplexTable";
import {
  columnsDataComplex,
} from "views/admin/orders/variables/columnsData";
import tableDataComplex from "views/admin/orders/variables/tableDataComplex.json";
import React, {useEffect} from "react";

export default function Settings() {
  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={[]}  //===> I still want to make this empty
        />
      </SimpleGrid>
    </Box>
  );
}

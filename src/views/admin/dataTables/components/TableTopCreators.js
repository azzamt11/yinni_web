/* eslint-disable */

import {
  Avatar,
  Box,
  Button,
  Flex,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Toast,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import SwitchField from "components/fields/SwitchField";
import * as React from 'react';
import { useCallback } from 'react';

const columnHelper = createColumnHelper();

export default function TopCreatorTable(props) {
  const { tableData, promoteFunction, toast } = props;
  const [sorting, setSorting] = React.useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  let defaultData = tableData;
  console.log(`defaultData = ${JSON.stringify(defaultData, null, 2)}`);
  
  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          NAMA
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Avatar
            color="white"
            name={info.getValue()}
            bg={"#11047A"}
            size="sm"
            w="30px"
            h="30px"
            mr= "10px"
          />
          <Text color={textColor} fontSize="sm" fontWeight="600">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('role', {
      id: 'role',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          ROLE
        </Text>
      ),
      cell: (info) => (
        <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('id', {
      id: 'action', 
      header: () => (
          <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
              ADMIN
          </Text>
      ),
      cell: (info) => {
          const userId = info.getValue();
          const currentRole = info.row.original.role.toUpperCase();
          const isChecked = currentRole === 'ADMIN' || currentRole === 'SUPERADMIN';
          const newRole = 'ADMIN';
          const snackBarText = `Anda yakin ingin mengubah peran pengguna ${info.row.original.name} menjadi ${newRole}?`;

          // Handler function that includes the snackbar/confirmation logic
          const handlePromoteSwitch = (newCheckedState) => {
              // Only run the promote logic if the switch is being turned ON 
              // and the current role is not already an admin/superadmin.
              if (newCheckedState && currentRole === 'USER') {
                  
                  // --- SNACKBAR/CONFIRMATION LOGIC ---
                  
                  // We use a confirmation dialogue first, since Toast is usually non-blocking.
                  if (window.confirm(snackBarText)) {
                        // If confirmed, call the promote function
                        // NOTE: You must update promoteFunction in Settings.jsx to accept (userId, newRole)
                        promoteFunction(userId, newRole); 
                  }
              } else if (!newCheckedState && currentRole === 'ADMIN') {
                    // --- DEMOTION LOGIC (Optional, but included for completeness) ---
                  const demoteRole = 'USER';
                  if (window.confirm(`Anda yakin ingin mengubah peran pengguna ${info.row.original.name} kembali menjadi ${demoteRole}?`)) {
                      promoteFunction(userId, demoteRole);
                  }
              }
          };

          return (
              <Flex align="center">
                  <SwitchField
                      isChecked={isChecked}
                      // Pass the handler that includes the confirmation/snackbar logic
                      onChange={handlePromoteSwitch} 
                      reversed={true}
                      fontSize="sm"
                      mb="20px"
                      // Use the user ID to ensure unique switches
                      id={`promote-switch-${userId}`} 
                      label=""
                      // snackBarText is handled in the onChange wrapper, not the SwitchField itself
                  />
              </Flex>
          );
      },
  }),
];
  const [data, setData] = React.useState(() => [...defaultData]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });
  return (
    <Flex
      direction="column"
      w="100%"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex
        align={{ sm: 'flex-start', lg: 'center' }}
        justify="space-between"
        w="100%"
        px="22px"
        pb="20px"
        mb="10px"
        boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
      >
        <Text color={textColor} fontSize="xl" fontWeight="600">
          Daftar User
        </Text>
        <Button variant="action">See all</Button>
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      pe="10px"
                      borderColor={borderColor}
                      cursor="pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Flex
                        justifyContent="space-between"
                        align="center"
                        fontSize={{ sm: '10px', lg: '12px' }}
                        color="gray.400"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: '',
                          desc: '',
                        }[header.column.getIsSorted()] ?? null}
                      </Flex>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table
              .getRowModel()
              .rows.slice(0, 11)
              .map((row) => {
                return (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Td
                          key={cell.id}
                          fontSize={{ sm: '14px' }}
                          minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                          borderColor="transparent"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
}

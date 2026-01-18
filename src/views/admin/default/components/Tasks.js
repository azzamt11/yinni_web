import {
  Box,
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Checkbox,
} from "@chakra-ui/react";

// Custom components
import Card from "components/card/Card.js";
import Menu from "components/menu/MainMenu";
import IconBox from "components/icons/IconBox";

// Assets
import { MdCheckBox, MdDragIndicator } from "react-icons/md";
import React from "react";

export default function Conversion({ tasksData = [], ...rest }) {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const brandColor = useColorModeValue("brand.500", "brand.400");

  return (
    <Card p="20px" align="center" direction="column" w="100%" {...rest}>
      <Flex alignItems="center" w="100%" mb="30px">
        <IconBox
          me="12px"
          w="38px"
          h="38px"
          bg={boxBg}
          icon={<Icon as={MdCheckBox} color={brandColor} w="24px" h="24px" />}
        />
        <Text color={textColor} fontSize="lg" fontWeight="700">
          Tasks
        </Text>
        <Menu ms="auto" />
      </Flex>

      <Box px="11px" w="100%">
        {tasksData.length === 0 ? (
          <Flex justify="center" align="center" py="40px">
            <Text color="gray.400" fontSize="md">
              Tidak Ada Task
            </Text>
          </Flex>
        ) : (
          tasksData.map((task, index) => (
            <Flex key={index} mb="20px">
              <Checkbox
                me="16px"
                colorScheme="brandScheme"
                defaultChecked={task.checked}
              />
              <Text
                fontWeight="bold"
                color={textColor}
                fontSize="md"
                textAlign="start"
              >
                {task.name}
              </Text>
              <Icon
                ms="auto"
                as={MdDragIndicator}
                color="secondaryGray.600"
                w="24px"
                h="24px"
              />
            </Flex>
          ))
        )}
      </Box>
    </Card>
  );
}

// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";

export default function Upload(props) {
  const { used, total, ...rest } = props;
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";

  return (
    <Card {...rest} mb='20px' align='center' p='20px'>
      <Flex h='100%' direction='column'>
        <Flex direction='column' align='center'>
          <Text
            color={textColorPrimary}
            fontWeight='bold'
            textAlign='start'
            fontSize='2xl'
            mt='10px'> {/* Reduced from 50px to 10px */}
            Prompt what you want
          </Text>
          <Text
            color={textColorSecondary}
            fontSize='md'
            my='10px'
            textAlign='center'>
            A white thick clothes that is suitable for winter 
          </Text>
          <Button
            variant='brand'
            fontWeight='500'
            w='140px'
            mt='20px'
            mb='10px'> {/* Reduced from 50px to 10px */}
            Seacrh
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
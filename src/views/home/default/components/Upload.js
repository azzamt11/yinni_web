// Chakra imports
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";

export default function Upload(props) {
  // Destructure onSearch and isLoading from props
  const { onSearch, isLoading, ...rest } = props;
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";

  const defaultPrompt = "A white thick clothes that is suitable for winter";

  return (
    <Card {...rest} mb='20px' align='center' p='20px'>
      <Flex h='100%' direction='column' justify="center">
        <Flex direction='column' align='center'>
          <Text
            color={textColorPrimary}
            fontWeight='bold'
            textAlign='center'
            fontSize='2xl'
            mt='10px'>
            Prompt what you want
          </Text>
          <Text
            color={textColorSecondary}
            fontSize='md'
            my='10px'
            textAlign='center'>
            {defaultPrompt}
          </Text>
          <Button
            variant='brand'
            fontWeight='500'
            w='140px'
            mt='20px'
            mb='10px'
            isLoading={isLoading}
            onClick={() => onSearch(defaultPrompt)} // Trigger the callback
          >
            Search
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
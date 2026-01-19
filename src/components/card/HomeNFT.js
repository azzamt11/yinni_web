// Chakra imports
import {
  AvatarGroup,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
// Assets
import React, { useState } from "react";

const formatDateToIndonesian = (isoDateString) => {
  if (!isoDateString) return '';
  try {
    const date = new Date(isoDateString);
    // Use 'id-ID' locale and specify the date parts
    return new Intl.DateTimeFormat('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return isoDateString; // Fallback to original string on error
  }
};

const formatNumberString = (numberString) => {
  // 1. Remove non-digit characters and convert to a number
  const numberValue = Number(numberString.replace(/[^\d]/g, ''));

  // 2. Check if the conversion resulted in a valid number
  if (isNaN(numberValue)) {
    return numberString; // Return original string if it wasn't a valid number
  }

  // 3. Use Intl.NumberFormat for robust localization
  // We specify 'id-ID' (Indonesia) locale because it uses '.' as a thousands separator.
  // Change the locale string if you need a different format (e.g., 'en-US' uses ',').
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numberValue);
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8088";

export default function HomeNFT(props) {
  const { image, name, author, date, currentbid, onBuy} = props;
  const [like, setLike] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");
  const textColorBid = useColorModeValue("brand.500", "white");

  console.log(`HomeNFT: image = ${image}`);

  return (
    <Card p="20px" minH="200px">
      <Flex direction="column" h="100%">
        <Box w="100%" h="250px" mb="20px">
          <Image
            src={image}
            w="100%"
            h="100%"
            borderRadius="20px"
            objectFit="cover"
          />
        </Box>
        <Flex flexDirection='column' justify='space-between' h='25%'>
          <Flex
            justify='space-between'
            direction={{
              base: "row",
              md: "column",
              lg: "row",
              xl: "column",
              "2xl": "row",
            }}
            mb='auto'>
            <Flex direction='column'>
              <Text
                color={textColor}
                fontSize={{
                  base: "xl",
                  md: "lg",
                  lg: "lg",
                  xl: "lg",
                  "2xl": "md",
                  "3xl": "lg",
                }}
                mb='5px'
                fontWeight='900'
                me='14px'>
                {name}
              </Text>
              <Text
                color={textColor}
                fontSize={{
                  base: "sm",
                  md: "sm",
                  lg: "sm",
                  xl: "sm",
                  "2xl": "sm",
                  "3xl": "sm",
                }}
                mb='5px'
                me='14px'>
                {formatDateToIndonesian(date)}
              </Text>
              <Text
                color='secondaryGray.600'
                fontSize={{
                  base: "sm",
                }}
                fontWeight='400'
                me='14px'>
                {author}
              </Text>
            </Flex>
          </Flex>
          <Flex
            align='start'
            justify='space-between'
            direction={{
              base: "row",
              md: "column",
              lg: "row",
              xl: "column",
              "2xl": "row",
            }}
            mt='25px'>
            <Text fontWeight='500' fontSize='15px' color={textColorBid}>
              {`$1 ${formatNumberString(currentbid)}`}
            </Text>
            <Flex align='center' direction='row'>
              <Button
                variant='darkBrand'
                color='white'
                fontSize='sm'
                fontWeight='500'
                borderRadius='70px'
                px='15px'
                mr='5px'
                onClick={onBuy}
                py='5px'>
                Detail
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

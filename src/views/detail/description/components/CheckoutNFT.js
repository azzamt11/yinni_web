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

export default function CheckoutNFT(props) {
  const { image, name, author, date, currentbid, onBuy} = props;
  const [like, setLike] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");
  const textColorBid = useColorModeValue("brand.500", "white");

  console.log(`CheckoutNFT: image = ${API_BASE_URL}${image}`);
  
  return (
    // The parent container (Card) will naturally span the full width of its column
    // The parent component (SimpleGrid/Grid) will control the overall card width.
    <Card p="20px" minH="180px"> 
      
      {/* 1. Change the main Flex direction to 'row' to put elements side-by-side */}
      <Flex direction="row" h="100%" gap="20px" align="start"> 
        
        {/* 2. Image container: Give it a fixed, smaller width and height */}
        <Box w="150px" h="150px" mb="0">
          <Image
            src={`${API_BASE_URL}${image}`}
            w="100%"
            h="100%"
            borderRadius="16px" // Slightly smaller border radius looks cleaner with fixed sizing
            objectFit="cover"
          />
        </Box>
        
        {/* 3. Text/Details Container: Allow it to take up the remaining space */}
        <Flex flexDirection='column' justify='space-between' flex='1' minH="150px"> 
          <Flex flexDirection='column'>
            
            {/* Package Name */}
            <Text
              color={textColor}
              fontSize='lg' // Simplified font size
              mb='5px'
              fontWeight='bold'
              me='14px'>
              {name}
            </Text>

            {/* Date */}
            <Text
              color={textColor}
              fontSize='md' // Simplified font size
              mb='5px'
              fontWeight='semibold' // Slightly less bold for date
              me='14px'>
              {formatDateToIndonesian(date)}
            </Text>
            
            {/* Author/Category */}
            <Text
              color='secondaryGray.600'
              fontSize='sm'
              fontWeight='400'
              me='14px'>
              {author}
            </Text>
          </Flex>
          
          {/* Price and Button */}
          <Flex
            align='center' // Center vertically
            justify='space-between' // Space between price and button
            direction='row' // Ensure they stay in a row
            mt='15px'>
            
            {/* Price */}
            <Text fontWeight='700' fontSize='18px' color={textColorBid}>
              {`Rp. ${formatNumberString(currentbid)}`}
            </Text>
            
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
// Chakra imports
import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
  SimpleGrid,
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
    return isoDateString;
  }
};

const formatNumberString = (numberString) => {
  // 1. Remove non-digit characters and convert to a number
  const numberValue = Number(numberString.replace(/[^\d]/g, ''));

  // 2. Check if the conversion resulted in a valid number
  if (isNaN(numberValue)) {
    return numberString;
  }

  // 3. Use Intl.NumberFormat for robust localization
  // We specify 'id-ID' (Indonesia) locale because it uses '.' as a thousands separator.
  // Change the locale string if you need a different format (e.g., 'en-US' uses ',').
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numberValue);
};

export default function NFT(props) {
  const { image, name, author, date, currentbid, images, onEdit, onDelete } = props;
  const textColor = useColorModeValue("navy.700", "white");
  const textColorBid = useColorModeValue("brand.500", "white");

  // Determine if we should show a grid of images or a single image
  // 'images' is expected to be an array. If empty, we fallback to 'image' prop.
  const hasMultipleImages = images && images.length > 0;

  return (
    <Card p="20px" minH="330px">
      <Flex direction="column" h="100%">
        {/* IMAGE CONTAINER */}
        <Box w="100%" mb="20px">
          {hasMultipleImages ? (
            <SimpleGrid
              columns={{ base: 1, md: 1, lg: 2, xl: 3 }}
              spacing="10px"
            >
              {(images.length > 3 ? images.slice(0, 3) : images).map((img, index) => (
                <AspectRatio key={index} ratio={1} w="100%">
                  <Image
                    src={img}
                    borderRadius="15px"
                    objectFit="cover"
                    alt={name}
                  />
                </AspectRatio>
              ))}
            </SimpleGrid>
          ) : (
            <AspectRatio ratio={1} w="100%">
              <Image
                src={image}
                borderRadius="20px"
                objectFit="cover"
                alt={name}
              />
            </AspectRatio>
          )}
        </Box>

        {/* CONTENT SECTION */}
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
                fontSize={{ base: "xl", md: "lg", "2xl": "md", "3xl": "lg" }}
                mb='5px'
                fontWeight='900'
                me='14px'>
                {name}
              </Text>
              <Text
                color={textColor}
                fontSize="sm"
                mb='5px'
                me='14px'>
                {formatDateToIndonesian(date)}
              </Text>
              <Text
                color='secondaryGray.600'
                fontSize="sm"
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
              {`$ ${formatNumberString(currentbid)}`}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

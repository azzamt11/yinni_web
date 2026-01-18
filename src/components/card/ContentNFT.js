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
import { FaPlay } from "react-icons/fa";
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

export default function ContentNFT(props) {
  const { image, name, author, date, currentbid, onEdit, onDelete, contentUrl} = props;
  const [like, setLike] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");
  const textColorBid = useColorModeValue("brand.500", "white");
  const isVideo = author === "Video";

  return (
    <Card p="20px">
      <Flex direction="column">
        <Box
          role="group"
          w="100%"
          position="relative"
          pb="66.66%"
          mb="20px"
          cursor={isVideo ? "pointer" : "default"}
        >
          <Image
            src={image}
            w="100%"
            h="100%"
            position="absolute"
            top="0"
            left="0"
            borderRadius="20px"
            objectFit="cover"
          />

          {/* Play button + overlay, visible only on hover */}
          {isVideo && (
            <Link
              href={`/video-player?url=${encodeURIComponent(contentUrl)}`}
              target="_blank"
              position="absolute"
              top="0"
              left="0"
              w="100%"
              h="100%"
              borderRadius="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              opacity="0"
              transition="0.2s ease"
              _groupHover={{ opacity: 1, bg: "rgba(0,0,0,0.45)" }}
            >
              <Icon
                as={FaPlay}
                w="55px"
                h="55px"
                color="white"
                p="12px"
                bg="brand.500"
                borderRadius="50%"
                transition="0.2s"
                _hover={{ bg: "brand.600" }}
              />
            </Link>
          )}
        </Box>
        {/* 👆 END OF IMAGE CONTAINER FIX */}
        <Flex flexDirection='column' justify='space-between'>
          <Flex
            justify='space-between'
            direction={{
              base: "row",
              md: "column",
              lg: "row",
              xl: "column",
              "2xl": "row",
            }}>
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
            <Flex align='center' direction='row'>
              <Button
                variant='darkBrand'
                color='white'
                fontSize='sm'
                fontWeight='500'
                borderRadius='70px'
                px='15px'
                mr='5px'
                onClick={onEdit}
                py='5px'>
                Edit
              </Button>
              <Button
                variant='darkRed'
                color='white'
                fontSize='sm'
                fontWeight='500'
                borderRadius='70px'
                px='15px'
                onClick={onDelete}
                py='5px'>
                Hapus
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

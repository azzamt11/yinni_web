// Chakra imports
import { Avatar, Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React from "react";

export default function ProfileBanner(props) {
  const { banner, avatar, name, job } = props;
  
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );
  const avatarBg = useColorModeValue("brand.500", "brand.400");

  // Helper to extract exactly 2 initials, ignoring "Welcome, "
  const getInitials = (fullName) => {
    if (!fullName) return "";
    
    // Remove "Welcome, " if it exists to get the actual name
    const actualName = fullName.replace(/Welcome, /i, "").trim();
    const parts = actualName.split(" ");
    
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return actualName.substring(0, 2).toUpperCase();
  };

  return (
    <Card mb={{ base: "0px", lg: "20px" }} align='center' p='20px'>
      <Avatar
        mx='auto'
        // Pass the 2-letter result to the name prop
        name={getInitials(name)}
        // Remove 'src={avatar}' so the initials show up
        h='87px'
        w='87px'
        mt='20px'
        fontSize={'25px'}
        border='4px solid'
        borderColor={borderColor}
        bg={avatarBg}
        color='white'
        fontWeight='bold'
      />
      <Text color={textColorPrimary} fontWeight='bold' fontSize='xl' mt='10px'>
        {name}
      </Text>
      <Text color={textColorSecondary} fontSize='sm'>
        {job}
      </Text>
    </Card>
  );
}
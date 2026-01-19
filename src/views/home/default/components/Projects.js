// Chakra imports
import { Text, useColorModeValue, SimpleGrid } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
import Project from "views/home/default/components/Project";

export default function Projects(props) {
  // Destructure data from props
  const { data } = props;

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  return (
    <Card mb={{ base: "0px", "2xl": "20px" }}>
      <Text
        color={textColorPrimary}
        fontWeight='bold'
        fontSize='2xl'
        mt='10px'
        mb='4px'>
        Products
      </Text>

      <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
        {data && data.length > 0 
          ? "These are products based on your prompt" 
          : "No results match the prompt"}
      </Text>

      <SimpleGrid columns={{ base: 1, lg: 1, xl: 2 }} spacing='25px'>
        {data && data.map((v, index) => (
          <Project
            key={index}
            boxShadow={cardShadow}
            // FIXED: Map 'primary_image' from JSON to the 'image' prop
            image={v.primary_image} 
            // FIXED: Map 'average_rating' or 'brand' if 'ranking' is missing in JSON
            ranking={v.brand || v.average_rating} 
            link={v.link || "#"}
            title={v.title}
            detail={v.seller}
          />
        ))}
      </SimpleGrid>
    </Card>
  );
}
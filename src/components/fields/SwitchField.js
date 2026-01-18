// Chakra imports
import {
  Box,
  Flex,
  FormLabel,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import React from "react";

export default function Default(props) {
  const {
    id,
    label,
    isChecked, // The current state (controlled prop)
    onChange,  // The handler function (controlled prop)
    desc,
    textWidth,
    reversed,
    fontSize,
    // Add snackBarText as a prop (though it's not used directly here, 
    // it's passed along in the component structure).
    snackBarText, 
    ...rest
  } = props;

  // REMOVED: Internal state (setChecked) is removed as this should be a controlled component.
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  // The actual switch change handler
  const handleSwitchChange = (event) => {
      // The onChange prop should contain the snackbar and promote logic now.
      if (onChange) {
          // Pass the new checked state (which is event.target.checked) to the parent handler
          onChange(event.target.checked); 
      }
  };


  return (
    <Box w="100%" fontWeight="500" {...rest}>
      {reversed ? (
        <Flex align="center" borderRadius="16px">
          {/* Switch Component (handles both checked/unchecked states) */}
          <Switch
            isChecked={isChecked} // Use the prop for the checked state
            id={id}
            variant="main"
            colorScheme="brandScheme"
            size="md"
            // Use the combined handler
            onChange={handleSwitchChange} 
          />
          <FormLabel
            ms="15px"
            htmlFor={id}
            _hover={{ cursor: "pointer" }}
            direction="column"
            mb="0px"
            maxW={textWidth ? textWidth : "75%"}
          >
            <Text color={textColorPrimary} fontSize="md" fontWeight="500">
              {label}
            </Text>
            <Text
              color="secondaryGray.600"
              fontSize={fontSize ? fontSize : "md"}
            >
              {desc}
            </Text>
          </FormLabel>
        </Flex>
      ) : (
        <Flex justify="space-between" align="center" borderRadius="16px">
          <FormLabel
            htmlFor={id}
            _hover={{ cursor: "pointer" }}
            direction="column"
            maxW={textWidth ? textWidth : "75%"}
          >
            <Text color={textColorPrimary} fontSize="md" fontWeight="500">
              {label}
            </Text>
            <Text
              color="secondaryGray.600"
              fontSize={fontSize ? fontSize : "md"}
            >
              {desc}
            </Text>
          </FormLabel>
           {/* Switch Component (handles both checked/unchecked states) */}
          <Switch
            isChecked={isChecked} // Use the prop for the checked state
            id={id}
            variant="main"
            colorScheme="brandScheme"
            size="md"
            // Use the combined handler
            onChange={handleSwitchChange} 
          />
        </Flex>
      )}
    </Box>
  );
}
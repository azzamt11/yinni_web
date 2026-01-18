import React from "react";

// Chakra imports
import { Flex, useColorModeValue, Image, Text} from "@chakra-ui/react";
import { isAuthenticated, hasRole } from "../../../Auth";

// Custom components
import logo from '../../../assets/img/logo.svg';
import { HSeparator } from "components/separator/Separator";

// NOTE: You must import or define the hasRole function.
// e.g., import { hasRole } from 'path/to/auth/utility';

export function SidebarBrand() {
  // Assuming 'hasRole' is defined in the parent scope, 
  // or, more correctly, obtained from a custom hook like useAuth()

  // Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <Image src={logo} w='150px' mb='20px' mt='20px' />
      <Flex align='center' direction='row' mb='0px' spacing='10px'>
        <Text
          fontSize='2lg' 
          fontWeight='bold'
          color='brand.800'
          mr='10px'
          textAlign='center'>
          YINNI
        </Text>
        
        {hasRole(["ADMIN", "SUPERADMIN"]) ? (
          <Text
            fontSize='2lg'
            fontWeight='normal'
            color='gray.700'
            textAlign='center'>
            Admin Dashboard
          </Text>
        ) : (
          null
        )}
      </Flex>
      <Text
        fontSize='14px' 
        fontWeight='normal'
        color='gray.600'
        mr='0px'
        textAlign='center'
        mb='20px'>
        AI-Assisted Shopping
      </Text>
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
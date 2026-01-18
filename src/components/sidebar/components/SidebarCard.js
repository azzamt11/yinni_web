import {
  Flex,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import logo from '../../../assets/img/logo.svg';
import React from "react";

export default function SidebarDocs() {
  const bgColor = "linear-gradient(135deg, #15c662ff 0%, #219c7dff 100%)";
  const borderColor = useColorModeValue("white", "navy.800");

  return (
    <Flex
      justify='center'
      direction='column'
      align='center'
      bg={bgColor}
      borderRadius='30px'
      position='relative'
      p='20px'
    >
      <Link 
        href='https://https://yinni.travel/' 
        target='_blank' 
        display='flex' 
        flexDirection='column' 
        alignItems='center'
      >
        <Image src={logo} w='140px' mb='20px' mt='20px' />
        <Text
          fontSize='sm'
          color='white'
          fontWeight='500'
          textAlign='center'
          mb='16px'
          px='12px'>
          Yinni
        </Text>
      </Link>
    </Flex>
  );
}
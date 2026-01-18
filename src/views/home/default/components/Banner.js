import React from "react";
import Carousel from "./Carousel";

// Chakra imports
import { Button, Flex, Link, Text, Box } from "@chakra-ui/react";

// Assets for multiple slides
import banner1 from "assets/img/nfts/NftBanner1.png"; // Your original image
import banner2 from "assets/img/nfts/NftBanner1.png"; // A new image

export default function Banner() {

  // 1. Define the data for each carousel slide
  const carouselData = [
    {
      bgImage: banner1,
      content: (
        <>
          <Text
            fontSize={{ base: "24px", md: "34px" }}
            color='white'
            mb='14px'
            maxW={{ base: "100%", md: "64%", lg: "46%", xl: "70%", "2xl": "50%", "3xl": "42%", }}
            fontWeight='700'
            lineHeight={{ base: "32px", md: "42px" }}>
            Paket Wisata banyak, Pesan dengan mudah dan nggak pake ribet
          </Text>
          <Text
            fontSize='md'
            color='#E3DAFF'
            maxW={{ base: "100%", md: "64%", lg: "40%", xl: "56%", "2xl": "46%", "3xl": "34%", }}
            fontWeight='500'
            mb='40px'
            lineHeight='28px'>
            Ayo berwisata bersama Yinni
          </Text>
          <Flex align='center'>
            <Button
              bg='white'
              color='black'
              fontWeight='500'
              fontSize='14px'
              py='20px'
              px='27'
              me='38px'>
              Pelajari
            </Button>
            <Link><Text color='white' fontSize='sm' fontWeight='500'>Tonton video</Text></Link>
          </Flex>
        </>
      ),
    },
    {
      bgImage: banner2, // Different background image for the second slide
      content: (
        <>
          <Text
            fontSize={{ base: "24px", md: "34px" }}
            color='white'
            mb='14px'
            maxW={{ base: "100%", md: "64%", lg: "46%", xl: "70%", "2xl": "50%", "3xl": "42%", }}
            fontWeight='700'
            lineHeight={{ base: "32px", md: "42px" }}>
            Ada paket terbaru promo, Wisata keluar negeri tanpa ribet! 🎉
          </Text>
          <Text
            fontSize='md'
            color='#E3DAFF'
            maxW={{ base: "100%", md: "64%", lg: "40%", xl: "56%", "2xl": "46%", "3xl": "34%", }}
            fontWeight='500'
            mb='40px'
            lineHeight='28px'>
            Jangan sampai ketinngalan promonya...
          </Text>
          <Flex align='center'>
            <Button
              bg='white'
              color='black'
              fontWeight='500'
              fontSize='14px'
              py='20px'
              px='27'
              me='38px'>
              Pelajari
            </Button>
            <Link><Text color='white' fontSize='sm' fontWeight='500'>Tonton Video</Text></Link>
          </Flex>
        </>
      ),
    },
    // Add more slides here...
  ];

  // 2. Render the Carousel component with the data
  return (
    <Box>
      <Carousel items={carouselData} />
    </Box>
  );
}
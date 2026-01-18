// --- src/components/Carousel.jsx (Updated for Sliding Effect) ---

import React, { useState, useEffect } from "react";
import { Box, Flex, IconButton } from "@chakra-ui/react"; 
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const Carousel = ({ items }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = items.length;
  const CAROUSEL_HEIGHT = { base: "250px", md: "350px", lg: "350px" };

  // Function to move to the next slide
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  // Function to move to the previous slide
  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  // 1. CALCULATE TRANSFORM: Shifts the container left by a multiple of 100% 
  //    of the viewport (the outer Box)
  const slideTransform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;

  useEffect(() => {
    const interval = setInterval(() => {
        nextSlide();
    }, 4000); // Change the delay as needed (ms)

    return () => clearInterval(interval); // Cleanup on unmount
    }, [currentSlide]); 

  return (
    <Box 
      position="relative" 
      overflow="hidden" 
      borderRadius='30px' 
      height={CAROUSEL_HEIGHT} 
    >
      {/* --- 2. Slides Wrapper (Handles the sliding movement) --- */}
      <Flex
        // Total width must be 100% multiplied by the number of slides
        width={`${totalSlides * 100}%`} 
        height="100%"
        transition="transform 0.5s ease-in-out" 
        transform={slideTransform} 
      >
        {/* --- 3. Render all slides inline --- */}
        {items.map((item, index) => (
          <Flex
            key={index}
            direction='column'
            flexShrink={0} // Crucial: Prevents slides from shrinking
            
            // FIX IS HERE: Each slide must be 100% / totalSlides wide. 
            // When combined, they equal the wrapper's width.
            width={`${100 / totalSlides}%`} 
            
            height="100%"
            boxSizing='border-box'
            
            // --- Content/Style from the original Banner ---
            bgImage={item.bgImage} 
            bgSize='cover' 
            bgPosition='center'
            bgRepeat='no-repeat'
            py={{ base: "30px", md: "56px" }}
            px={{ base: "30px", md: "64px" }}
          >
            {item.content}
          </Flex>
        ))}
      </Flex>
      
      {/* --- Navigation Controls (Buttons) --- */}
      {/* ... (Navigation Controls and Dots remain the same as they were before) ... */}
       <IconButton
        icon={<ChevronLeftIcon w={6} h={6} />}
        aria-label="Previous Slide"
        onClick={prevSlide}
        position="absolute"
        left="5"
        top="50%"
        transform="translateY(-50%)"
        borderRadius="full"
        bg="whiteAlpha.400"
        color="white"
        _hover={{ bg: "whiteAlpha.600" }}
        _active={{ bg: "whiteAlpha.700" }}
        size="lg"
      />
      <IconButton
        icon={<ChevronRightIcon w={6} h={6} />}
        aria-label="Next Slide"
        onClick={nextSlide}
        position="absolute"
        right="5"
        top="50%"
        transform="translateY(-50%)"
        borderRadius="full"
        bg="whiteAlpha.400"
        color="white"
        _hover={{ bg: "whiteAlpha.600" }}
        _active={{ bg: "whiteAlpha.700" }}
        size="lg"
      />

      {/* --- Optional: Slide Dots/Indicators --- */}
      <Flex justify="center" position="absolute" bottom="4" width="100%">
        {items.map((_, index) => (
          <Box
            key={index}
            height="8px"
            width="8px"
            borderRadius="full"
            bg={index === currentSlide ? "white" : "whiteAlpha.400"}
            mx="2"
            cursor="pointer"
            onClick={() => setCurrentSlide(index)}
            transition="background 0.3s"
          />
        ))}
      </Flex>
    </Box>
  );
};

export default Carousel;
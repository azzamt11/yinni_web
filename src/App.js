import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect, CSSProperties } from 'react';
import AuthLayout from './layouts/auth';
import HomeLayout from './layouts/home';
import {
  ChakraProvider,
  Box,
  Flex,
  Image,  
  keyframes    
} from '@chakra-ui/react';
import initialTheme from './theme/theme';
import logo from './assets/img/logo.svg';

// --- 2. Loading Splash Screen Component (Three Dots Loader) ---
function LoadingScreen() {
  const brandColor = initialTheme.colors.brand ? initialTheme.colors.brand[500] : '#22c55e';

  // Keyframes for fade in/out
  const fade = keyframes`
    0% { opacity: 0.2; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1); }
    100% { opacity: 0.2; transform: scale(0.8); }
  `;

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      w="100vw"
      h="100vh"
      bg="white"
      overflow="hidden"
    >
      <Image 
        src={logo} 
        w="230px" 
        h="auto" 
        mb="25"
      />

      {/* 🚀 Three-dot loader */}
      <Flex gap="6" mb="6">
        <Box
          w="12px"
          h="12px"
          borderRadius="6px"
          bg={brandColor}
          style={{ animationDelay: "0s" }}
          animation={`${fade} 1.2s ease-in-out infinite`}
        />
        <Box
          w="12px"
          h="12px"
          borderRadius="6px"
          bg={brandColor}
          style={{ animationDelay: "0.3s" }}
          animation={`${fade} 1.2s ease-in-out infinite`}
        />
        <Box
          w="12px"
          h="12px"
          borderRadius="6px"
          bg={brandColor}
          style={{ animationDelay: "0.6s" }}
          animation={`${fade} 1.2s ease-in-out infinite`}
        />
      </Flex>
    </Flex>
  );
}



// --- 3. Main Component (Unchanged logic) ---
export default function Main() {
  const [loading, setLoading] = useState(true); 
  const [currentTheme, _] = useState(initialTheme);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (!loading) {
        document.body.style.overflow = 'unset';
    }
  }, [loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route path="home/*" element={<HomeLayout />} />
        <Route path="/" element={<Navigate to="auth/sign-in" replace />} />
        {/* 🚀 ADD THIS: Catch-all route to prevent blank screens on unknown URLs */}
        <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
      </Routes>
    </ChakraProvider>
  );
}
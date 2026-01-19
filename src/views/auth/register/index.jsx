import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { saveAuth, getToken, hasRole } from "../../../Auth"; // Not needed for registration immediately
// React Router import
import { NavLink } from "react-router-dom";
// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast, // Added useToast for better feedback than alert
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/background.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://76.13.17.200:8000";

function SignUp() { // Renamed from SignIn to SignUp
  // Chakra color mode
  const textColor = "navy.700";
  const textColorSecondary = "gray.400";
  const textColorBrand = "brand.500";
  const brandStars = "brand.500";

  // State for Registration fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState(""); // New state for confirmation
  const [loading, setLoading] = useState(false);
  
  // State for Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // New state for confirmation visibility
  
  const navigate = useNavigate();
  const toast = useToast(); // Initialize toast

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowConfirm = () => setShowConfirm(!showConfirm); // Handler for confirm password

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Frontend Password Confirmation Check
    if (password !== passwordConfirm) {
        toast({
            title: "Registration Failed",
            description: "Passwords do not match.",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
        setLoading(false);
        return;
    }

    try {
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // --- API Call for Registration ---
        const res = await axios.post(`${API_BASE_URL}/v1/auth/sign-up`, { 
            name: name, // Send name as 'name' to match backend model
            email, 
            password
        });
        
        // Check for success (assuming backend sends a 201 status and a success message)
        const message = res.data.message || "Registration successful!";
        
        toast({
            title: "Success",
            description: message,
            status: "success",
            duration: 5000,
            isClosable: true,
        });

        // Redirect to login page after successful registration
        navigate("/auth/sign-in", { replace: true });

    } catch (err) {
      console.error("Registration error", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Registration failed";
      
      toast({
          title: "Registration Failed",
          description: msg,
          status: "error",
          duration: 5000,
          isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  // Removed useEffect and remember-me checkbox since they are for logging in

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Sign Up
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Enter your details to create an account!
          </Text>
        </Box>
        
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          
          <Flex align='center' mb='25px'>
            <HSeparator />
          </Flex>
          
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <FormControl color="white" bgColor={"white"}>
              
              {/* --- Name Field --- */}
              <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                mb='8px'>
                Name<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant='auth'
                fontSize='sm'
                color="secondaryGrey.800"
                borderColor='gray.400'
                textColor={"black"}
                placeholder='Your preferred name'
                mb='24px'
                fontWeight='500'
                size='lg'
                onChange={(e) => setName(e.target.value)}
              />

              {/* --- Email Field --- */}
              <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                mb='8px'>
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant='auth'
                fontSize='sm'
                textColor={"black"}
                type='email'
                color="secondaryGrey.800"
                borderColor='gray.400'
                placeholder='mail@example.com' 
                mb='24px'
                fontWeight='500'
                size='lg'
                onChange={(e) => setEmail(e.target.value)}
              />
              
              {/* --- Password Field --- */}
              <FormLabel
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                display='flex'>
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size='md' mb='24px'>
                <Input
                  isRequired={true}
                  fontSize='sm'
                  placeholder='Min. 8 characters'
                  size='lg'
                  color="secondaryGrey.800"
                  borderColor='gray.400'
                  type={showPassword ? "text" : "password"}
                  variant='auth'
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement display='flex' alignItems='center' mt='4px'>
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={showPassword ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleShowPassword}
                  />
                </InputRightElement>
              </InputGroup>

              {/* --- Password Confirmation Field --- */}
              <FormLabel
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                display='flex'>
                Confirm Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size='md'>
                <Input
                  isRequired={true}
                  fontSize='sm'
                  placeholder='Repeat your password'
                  mb='24px'
                  color="secondaryGrey.800"
                  borderColor='gray.400'
                  size='lg'
                  type={showConfirm ? "text" : "password"}
                  variant='auth'
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <InputRightElement display='flex' alignItems='center' mt='4px'>
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={showConfirm ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleShowConfirm}
                  />
                </InputRightElement>
              </InputGroup>
              
              <Button
                fontSize='sm'
                variant='brand'
                fontWeight='500'
                w='100%'
                h='50'
                isLoading={loading}
                type="submit"
                loadingText="Registering..."
                mb='24px'>
                Sign Up
              </Button>
              
            </FormControl>
          </form>
          
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <Text color={textColorSecondary} fontWeight='400' fontSize='14px'>
              Already have an account?
              <NavLink to='/auth/sign-in'>
                <Text
                  color={textColorBrand}
                  as='span'
                  ms='5px'
                  fontWeight='500'>
                  Sign In
                </Text>
              </NavLink>
            </Text>
          </Flex>
          
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignUp;
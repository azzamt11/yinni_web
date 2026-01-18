import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { saveAuth, getToken, hasRole } from "../../../Auth";
// React Router import
import { NavLink } from "react-router-dom";
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/background.png";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://76.13.17.200:8000";

function SignIn() {
  // Chakra color mode
  const textColor = "navy.900";
  const textColorSecondary = "gray.900";
  const textColorDetails = "navy.700";
  const textColorBrand = "brand.800";
  const brandStars = "brand.800";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 1200));
        const res = await axios.post(
          `${API_BASE_URL}/v1/auth/sign-in`,
          { email, password }
        );

        console.log("res.data =", res.data);

        const token = res.data?.accessToken;
        const user = res.data?.user;

        if (!token || !user) {
            console.log("STEP 3: Invalid response from server - missing token or user");
            alert("Invalid response from server");
            setLoading(false);
            return;
        }

        saveAuth(token, user, remember);
        if(hasRole(["ADMIN", 'SUPERADMIN'])) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/user/default", { replace: true });
        }
    } catch (err) {
      console.error("Login error", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Login failed";
      alert(msg); 
    } finally {
      setLoading(false);
    }
  }

  const [remember, setRemember] = useState(false);

  React.useEffect(() => {
    const token = getToken();
    if (token) {
      console.log("Already authenticated → redirect");
      if(hasRole(["ADMIN", 'SUPERADMIN'])) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home/default", { replace: true });
      }
    }
  }, [navigate]);

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
            Sign In
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Enter your email and password to sign in!
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
            <HSeparator color='gray.400'/>
          </Flex>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <FormControl color="white" bgColor={"white"}>
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
                color="secondaryGrey.800"
                borderColor='gray.400'
                colorScheme="white"
                textColor={"black"}
                ms={{ base: "0px", md: "0px" }}
                type='email'
                placeholder='mail@simmmple.com' 
                mb='24px'
                fontWeight='500'
                size='lg'
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormLabel
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                display='flex'>
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size='md'>
                <Input
                  isRequired={true}
                  fontSize='sm'
                  placeholder='Min. 8 characters'
                  color="secondaryGrey.800"
                  borderColor='gray.400'
                  mb='24px'
                  size='lg'
                  type={show ? "text" : "password"}
                  variant='auth'
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement display='flex' alignItems='center' mt='4px'>
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              <Flex justifyContent='space-between' align='center' mb='24px'>
                <FormControl display='flex' alignItems='center'>
                  <Checkbox
                    id='remember-login'
                    colorScheme='brandScheme'
                    me='10px'
                    borderColor='gray.400'
                  />
                  <FormLabel
                    htmlFor='remember-login'
                    mb='0'
                    fontWeight='normal'
                    color={textColor}
                    onChange={(e) => setRemember(e.target.checked)}
                    fontSize='sm'>
                    Keep me logged in
                  </FormLabel>
                </FormControl>
                <NavLink to='/auth/forgot-password'>
                  <Text
                    color={textColorBrand}
                    fontSize='sm'
                    w='124px'
                    fontWeight='500'>
                    Forgot password?
                  </Text>
                </NavLink>
              </Flex>
              <Button
                fontSize='sm'
                variant='brand'
                fontWeight='800'
                color='darkbrand.900'
                w='100%'
                h='50'
                isLoading={loading}
                type="submit"
                loadingText="Signing in..."
                mb='24px'>
                Sign In
              </Button>
            </FormControl>
          </form>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
              Not registered yet?
              <NavLink to='/auth/sign-up'>
                <Text
                  color={textColorBrand}
                  as='span'
                  ms='5px'
                  fontWeight='500'>
                  Create an Account
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;

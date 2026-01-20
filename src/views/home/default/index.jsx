import { useState, useEffect, useRef } from 'react';
import {
  Box, Flex, Text, IconButton, Input, InputGroup, 
  InputRightElement, useToast, VStack, Spinner, SimpleGrid,
  Menu, MenuButton, MenuList, MenuItem, MenuDivider,
  Button
} from "@chakra-ui/react";
import { MdMoreVert, MdPerson, MdLogout } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

// Components
import Projects from "views/home/default/components/Projects";
import Card from "components/card/Card";
import NFT from "components/card/NFT";
import ProfileBanner from "views/home/default/components/ProfileBanner";
import Upload from "views/home/default/components/Upload";
import PaymentMethodCard from "views/home/default/components/PaymentMethodCard";

// Assets
import avatar from "assets/img/avatars/avatar4.png";
import banner from "assets/img/nfts/NftBanner1.png";
import Nft3 from "assets/img/nfts/Nft3.png";

// FIXED: Ensure this path correctly points to your Auth file
import { getStoredUser, getToken, clearAuth } from '../../../Auth'; 

export default function ChatOverview() {
  const API_ENDPOINT = "http://76.13.17.200:8003/v1/prompt";

  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedProducts, setSavedProducts] = useState(null);
  const [chosenItem, setChosenItem] = useState(null);
  
  const toast = useToast();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleLogout = () => {
    clearAuth();
    navigate('/auth/sign-in');
  };

  const handleQuickSearch = () => {
    const quickPrompt = "A white thick clothes that is suitable for winter";
    
    // We update the input state
    setUserInput(quickPrompt);
    
    // We call the send function immediately with the hardcoded string
    // because state updates (setUserInput) are asynchronous.
    executeSearch(quickPrompt);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    executeSearch(userInput);
    setUserInput("");
  };

  const executeSearch = async (promptValue) => {
    const token = getToken();
    if (!token) {
      toast({ title: "Authentication Error", status: "warning" });
      return;
    }

    setMessages(prev => [...prev, { type: 'USER', content: promptValue }]);
    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ prompt: promptValue })
      });

      if (!res.ok) throw new Error(`Server Error: ${res.status}`);
      const json = await res.json();
      setMessages(prev => [...prev, json]);

      if (json.type === "FIND_ITEM" && json.data.products != null) {
        setSavedProducts(json.data.products);
      } else if (json.type === "SELECT_OPTION") {
        setChosenItem(savedProducts 
          ? savedProducts[json.data.option === -1 ? savedProducts.length - 1 : json.data.option - 1] 
          : null);
      }
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (msg, index) => {
    if (msg.type === 'USER') {
      return (
        <Flex key={index} w="100%" justify="flex-end">
          <Box bg="brand.500" color="white" px="4" py="2" borderRadius="20px 20px 0 20px" boxShadow="md" maxW="100%">
            <Text fontSize="17px">{msg.content}</Text>
          </Box>
        </Flex>
      );
    }

    switch (msg.type) {
      case "FIND_ITEM":
        return <Projects key={index} data={msg.data.products} banner={banner} avatar={avatar} />;
      case "SELECT_OPTION":
        const item = savedProducts 
        ? savedProducts[msg.data.option === -1 ? savedProducts.length - 1 : msg.data.option - 1] 
        : null;
        return item ? (
          <NFT key={index} name={item.title} author={item.category} images={item.images} image={item.primary_image || Nft3} currentbid={`$ ${item.selling_price}`} download="#" />
        ) : <Text key={index} color="gray.500">Selection data lost. Please search again.</Text>;
      case "MAKE_PAYMENT":
        {
          if(chosenItem != null) {
            return (
              <Card p='0px'>
                <Flex
                  align={{ sm: "flex-start", lg: "center" }}
                  justify='space-between'
                  w='100%'
                  px='22px'
                  py='18px'>
                  <Text color={'brand.700'} fontSize='xl' fontWeight='600'>
                    Payment Method
                  </Text>
                  <Button variant='action'>Proceed</Button>
                </Flex>

                <PaymentMethodCard
                  name={msg.data.message}
                  author={msg.data.status}
                  date={Date.now}
                  image={`http://76.13.17.200:8004${msg.data.image}`}
                  price={chosenItem.selling_price}
                />
              </Card>
            );
          } else {
            return <Card key={index} p='20px'>
              <Text fontWeight="bold" color="green.600">Error</Text>
              <Text fontSize="sm">You are not yet chosing product</Text>
            </Card>
          }
        }
      default:
        return <Text key={index} color="gray.400">Unknown response type.</Text>;
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px" }} pb="120px" minH="100vh">
      {messages.length === 0 ? (
        <Flex direction="column" align="center" justify="center" minH="30vh" w="100%" maxW="1000px" mx="auto" px="4">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px" w="100%">
            <ProfileBanner
              banner={banner}
              avatar={avatar}
              name={`Welcome, ${getStoredUser()?.name || 'Guest'}`}
              job={getStoredUser()?.email || 'Sign in to sync data'}
              posts='17'
              followers='9.7k'
              following='274'
            />
            <Upload 
              minH={{ base: "auto", lg: "220px", "2xl": "365px" }} 
              onSearch={handleQuickSearch} 
              isLoading={loading}
            />
          </SimpleGrid>
          <Text mt="40px" color="gray.400" fontSize="lg" fontWeight="500">
            How can I help you today?
          </Text>
        </Flex>
      ) : (
        <VStack spacing={8} align="stretch" w="100%" maxW="800px" mx="auto" px="4">
          {messages.map((msg, index) => renderMessageContent(msg, index))}
          {loading && (
            <Flex align="center" gap={3}>
              <Spinner size="sm" color="brand.500" />
              <Text fontSize="sm" color="gray.500" fontStyle="italic">Analyzing products...</Text>
            </Flex>
          )}
          <div ref={messagesEndRef} />
        </VStack>
      )}

      <Box position="fixed" bottom="0" left={{ base: "0", xl: "290px" }} right="0" bg="transparent" pointerEvents="none" zIndex="10">
        <Box w="100%" px={{ base: "20px", md: "30px" }} pb="30px" pt="4" pointerEvents="auto">
          <InputGroup size="lg">
            <Input
              pr="4.5rem"
              placeholder="Ask for a product (e.g., White clothes for winter)..."
              bg="white"
              borderRadius="15px"
              border="1.5px solid"
              borderColor="gray.300"
              _focus={{ borderColor: "brand.500" }}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={loading}
            />
            <InputRightElement width="7rem" backgroundColor={"transparent"}>
              <IconButton
                h="1.75rem"
                size="lg"
                variant="ghost"
                colorScheme="brand"
                backgroundColor={"transparent"}
                icon={<IoSend />}
                onClick={handleSendMessage}
                isLoading={loading}
              />
              <Menu isLazy>
                <MenuButton
                  as={IconButton}
                  h="1.75rem"
                  size="lg"
                  variant="ghost"
                  backgroundColor="transparent"
                  icon={<MdMoreVert />}
                />
                <MenuList zIndex="11" borderRadius="15px">
                  <MenuItem icon={<MdPerson />} onClick={() => {}}>
                    Profile Settings
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem 
                    icon={<MdLogout />} 
                    color="red.400" 
                    onClick={handleLogout}
                  >
                    Log out
                  </MenuItem>
                </MenuList>
              </Menu>
            </InputRightElement>
          </InputGroup>
        </Box>
      </Box>
    </Box>
  );
}
import {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid , Flex, Text, Link, SimpleGrid, Button, useToast} from "@chakra-ui/react";

// Custom components
import Banner from "views/home/default/components/Banner";
import ProfileBanner from "views/home/default/components/ProfileBanner";
import Storage from "views/home/default/components/Storage";
import Upload from "views/home/default/components/Upload";
import General from "views/home/default/components/General";
import Notifications from "views/home/default/components/Notifications";
import Projects from "views/home/default/components/Projects";

// Assets
import avatar from "assets/img/avatars/avatar4.png";
import React from "react";

import TableTopCreators from "views/admin/marketplace/components/TableTopCreators";
import HistoryItem from "views/admin/marketplace/components/HistoryItem";
import NFT from "components/card/NFT";
import Card from "components/card/Card.js";
import banner from "assets/img/nfts/NftBanner1.png";

// Assets
import Nft1 from "assets/img/nfts/Nft1.png";
import Nft2 from "assets/img/nfts/Nft2.png";
import Nft3 from "assets/img/nfts/Nft3.png";
import Nft4 from "assets/img/nfts/Nft4.png";
import Nft5 from "assets/img/nfts/Nft5.png";
import Nft6 from "assets/img/nfts/Nft6.png";
import Avatar1 from "assets/img/avatars/avatar1.png";
import Avatar2 from "assets/img/avatars/avatar2.png";
import Avatar3 from "assets/img/avatars/avatar3.png";
import Avatar4 from "assets/img/avatars/avatar4.png";
import tableDataTopCreators from "views/admin/marketplace/variables/tableDataTopCreators.json";
import { tableColumnsTopCreators } from "views/admin/marketplace/variables/tableColumnsTopCreators";
import HomeNFT from "components/card/HomeNFT";

import {Navigate} from 'react-router-dom';
import { isAuthenticated, hasRole } from "../../../Auth";


export default function Overview() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8088";
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const toast = useToast();

  const navigate = useNavigate();
  const location = useLocation();
  
  const textColor = "secondaryGray.900";
  const textColorBrand = "brand.500";

  const ENDPOINTS = {
    list: `${API_BASE_URL}/package/all`,
  };

  async function fetchPackages(p = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (categoryFilter) params.set("category", categoryFilter);
      const res = await fetch(`${ENDPOINTS.list}?${params.toString()}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      const paged = json.data || {};
      console.log("--- RAW JSON RESPONSE ---");
      console.log(json);
      console.log("-------------------------");
      
      // You can use JSON.stringify for cleaner logging of specific objects
      console.log(`PAGED OBJECT: ${JSON.stringify(paged)}`);
      setItems(paged.items || []);
      setPage(paged.page || p);
    } catch (err) {
      console.error("fetchPackages:", err);
      toast({
        title: "Error",
        description: `Gagal Memuat Data: ${err.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPackages(1);
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns="1fr" 
        templateRows="repeat(1, 1fr)" 
        gap={{ base: "20px", xl: "20px" }}
        marginBottom={"25px"}
        // --- ADDED FIXES FOR MOBILE OVERFLOW ---
        width="100%"
        maxWidth="100%"
        overflowX="hidden" // Hides any child content that tries to escape horizontally
        // ----------------------------------------
      >
        <Flex
          flexDirection='column'
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}
          w="100%"
          maxW="100%"
          overflow="hidden"       // important
        >
          <Banner/>
        </Flex>
      </Grid>
      <Grid marginBottom={"25px"}>
        <Flex
          flexDirection='column'
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}>
          <Flex direction='column'>
            <Flex
              mt='45px'
              mb='20px'
              justifyContent='space-between'
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}>
              <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>
                Paket Terbaru
              </Text>
              <Flex
                align='center'
                me='20px'
                ms={{ base: "24px", md: "0px" }}
                mt={{ base: "20px", md: "0px" }}>
                <Link
                  color={textColorBrand}
                  fontWeight='500'
                  me={{ base: "34px", md: "44px" }}
                  to='#all'>
                  Lihat Semua
                </Link>
              </Flex>
            </Flex>
            {!loading && items.length === 0 ? (
            <Flex 
              justifyContent="center" 
              alignItems="center" 
              py={12}
              minH="150px"
              w="100%"
            >
              <Text color="gray.500" fontSize="lg">
                Tidak Ada Paket
              </Text>
            </Flex>
          ) : items.length != 0 ? (
            <SimpleGrid spacing="20px" columns={{ base: 1, sm: 2, md: 3, lg: 4}}>
              {items.map((pkg) => (
                <Box key={pkg.ID} w="100%" mx="auto" minWidth={"200px"}>
                    <HomeNFT
                      name={pkg.name}
                      author={pkg.category}
                      image={pkg.image ? `${API_BASE_URL}${pkg.image}` : Nft3}
                      currentbid={pkg.discountedPrice ? `Rp ${pkg.discountedPrice}` : `Rp ${pkg.originalPrice}`}
                      download={pkg.ID}
                      date={pkg.date}
                      onBuy={() => {
                        if (!isAuthenticated()) {
                          navigate("/auth/sign-in", {
                            replace: true,
                            state: { from: location.pathname }
                          });
                        } else {
                          navigate("/detail/description", {
                            replace: true,
                            state: { checkoutPackage: pkg }
                          })
                        }
                      }}

                    />
                </Box>
              ))}
            </SimpleGrid>
          ) : <Flex 
              justifyContent="center" 
              alignItems="center" 
              py={12}
              minH="150px"
              w="100%"
            >
              <Text color="gray.500" fontSize="lg">
                Tidak Dapat Memuat Data
              </Text>
            </Flex>}
          </Flex>
        </Flex>
      </Grid>
      <Grid marginBottom={"25px"}>
        <Flex
          flexDirection='column'
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}>
          <Flex direction='column'>
            <Flex
              mt='45px'
              mb='20px'
              justifyContent='space-between'
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}>
              <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>
                Pilihan Untukmu
              </Text>
              <Flex
                align='center'
                me='20px'
                ms={{ base: "24px", md: "0px" }}
                mt={{ base: "20px", md: "0px" }}>
                <Link
                  color={textColorBrand}
                  fontWeight='500'
                  me={{ base: "34px", md: "44px" }}
                  to='#all'>
                  Lihat Semua
                </Link>
              </Flex>
            </Flex>
            {!loading && items.length === 0 ? (
            <Flex 
              justifyContent="center" 
              alignItems="center" 
              py={12}
              minH="150px"
              w="100%"
            >
              <Text color="gray.500" fontSize="lg">
                Tidak Ada Paket
              </Text>
            </Flex>
          ) : items.length != 0 ? (
            <SimpleGrid spacing="20px" columns={{ base: 1, sm: 2, md: 3, lg: 4}}>
              {items.map((pkg) => (
                <Box key={pkg.ID} w="100%" mx="auto" minWidth={"200px"}>
                  <HomeNFT
                    name={pkg.name}
                    author={pkg.category}
                    image={pkg.image ? `${API_BASE_URL}${pkg.image}` : Nft3}
                    currentbid={pkg.discountedPrice ? `Rp ${pkg.discountedPrice}` : `Rp ${pkg.originalPrice}`}
                    download={pkg.ID}
                    date={pkg.date}
                    onBuy={() => {
                      if (!isAuthenticated()) {
                        navigate("/auth/sign-in", {
                          replace: true,
                          state: { from: location.pathname }
                        });
                      } else {
                        navigate("/detail/description", {
                          replace: true,
                          state: { checkoutPackage: pkg }
                        })
                      }
                    }}

                  />
                </Box>
              ))}
            </SimpleGrid>
          ) : <Flex 
              justifyContent="center" 
              alignItems="center" 
              py={12}
              minH="150px"
              w="100%"
            >
              <Text color="gray.500" fontSize="lg">
                Tidak Dapat Memuat Data
              </Text>
            </Flex>}
          </Flex>
        </Flex>
      </Grid>
      {/*<Grid
        templateColumns={{
          base: "1fr",
          lg: "1.34fr 1fr 1.62fr",
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <ProfileBanner
          gridArea='1 / 1 / 2 / 2'
          banner={banner}
          avatar={avatar}
          name='Adela Parkson'
          job='Product Designer'
          posts='17'
          followers='9.7k'
          following='274'
        />
        <Storage
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
          used={25.6}
          total={50}
        />
        <Upload
          gridArea={{
            base: "3 / 1 / 4 / 2",
            lg: "1 / 3 / 2 / 4",
          }}
          minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
          pe='20px'
          pb={{ base: "100px", lg: "20px" }}
        />
      </Grid>
      <Grid
        mb='20px'
        templateColumns={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1.34fr 1.62fr 1fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <Projects
          gridArea='1 / 2 / 2 / 2'
          banner={banner}
          avatar={avatar}
          name='Adela Parkson'
          job='Product Designer'
          posts='17'
          followers='9.7k'
          following='274'
        />
        <General
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
          minH='365px'
          pe='20px'
        />
        <Notifications
          used={25.6}
          total={50}
          gridArea={{
            base: "3 / 1 / 4 / 2",
            lg: "2 / 1 / 3 / 3",
            "2xl": "1 / 3 / 2 / 4",
          }}
        />
      </Grid>
      <Grid
        mb='20px'
        gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}>
        <Flex
          flexDirection='column'
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}>
          <Banner />
          <Flex direction='column'>
            <Flex
              mt='45px'
              mb='20px'
              justifyContent='space-between'
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}>
              <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>
                Trending NFTs
              </Text>
              <Flex
                align='center'
                me='20px'
                ms={{ base: "24px", md: "0px" }}
                mt={{ base: "20px", md: "0px" }}>
                <Link
                  color={textColorBrand}
                  fontWeight='500'
                  me={{ base: "34px", md: "44px" }}
                  to='#art'>
                  Art
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight='500'
                  me={{ base: "34px", md: "44px" }}
                  to='#music'>
                  Music
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight='500'
                  me={{ base: "34px", md: "44px" }}
                  to='#collectibles'>
                  Collectibles
                </Link>
                <Link color={textColorBrand} fontWeight='500' to='#sports'>
                  Sports
                </Link>
              </Flex>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap='20px'>
              <NFT
                name='Abstract Colors'
                author='By Esthera Jackson'
                bidders={[
                  Avatar1,
                  Avatar2,
                  Avatar3,
                  Avatar4,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                ]}
                image={Nft1}
                currentbid='0.91 ETH'
                download='#'
              />
              <NFT
                name='ETH AI Brain'
                author='By Nick Wilson'
                bidders={[
                  Avatar1,
                  Avatar2,
                  Avatar3,
                  Avatar4,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                ]}
                image={Nft2}
                currentbid='0.91 ETH'
                download='#'
              />
              <NFT
                name='Mesh Gradients '
                author='By Will Smith'
                bidders={[
                  Avatar1,
                  Avatar2,
                  Avatar3,
                  Avatar4,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                ]}
                image={Nft3}
                currentbid='0.91 ETH'
                download='#'
              />
            </SimpleGrid>
            <Text
              mt='45px'
              mb='36px'
              color={textColor}
              fontSize='2xl'
              ms='24px'
              fontWeight='700'>
              Recently Added
            </Text>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap='20px'
              mb={{ base: "20px", xl: "0px" }}>
              <NFT
                name='Swipe Circles'
                author='By Peter Will'
                bidders={[
                  Avatar1,
                  Avatar2,
                  Avatar3,
                  Avatar4,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                ]}
                image={Nft4}
                currentbid='0.91 ETH'
                download='#'
              />
              <NFT
                name='Colorful Heaven'
                author='By Mark Benjamin'
                bidders={[
                  Avatar1,
                  Avatar2,
                  Avatar3,
                  Avatar4,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                ]}
                image={Nft5}
                currentbid='0.91 ETH'
                download='#'
              />
              <NFT
                name='3D Cubes Art'
                author='By Manny Gates'
                bidders={[
                  Avatar1,
                  Avatar2,
                  Avatar3,
                  Avatar4,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                ]}
                image={Nft6}
                currentbid='0.91 ETH'
                download='#'
              />
            </SimpleGrid>
          </Flex>
        </Flex>
        <Flex
          flexDirection='column'
          gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}>
          <Card px='0px' mb='20px'>
            <TableTopCreators
              tableData={tableDataTopCreators}
              columnsData={tableColumnsTopCreators}
            />
          </Card>
          <Card p='0px'>
            <Flex
              align={{ sm: "flex-start", lg: "center" }}
              justify='space-between'
              w='100%'
              px='22px'
              py='18px'>
              <Text color={textColor} fontSize='xl' fontWeight='600'>
                History
              </Text>
              <Button variant='action'>See all</Button>
            </Flex>

            <HistoryItem
              name='Colorful Heaven'
              author='By Mark Benjamin'
              date='30s ago'
              image={Nft5}
              price='0.91 ETH'
            />
            <HistoryItem
              name='Abstract Colors'
              author='By Esthera Jackson'
              date='58s ago'
              image={Nft1}
              price='0.91 ETH'
            />
            <HistoryItem
              name='ETH AI Brain'
              author='By Nick Wilson'
              date='1m ago'
              image={Nft2}
              price='0.91 ETH'
            />
            <HistoryItem
              name='Swipe Circles'
              author='By Peter Will'
              date='1m ago'
              image={Nft4}
              price='0.91 ETH'
            />
            <HistoryItem
              name='Mesh Gradients '
              author='By Will Smith'
              date='2m ago'
              image={Nft3}
              price='0.91 ETH'
            />
            <HistoryItem
              name='3D Cubes Art'
              author='By Manny Gates'
              date='3m ago'
              image={Nft6}
              price='0.91 ETH'
            />
          </Card>
        </Flex>
      </Grid>*/}
      {/* Delete Product */}
    </Box>
  );
}

/*import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../Auth";
// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  useColorModeValue,
  SimpleGrid,
  useToast, 
  Link,
  Tfoot,
  Tr,
  Td,
  // Chakra UI Form Components for the Package form:
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Image,
  Checkbox, // <--- ADDED Checkbox
  Textarea, // <--- ADDED Textarea
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

// Custom components
import NFT from "components/card/NFT";
import Card from "components/card/Card.js";

// Assets
import Nft1 from "assets/img/nfts/Nft1.png";
import Nft2 from "assets/img/nfts/Nft2.png";
import Nft3 from "assets/img/nfts/Nft3.png";
import Avatar1 from "assets/img/avatars/avatar1.png";
import Avatar2 from "assets/img/avatars/avatar2.png";
import Avatar3 from "assets/img/avatars/avatar3.png";
import Avatar4 from "assets/img/avatars/avatar4.png";

const initialForm = {
  id: "new",
  name: "",
  category: "Haji",
  date: "",
  location: "",
  duration: 7,
  transportation: "Garuda Indonesia",
  rating: 5,
  originalPriceFull: "",
  discountedPriceFull: "",
  information: true,
  organizer: "",
  bankAccounts: [{ bank_name: "BCA", user_name: "", number: "" }],
  accomodations: [{ name: "", type: "Hotel", location: "", detail: "" }],
  image: null,
  // --- ADDED INCLUSION FIELDS ---
  includePassport: false,
  includeVaccination: false,
  includeLugageOverload: false,
  includeEquipment: false,
  includeFullACBuss: false,
  includeMuthawif: false,
  includeTourLeader: false,
  includeHotel: false,
  includeAirplaneTicket2Way: false,
  includeAirplaneTicket: false,
  includeEating: false, // Mapped to JSON key 'includeEating3' in payload
  includeVisa: false,
  includeSpecialGuide: false,
  includeTranslator: false,
  includeHealthService: false,
  includeExtraTour: false,
  includeGroupCar: false,
  includeSouvenir: false,
  includeSnack: false,
  includeVoucher: false,
  includeSecurity: false,
  
  detail: "", // Detail field
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8088";
const BANK_OPTIONS = ["BCA", "Mandiri", "BNI", "BRI", "BSI"];
const ACCOMODATION_TYPE_OPTIONS = ["Hotel", "Transportasi", "Agen", "Guide", "Itinerari", "Inklusi"];
const bankSlug = (name) => name.toLowerCase().replace(/\s/g, "");

const ENDPOINTS = {
  list: `${API_BASE_URL}/package/all`,
  create: `${API_BASE_URL}/package`,
  detail: (id) => `${API_BASE_URL}/package/detail/${id}`,
  uploadImage: `${API_BASE_URL}/uploads/image`,
};
// -------------------------------------------------------------------


export default function Default() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const subtextColor = useColorModeValue("gray.500", "gray.400");
  const formBg = useColorModeValue("gray.50", "gray.700");
  const toast = useToast();
  
  // --- Form State ---
  const [form, setForm] = useState(initialForm);
  const [panelMode, setPanelMode] = useState("add"); // Mode is now only "add" since it's a fixed panel
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  // Handlers
  const setField = (key, value) => {
    console.log(`value = ${value}`)
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const setBankAccountField = (index, key, value) => {
    setForm(prev => {
        const newAccounts = [...prev.bankAccounts];
        newAccounts[index] = { ...newAccounts[index], [key]: value };
        return { ...prev, bankAccounts: newAccounts };
    });
  };

  const setAccomodationField = (index, key, value) => {
    setForm(prev => {
        const newAccomodations = [...prev.accomodations];
        newAccomodations[index] = { ...newAccomodations[index], [key]: value };
        return { ...prev, accomodations: newAccomodations };
    });
  };

  const addBankAccount = () => {
    setForm(prev => ({
        ...prev,
        bankAccounts: [...prev.bankAccounts, { bank_name: "BCA", user_name: "", number: "" }]
    }));
  };

  const addAccomodation = () => {
    setForm(prev => ({
        ...prev,
        accomodations: [...prev.accomodations, { name: "", type: "", detail: "", location:"" }]
    }));
  };

  const removeBankAccount = (index) => {
    setForm(prev => ({
        ...prev,
        bankAccounts: prev.bankAccounts.filter((_, i) => i !== index)
    }));
  };

  const removeAccomodation = (index) => {
    setForm(prev => ({
        ...prev,
        accomodations: prev.accomodations.filter((_, i) => i !== index)
    }));
  };

  async function fetchPackages(p = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (categoryFilter) params.set("category", categoryFilter);
      const res = await fetch(`${ENDPOINTS.list}?${params.toString()}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      const paged = json.data || {};
      console.log("--- RAW JSON RESPONSE ---");
      console.log(json);
      console.log("-------------------------");
      
      // You can use JSON.stringify for cleaner logging of specific objects
      console.log(`PAGED OBJECT: ${JSON.stringify(paged)}`);
      setItems(paged.items || []);
      setPage(paged.page || p);
    } catch (err) {
      console.error("fetchPackages:", err);
      toast({
        title: "Error",
        description: `Gagal Memuat Data: ${err.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingImage(true);
      const response = await axios.post(
        `${API_BASE_URL}/uploads/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const imageUrl = response.data.data.url;
      setForm({ ...form, image: imageUrl });
      console.log("Upload successful:", imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Error Upload",
        description: `Gagal mengunggah gambar: ${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploadingImage(false);
    }
  };

  async function handleSubmit(e) {
    e && e.preventDefault();

    // normalize bank accounts
    let bankAccounts = form.bankAccounts;
    if (typeof bankAccounts === "string") {
      try {
        bankAccounts = JSON.parse(bankAccounts);
      } catch (err) {
        toast({
        title: "Gagal Mengirim Data",
        description: `Invalid JSON format`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
        return;
      }
    }

     let accomodations = form.accomodations;
    if (typeof accomodations === "string") {
      try {
        accomodations = JSON.parse(accomodations);
      } catch (err) {
        toast({
        title: "Gagal Mengirim Data",
        description: `Invalid JSON format`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
        return;
      }
    }

    bankAccounts = (bankAccounts || []).map((acc) => ({
      bank_icon: acc.bank_icon || acc.bankIcon || acc.icon || "",
      user_name: acc.user_name || acc.userName || acc.user || "",
      number: acc.number || acc.no || "",
      bank_name: acc.bank_name || acc.bankName || acc.bank_name || acc.bankName || "",
    }));

    console.log(`Submitting Number(form.originalPriceFull) = ${Number(form.originalPriceFull)}`);

    const payload = {
      name: (form.name || "").trim(),
      category: form.category,
      date: new Date(form.date).toISOString(),
      image: (form.image || "").trim(),
      location: (form.location || "").trim(),
      transportation: (form.transportation || "").trim(),
      duration: Number(form.duration) || 1,
      rating: Number(form.rating) || 1,
      isPromo: Number(form.discountedPriceFull) != 0 && Number(form.discountedPriceFull) < Number(form.originalPriceFull),
      originalPrice: Math.round(parseFloat(form.originalPriceFull) || 0),
      originalExponent: 0,
      organizer: form.organizer,
      discountedPrice: Math.round(parseFloat(form.discountedPriceFull) || 0),
      discountedExponent: 0,
      information: !!form.information,
      bankAccounts,
      accomodations,
      // --- ADDED INCLUSION FIELDS TO PAYLOAD ---
      includePassport: !!form.includePassport,
      includeVaccination: !!form.includeVaccination,
      includeLugageOverload: !!form.includeLugageOverload,
      includeEquipment: !!form.includeEquipment,
      includeFullACBuss: !!form.includeFullACBuss,
      includeMuthawif: !!form.includeMuthawif,
      includeTourLeader: !!form.includeTourLeader,
      includeHotel: !!form.includeHotel,
      includeAirplaneTicket2Way: !!form.includeAirplaneTicket2Way,
      includeAirplaneTicket: !!form.includeAirplaneTicket,
      includeEating3: !!form.includeEating, // Mapped to JSON key 'includeEating3'
      includeVisa: !!form.includeVisa,
      includeSpecialGuide: !!form.includeSpecialGuide,
      includeTranslator: !!form.includeTranslator,
      includeHealthService: !!form.includeHealthService,
      includeExtraTour: !!form.includeExtraTour,
      includeGroupCar: !!form.includeGroupCar,
      includeSouvenir: !!form.includeSouvenir,
      includeSnack: !!form.includeSnack,
      includeVoucher: !!form.ncludeVoucher,
      includeSecurity: !!form.includeSecurity,
      detail: (form.detail || "").trim(),
    };

    console.log(payload);

    if (!payload.name) {
      toast({
        title: "Validation Error",
        description: "Nama belum diisi",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!payload.location) {
      toast({
        title: "Validation Error",
        description: "Lokasi belum diisi",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const mode = panelMode;
    const url = mode === "add" ? ENDPOINTS.create : ENDPOINTS.detail(form.id);
    const method = mode === "add" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });
      const resJson = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          title: "Gagal Mengirim Data",
          description: resJson.message || `Status ${res.status}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      toast({
        title: "Sukses Mengirim Data",
        description: `Data Paket berhasil dikirim.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Reset form after successful submission
      setForm(initialForm); 
      setPanelMode("add"); // Switch back to Add mode
      fetchPackages(page);
    } catch (err) {
      console.error("submit:", err);
      toast({
        title: `Gagal Mengirim Data`,
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  async function handleEdit(pkgId) {
    setLoading(true);
    try {
      const res = await fetch(ENDPOINTS.detail(pkgId), {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      const pkg = json.data;

      // FIX 1: Use pkg.BankAccounts (capitalized) to access the list, 
      // but keep the internal object fields (bank_name, user_name, number) as they appear correct in your log.
      const bankAccounts = (pkg.BankAccounts || []).map(acc => ({
          // Your log shows internal fields are already snake_case (e.g., acc.bank_name)
          bank_name: acc.bank_name || "",
          user_name: acc.user_name || "",
          number: acc.number || "",
      }));

      // FIX 2: Use pkg.Accomodations (capitalized) to access the list.
      const accomodations = (pkg.Accomodations || []).map(acc => ({
          // Your log shows internal fields are already snake_case/lowercase (e.g., acc.name)
          name: acc.name || "",
          type: acc.type || "",
          location: acc.location || "",
          detail: acc.detail || "",
      }));

      const dateOnly = pkg.date ? pkg.date.split('T')[0] : "";


      // 3. Set the form state with full data
      setForm({
        id: pkgId,
        name: pkg.name,
        category: pkg.category,
        date: dateOnly,
        location: pkg.location,
        duration: pkg.duration,
        transportation: pkg.transportation,
        rating: pkg.rating,
        originalPriceFull: Math.round(parseFloat(pkg.originalPrice)  || 0),
        discountedPriceFull: Math.round(parseFloat(pkg.discountedPrice) || 0),
        information: pkg.information,
        // Use the newly parsed arrays
        bankAccounts: bankAccounts.length > 0 ? bankAccounts : [{ bank_name: "BCA", user_name: "", number: "" }],
        accomodations: accomodations.length > 0 ? accomodations : [{ name: "", type: "Hotel", location: "", detail: "" }],
        image: pkg.image,
        organizer: pkg.organizer || "",
        // --- ADDED INCLUSION FIELDS FROM RESPONSE ---
        includePassport: !!pkg.includePassport,
        includeVaccination: !!pkg.includeVaccination,
        includeLugageOverload: !!pkg.includeLugageOverload,
        includeEquipment: !!pkg.includeEquipment,
        includeFullACBuss: !!pkg.includeFullACBuss,
        includeMuthawif: !!pkg.includeMuthawif,
        includeSpecialGuide: !!pkg.includeSpecialGuide,
        includeTranslator: !!pkg.includeTranslator,
        includeTourLeader: !!pkg.includeTourLeader,
        includeHotel: !!pkg.includeHotel,
        includeAirplaneTicket2Way: !!pkg.includeAirplaneTicket2Way,
        includeAirplaneTicket: !!pkg.includeAirplaneTicket,
        includeEating: !!pkg.includeEating3, // Check for lowercase and capitalized JSON keys
        includeVisa: !!pkg.includeVisa,
        includeHealthService: !!pkg.includeHealthService,
        includeExtraTour: !!pkg.includeExtraTour,
        includeGroupCar: !!pkg.includeGroupCar,
        includeSouvenir: !!pkg.includeSouvenir,
        includeSnack: !!pkg.includeSnack,
        includeVoucher: !!pkg.includeVoucher,
        includeSecurity: !!pkg.includeSecurity,
        detail: pkg.detail || "", // Detail field
      });

      console.log(`bankAccounts = ${JSON.stringify(bankAccounts)}`) // Log the array content for verification

      // 4. Set panel mode to edit
      setPanelMode("edit");
      
      toast({
        title: "Mode Edit Aktif",
        description: `Memuat data untuk ${pkg.name}.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      // Optional: Scroll to the form
      const formCard = document.getElementById("package-form-card");
      if (formCard) {
        formCard.scrollIntoView({ behavior: 'smooth' });
      }

    } catch (err) {
      console.error("handleEdit:", err);
      toast({
        title: "Error",
        description: `Gagal Memuat Data Paket: ${err.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(pkgId) {
    // 1. Confirmation dialog before proceeding
    if (!window.confirm("Apakah Anda yakin ingin menghapus paket ini? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }

    setLoading(true);
    try {
      // The DELETE endpoint is the same as the detail endpoint
      const url = ENDPOINTS.detail(pkgId); 
      
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const resJson = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          title: "Gagal Menghapus Data",
          description: resJson.message || `Status ${res.status}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      toast({
        title: "Sukses Menghapus Data",
        description: `Data Paket ID ${pkgId} berhasil dihapus.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // 2. Refresh the list to show the item is gone
      fetchPackages(page);

    } catch (err) {
      console.error("handleDelete:", err);
      toast({
        title: `Gagal Menghapus Data`,
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  // Chakra Color Mode
  const textColorBrand = useColorModeValue("brand.500", "white");

  useEffect(() => {
    fetchPackages(1);
  }, []);
  
  return (
    <Box pt={{ base: "150px", md: "50px", xl: "50px" }}>
      <Grid
        mb='20px'
        gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}>
        
        <Flex
          flexDirection='column'
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}>
          <Flex direction='column'>
            <Flex
              mt='45px'
              mb='20px'
              justifyContent='space-between'
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}>
              <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>
                Paket Terbaru
              </Text>
              <Flex
                align='center'
                me='20px'
                ms={{ base: "24px", md: "0px" }}
                mt={{ base: "20px", md: "0px" }}>
                <Link
                  color={textColorBrand}
                  fontWeight='500'
                  me={{ base: "34px", md: "44px" }}
                  to='#all'>
                  Semua
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight='500'
                  me={{ base: "34px", md: "44px" }}
                  to='#haji'>
                  Haji
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight='500'
                  me={{ base: "34px", md: "44px" }}
                  to='#umroh'>
                  Umroh
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight='500'
                  me={{ base: "34px", md: "44px" }}
                  to='#international'>
                  Internasional
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight='500'
                  me={{ base: "34px", md: "44px" }}
                  to='#domestic'>
                  Domestik
                </Link>
              </Flex>
            </Flex>
            {!loading && items.length === 0 ? (
            <Flex 
              justifyContent="center" 
              alignItems="center" 
              py={12}
              minH="150px"
              w="100%"
            >
              <Text color="gray.500" fontSize="lg">
                Tidak Ada Paket
              </Text>
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 3 }} gap='20px'>
              {items.map((pkg) => (
                <Box key={pkg.ID}>
                    <NFT
                      name={pkg.name}
                      author={pkg.category}
                      image={pkg.image ? `${API_BASE_URL}${pkg.image}` : Nft3}
                      currentbid={pkg.discountedPrice ? `Rp ${pkg.discountedPrice}` : `Rp ${pkg.originalPrice}`}
                      download={pkg.ID}
                      date={pkg.date}
                      onEdit= {() => handleEdit(pkg.ID)}
                      onDelete= {()=> handleDelete(pkg.ID)}
                    />
                </Box>
              ))}
            </SimpleGrid>
          )}
          </Flex>
        </Flex>
      </Grid>
    </Box>
  );
}
*/
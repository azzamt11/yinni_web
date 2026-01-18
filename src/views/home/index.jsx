import React, { useState, useEffect } from "react";
import axios from "axios";
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
import Nft3 from "assets/img/nfts/Nft3.png";

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


export default function Home() {
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

  // Chakra Color Mode
  const textColorBrand = "brand.500";

  useEffect(() => {
    fetchPackages(1);
  }, []);
  
  return (
    <Box pt={{ base: "150px", md: "50px", xl: "50px" }}>
      {/* Main Fields */}
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
                      onLike= {() => {}}
                      onSave= {()=> {}}
                    />
                </Box>
              ))}
            </SimpleGrid>
          )}
          </Flex>
        </Flex>
      </Grid>
      {/* Delete Product */}
    </Box>
  );
}
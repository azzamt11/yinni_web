import React, { useState, useEffect } from "react";
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
  itineraries: [{ name: "", type: "Tour", location: "", detail: "", startTime: "", endTime: "", startDate: "", endDate: "" }],
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
const ITINERARY_TYPE_OPTIONS = ["Tour", "Lunch", "Kunjungan", "Isitirahat", "Bebas", "Lainnya"];
const bankSlug = (name) => name.toLowerCase().replace(/\s/g, "");

const ENDPOINTS = {
  list: `${API_BASE_URL}/package/all`,
  create: `${API_BASE_URL}/package`,
  detail: (id) => `${API_BASE_URL}/package/detail/${id}`,
  uploadImage: `${API_BASE_URL}/uploads/image`,
};
// -------------------------------------------------------------------


export default function Product() {
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

  const setItineraryField = (index, key, value) => {
    setForm(prev => {
        const newItineraries = [...prev.itineraries];
        newItineraries[index] = { ...newItineraries[index], [key]: value };
        return { ...prev, itineraries: newItineraries };
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

  const addItinerary = () => {
    setForm(prev => ({
        ...prev,
        itineraries: [...prev.itineraries, { name: "", type: "", detail: "", location:"", startTime: "", endTime: "", startDate: "", endDate:"" }]
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

  const removeItinerary = (index) => {
    setForm(prev => ({
        ...prev,
        itinerarys: prev.itineraries.filter((_, i) => i !== index)
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

    let itineraries = form.itineraries;
    if (typeof itineraries === "string") {
      try {
        itineraries = JSON.parse(itineraries);
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
      itineraries,
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

      // FIX 2: Use pkg.Itineraries (capitalized) to access the list.
      const itineraries = (pkg.Itineraries || []).map(itin => ({
          // Your log shows internal fields are already snake_case/lowercase (e.g., acc.name)
          name: itin.name || "",
          type: itin.type || "",
          location: itin.location || "",
          detail: itin.detail || "",
          // 👇 FIX APPLIED HERE: Map the date and time fields from the fetched data
          startDate: itin.startDate || "", 
          endDate: itin.endDate || "",
          startTime: itin.startTime || "",
          endTime: itin.endTime || "",
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
        itineraries: itineraries.length > 0 ? itineraries : [{ name: "", type: "Tour", location: "", detail: "", startTime: "", endTime: "", startDate: "", endDate: "" }],
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
      // ... (rest of the error handling)
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
    window.scrollTo(0, 0);
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
                      onEdit= {() => handleEdit(pkg.ID)}
                      onDelete= {()=> handleDelete(pkg.ID)}
                    />
                </Box>
              ))}
            </SimpleGrid>
          )}
          </Flex>
        </Flex>
        <Flex
          flexDirection='column'
          gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}>
          {/* 👇 ADDED: id="package-form-card" to allow scrolling to the form */}
          <Card pt='22px' mt={{ base: "40px", xl: "40px" }} p="22px" as="form" onSubmit={handleSubmit} id="package-form-card">
              <Flex alignItems="center" justifyContent="space-between" pb="10px">
                  <Text color={'brand.500'} fontSize='xl' fontWeight='700'>
                      {/* 👇 UPDATED: Change text based on panelMode */}
                      {panelMode === "add" ? "Tambah Paket Baru" : "Edit Paket"}
                  </Text>
                  <Button 
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                          setForm(initialForm); // Reset form
                          setPanelMode("add"); // Switch to Add mode
                      }} 
                  >
                      {panelMode === "edit" ? "Batal Edit" : "Reset"}
                  </Button>
              </Flex>
              <Text fontSize="sm" color={subtextColor} mb={4}>
                  {panelMode === "add" ? "Isi detail berikut untuk menambahkan paket baru." : `Mengedit Paket ID: ${form.id}`}
              </Text>

              <VStack spacing={4} align="stretch" pb={4}>
                  
                  {/* Name + Category */}
                  <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <FormControl isRequired>
                          <FormLabel fontSize="sm">Nama</FormLabel>
                          <Input 
                              height="45px" 
                              borderRadius="lg" // Use "lg", "xl", or a specific value
                              value={form.name} 
                              onChange={(e) => setField("name", e.target.value)} 
                              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          />
                      </FormControl>

                      <FormControl isRequired>
                          <FormLabel fontSize="sm">Kategori</FormLabel>
                          <Select 
                              height="45px" 
                              borderRadius="lg"
                              value={form.category} 
                              onChange={(e) => setField("category", e.target.value)}
                              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          >
                              <option value="Haji">Haji</option>
                              <option value="Umroh">Umroh</option>
                              <option value="Travel Domestik">Domestik</option>
                              <option value="Travel Internasional">Internasional</option>
                          </Select>
                      </FormControl>
                  </Grid>

                  {/* Date + Location */}
                  <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <FormControl isRequired>
                          <FormLabel fontSize="sm">Tanggal</FormLabel>
                          <Input 
                              height="45px" 
                              borderRadius="lg"
                              type="date" 
                              value={form.date} 
                              onChange={(e) => setField("date", e.target.value)} 
                              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          />
                      </FormControl>
                      <FormControl>
                          <FormLabel fontSize="sm">Lokasi Keberangkatan</FormLabel>
                          <Input 
                              height="45px" 
                              borderRadius="lg"
                              value={form.location} 
                              onChange={(e) => setField("location", e.target.value)} 
                              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          />
                      </FormControl>
                  </Grid>

                  {/* Duration & Transportation */}
                  <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <FormControl>
                          <FormLabel fontSize="sm">Durasi (Hari)</FormLabel>
                          <Input 
                              height="45px" 
                              borderRadius="lg"
                              type="number" 
                              min="0" 
                              value={form.duration} 
                              onChange={(e) => setField("duration", e.target.value)} 
                              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          />
                      </FormControl>
                      <FormControl isRequired>
                          <FormLabel fontSize="sm">Transportasi</FormLabel>
                          <Input 
                              height="45px" 
                              borderRadius="lg"
                              value={form.transportation} 
                              onChange={(e) => setField("transportation", e.target.value)} 
                              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          />
                      </FormControl>
                  </Grid>

                  {/* Agent & Rating */}
                  <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <FormControl isRequired>
                          <FormLabel fontSize="sm">Agen</FormLabel>
                          <Input 
                              height="45px" 
                              borderRadius="lg"
                              value={form.organizer} 
                              onChange={(e) => setField("organizer", e.target.value)} 
                              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          />
                      </FormControl>
                     <FormControl isRequired>
                          <FormLabel fontSize="sm">Rating</FormLabel>
                          <Select 
                              height="45px" 
                              borderRadius="lg"
                              value={form.rating} 
                              onChange={(e) => setField("rating", e.target.value)}
                              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          >
                              <option value="5">5</option>
                              <option value="4">4</option>
                              <option value="3">3</option>
                              <option value="2">2</option>
                              <option value="1">1</option>
                          </Select>
                      </FormControl>
                  </Grid>


                  {/* Image Upload - Note: File inputs can be tricky to style consistently. */}
                  <FormControl>
                      <FormLabel fontSize="sm">Gambar Paket</FormLabel>
                      <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          p={2} // Slightly more padding
                          height="45px"
                          borderRadius="lg"
                          // Removed size="sm"
                      />
                      {form.image && (
                          <Image
                              src={form.image.startsWith("http") ? form.image : `${API_BASE_URL}${form.image}`}
                              alt="Preview"
                              boxSize="50px"
                              borderRadius="md"
                              mt={2}
                              objectFit="cover"
                          />
                      )}
                      {uploadingImage && (
                          <Text fontSize="xs" color={subtextColor} mt={1}>Uploading...</Text>
                      )}
                  </FormControl>

                  {/* Price Fields */}
                  <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <FormControl>
                          <FormLabel fontSize="sm">Harga Asli (Rp)</FormLabel>
                          <Input 
                              height="45px" 
                              borderRadius="lg"
                              type="number" 
                              min="0" 
                              value={form.originalPriceFull} 
                              onChange={(e) => setField("originalPriceFull", e.target.value)} 
                              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          />
                      </FormControl>
                      <FormControl>
                          <FormLabel fontSize="sm">Harga Diskon (Rp)</FormLabel>
                          <Input 
                              height="45px" 
                              borderRadius="lg"
                              type="number" 
                              min="0" 
                              value={form.discountedPriceFull} 
                              onChange={(e) => setField("discountedPriceFull", e.target.value)} 
                              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          />
                      </FormControl>
                  </Grid>

                  {/* Accomodations dynamic UI */}
                  <FormControl>
                      <Flex alignItems="center" justifyContent="space-between" mt={2}>
                          <FormLabel m={0} fontSize="sm">Akomodasi & Layanan</FormLabel>
                          <Button
                              type="button"
                              onClick={addAccomodation}
                              size="xs"
                              leftIcon={<AddIcon />}
                          >
                              Tambah
                          </Button>
                      </Flex>

                      <VStack spacing={2} mt={2} align="stretch">
                          {(form.accomodations || []).map((acc, idx) => (
                              <Box key={idx} borderWidth="1px" borderRadius="lg" p={2} bg={formBg}>
                                  <Flex justifyContent="flex-end" mb={1}>
                                      <Button type="button" size="xs" variant="ghost" colorScheme="red" onClick={() => removeAccomodation(idx)}>Remove</Button>
                                  </Flex>
                                  <VStack spacing={2} align="stretch">
                                      <Select 
                                          size="md" // Back to default md size for list
                                          value={acc.type || "Hotel"} 
                                          onChange={(e) => setAccomodationField(idx, "type", e.target.value)}
                                      >
                                          <option value="">Pilih Tipe Akomodasi</option>
                                          {ACCOMODATION_TYPE_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                                      </Select>
                                      <Input size="md" placeholder="Nama" value={acc.name || ""} onChange={(e) => setAccomodationField(idx, "name", e.target.value)} />
                                      <Input size="md" placeholder="Lokasi" value={acc.location || ""} onChange={(e) => setAccomodationField(idx, "location", e.target.value)} />
                                      <Input size="md" placeholder="Detail" value={acc.detail || ""} onChange={(e) => setAccomodationField(idx, "detail", e.target.value)} />
                                  </VStack>
                              </Box>
                          ))}
                      </VStack>
                  </FormControl>

                  {/* Itineraries dynamic UI */}
                  <FormControl>
                      <Flex alignItems="center" justifyContent="space-between" mt={2}>
                          <FormLabel m={0} fontSize="sm">Itinerary</FormLabel>
                          <Button
                              type="button"
                              onClick={addItinerary}
                              size="xs"
                              leftIcon={<AddIcon />}
                          >
                              Tambah
                          </Button>
                      </Flex>

                      <VStack spacing={2} mt={2} align="stretch">
                          {(form.itineraries || []).map((itin, idx) => (
                              <Box key={idx} borderWidth="1px" borderRadius="lg" p={2} bg={formBg}>
                                  <Flex justifyContent="flex-end" mb={1}>
                                      <Button 
                                          type="button" 
                                          size="xs" 
                                          variant="ghost" 
                                          colorScheme="red" 
                                          onClick={() => removeItinerary(idx)}
                                      >
                                          Remove
                                      </Button>
                                  </Flex>
                                  
                                  <VStack spacing={2} align="stretch">
                                      {/* Itinerary Type, Name, Location (Unchanged) */}
                                      <Select 
                                          size="md" 
                                          value={itin.type || ""} 
                                          onChange={(e) => setItineraryField(idx, "type", e.target.value)}
                                      >
                                          <option value="">Pilih Tipe Itinerary</option>
                                          {ITINERARY_TYPE_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                                      </Select>
                                      <Input 
                                          size="md" 
                                          placeholder="Nama" 
                                          value={itin.name || ""} 
                                          onChange={(e) => setItineraryField(idx, "name", e.target.value)} 
                                      />
                                      <Input 
                                          size="md" 
                                          placeholder="Lokasi" 
                                          value={itin.location || ""} 
                                          onChange={(e) => setItineraryField(idx, "location", e.target.value)} 
                                      />

                                      {/* 🗓️ TIME INTERVAL PICKER 🗓️ */}
                                      <FormLabel m={0} pt={2} fontWeight="bold" fontSize="sm">Waktu & Tanggal</FormLabel>
                                      
                                      {/* Start Date & Time */}
                                      <VStack align="start" spacing={1}>
                                          <FormLabel m={0} fontSize="sm" fontWeight="normal">Mulai:</FormLabel>
                                          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2} width="100%">
                                              <Input 
                                                  type="date" 
                                                  size="md" 
                                                  value={itin.startDate || ""} 
                                                  onChange={(e) => setItineraryField(idx, "startDate", e.target.value)} 
                                              />
                                              <Input 
                                                  type="time" 
                                                  size="md" 
                                                  value={itin.startTime || ""} 
                                                  onChange={(e) => setItineraryField(idx, "startTime", e.target.value)} 
                                              />
                                          </SimpleGrid>
                                      </VStack>

                                      {/* End Date & Time */}
                                      <VStack align="start" spacing={1}>
                                          <FormLabel m={0} fontSize="sm" fontWeight="normal">Selesai:</FormLabel>
                                          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2} width="100%">
                                              <Input 
                                                  type="date" 
                                                  size="md" 
                                                  value={itin.endDate || ""} 
                                                  onChange={(e) => setItineraryField(idx, "endDate", e.target.value)} 
                                              />
                                              <Input 
                                                  type="time" 
                                                  size="md" 
                                                  value={itin.endTime || ""} 
                                                  onChange={(e) => setItineraryField(idx, "endTime", e.target.value)} 
                                              />
                                          </SimpleGrid>
                                      </VStack>
                                      {/* ----------------------------- */}

                                      <Input 
                                          size="md" 
                                          placeholder="Detail" 
                                          value={itin.detail || ""} 
                                          onChange={(e) => setItineraryField(idx, "detail", e.target.value)} 
                                      />
                                  </VStack>
                              </Box>
                          ))}
                      </VStack>
                  </FormControl>

                  {/* --- NEW INCLUSION CHECKBOXES --- */}
                  <FormControl mt={4}>
                      <FormLabel fontSize="sm" fontWeight="bold">Termasuk Dalam Paket</FormLabel>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                          <Checkbox 
                            isChecked={form.includeAirplaneTicket2Way} 
                            onChange={(e) => setField("includeAirplaneTicket2Way", e.target.checked)}
                          >
                            Tiket Pesawat (2 Arah)
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeAirplaneTicket} 
                            onChange={(e) => setField("includeAirplaneTicket", e.target.checked)}
                          >
                            Tiket Pesawat (1 Arah)
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeHotel} 
                            onChange={(e) => setField("includeHotel", e.target.checked)}
                          >
                            Hotel
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeVisa} 
                            onChange={(e) => setField("includeVisa", e.target.checked)}
                          >
                            Visa
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeEating} 
                            onChange={(e) => setField("includeEating", e.target.checked)}
                          >
                            Makan 3 Kali Sehari
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeFullACBuss} 
                            onChange={(e) => setField("includeFullACBuss", e.target.checked)}
                          >
                            Bus Full AC
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeMuthawif} 
                            onChange={(e) => setField("includeMuthawif", e.target.checked)}
                          >
                            Muthawif
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeSpecialGuide} 
                            onChange={(e) => setField("includeSpecialGuide", e.target.checked)}
                          >
                            Guide Khusus
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeTranslator} 
                            onChange={(e) => setField("includeTranslator", e.target.checked)}
                          >
                            Penerjemah
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeTourLeader} 
                            onChange={(e) => setField("includeTourLeader", e.target.checked)}
                          >
                            Tour Leader
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includePassport} 
                            onChange={(e) => setField("includePassport", e.target.checked)}
                          >
                            Passport
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeVaccination} 
                            onChange={(e) => setField("includeVaccination", e.target.checked)}
                          >
                            Vaksinasi
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeHealthService} 
                            onChange={(e) => setField("includeHealthService", e.target.checked)}
                          >
                            Layanan Kesehatan
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeExtraTour} 
                            onChange={(e) => setField("includeExtraTour", e.target.checked)}
                          >
                            Tour Tambahan
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeGroupCar} 
                            onChange={(e) => setField("includeGroupCar", e.target.checked)}
                          >
                            Mobil Kelompok
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeSouvenir} 
                            onChange={(e) => setField("includeSouvenir", e.target.checked)}
                          >
                            Souvenir
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeSnack} 
                            onChange={(e) => setField("includeSnack", e.target.checked)}
                          >
                            Snack
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeVoucher} 
                            onChange={(e) => setField("includeVoucher", e.target.checked)}
                          >
                            Voucher
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeSecurity} 
                            onChange={(e) => setField("includeSecurity", e.target.checked)}
                          >
                            Layanan Keamanan
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeLugageOverload} 
                            onChange={(e) => setField("includeLugageOverload", e.target.checked)}
                          >
                            Kelebihan Bagasi
                          </Checkbox>
                          <Checkbox 
                            isChecked={form.includeEquipment} 
                            onChange={(e) => setField("includeEquipment", e.target.checked)}
                          >
                            Perlengkapan
                          </Checkbox>
                      </SimpleGrid>
                  </FormControl>
                  {/* --- END NEW INCLUSION CHECKBOXES --- */}

                  {/* Detail Textarea */}
                  <FormControl mt={4}>
                      <FormLabel fontSize="sm">Detail/Deskripsi Paket</FormLabel>
                      <Textarea
                          value={form.detail}
                          onChange={(e) => setField("detail", e.target.value)}
                          placeholder="Masukkan detail atau deskripsi lengkap paket di sini..."
                          borderRadius="lg"
                          minHeight="100px"
                          _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                      />
                  </FormControl>

                  {/* Bank Accounts dynamic UI */}
                  <FormControl>
                      <Flex alignItems="center" justifyContent="space-between" mt={2}>
                          <FormLabel m={0} fontSize="sm">Metode Pembayaran</FormLabel>
                          <Button
                              type="button"
                              onClick={addBankAccount}
                              size="xs"
                              leftIcon={<AddIcon />}
                          >
                              Tambah
                          </Button>
                      </Flex>

                      <VStack spacing={2} mt={2} align="stretch">
                          {(form.bankAccounts || []).map((acc, idx) => (
                              <Box key={idx} borderWidth="1px" borderRadius="lg" p={2} bg={formBg}>
                                  <Flex justifyContent="flex-end" mb={1}>
                                      <Button type="button" size="xs" variant="ghost" colorScheme="red" onClick={() => removeBankAccount(idx)}>Remove</Button>
                                  </Flex>
                                  <VStack spacing={2} align="stretch">
                                      <Select 
                                          size="md" // Back to default md size for list
                                          value={acc.bank_name || ""} 
                                          onChange={(e) => setBankAccountField(idx, "bank_name", e.target.value)}
                                      >
                                          <option value="">Select bank</option>
                                          {BANK_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                                      </Select>
                                      <Input size="md" placeholder="Account holder name" value={acc.user_name || ""} onChange={(e) => setBankAccountField(idx, "user_name", e.target.value)} />
                                      <Input size="md" placeholder="Account number / VA" value={acc.number || ""} onChange={(e) => setBankAccountField(idx, "number", e.target.value)} />
                                  </VStack>
                              </Box>
                          ))}
                      </VStack>
                  </FormControl>

                  {/* Submit Button */}
                  <Button colorScheme="blue" type="submit" mt={4} w="100%">
                      Simpan
                  </Button>
              </VStack>
          </Card>
      </Flex>
      </Grid>
      {/* Delete Product */}
    </Box>
  );
}
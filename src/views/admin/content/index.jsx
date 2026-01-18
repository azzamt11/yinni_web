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
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Image,
  Textarea,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

// Custom components
import ContentNFT from "components/card/ContentNFT";
import Card from "components/card/Card.js";

// Assets (Keep assets for display placeholders)
import Nft3 from "assets/img/nfts/Nft3.png";

// --- CONTENT CHANGE: Updated Content Model Fields ---
const initialForm = {
  id: "new",
  name: "", // Mapped to Content.Name (Title)
  type: "News", // Mapped to Content.Type
  category: "Umum", // Mapped to Content.Category
  date: "", // Mapped to Content.Date
  url: "", // Mapped to Content.URL (Main content link/path)
  thumbnailUrl: null, // Mapped to Content.ThumbnailURL (Set by file upload)
  rating: 5, // Mapped to Content.Rating
  duration: 0, // Mapped to Content.Duration (Optional, can be used for video length)
  detail: "", // Mapped to Content.Description
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8088";
const CONTENT_TYPE_OPTIONS = ["News", "Video", "Article", "Event", "Audio", "Book", "Other"];
const CONTENT_CATEGORY_OPTIONS = ["Umum", "Sosial", "Politik", "Bisnis", "Teknologi"];

// --- CONTENT CHANGE: Updated Endpoints ---
const ENDPOINTS = {
  list: `${API_BASE_URL}/content/all`, // Changed from /package/all
  create: `${API_BASE_URL}/content`, // Changed from /package
  detail: (id) => `${API_BASE_URL}/content/detail/${id}`, // Changed from /package/detail
  uploadImage: `${API_BASE_URL}/uploads/image`, // Used for ThumbnailURL
  uploadVideo: `${API_BASE_URL}/uploads/video`,
};
// -------------------------------------------------------------------


export default function ContentPage() { // --- CONTENT CHANGE: Rename function ---
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const subtextColor = useColorModeValue("gray.500", "gray.400");
  const toast = useToast();
  
  // --- Form State ---
  const [form, setForm] = useState(initialForm);
  const [panelMode, setPanelMode] = useState("add"); 
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(""); // Reuse category filter for content category
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Handlers
  const setField = (key, value) => {
    console.log(`value = ${value}`)
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // --- CONTENT CHANGE: Removed all Package-specific handlers (Bank, Accomodation) ---

  // --- CONTENT CHANGE: Updated fetchPackages to fetchContent ---
  async function fetchContent(p = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (categoryFilter) params.set("category", categoryFilter);
      const res = await fetch(`${ENDPOINTS.list}?${params.toString()}`);
      
      // Log the raw response object (metadata, status, headers)
      console.log("getAllContent Raw Fetch Response:", res); 
      
      if (!res.ok) throw new Error(`Status ${res.status}`);
      
      const json = await res.json();
      
      // 👇 ADDED: Log the parsed JSON data (the actual content list)
      console.log("Parsed Content List JSON:", json); 
      
      const paged = json.data || {};
      
      setItems(paged.items || []);
      setPage(paged.page || p);
    } catch (err) {
      console.error("fetchContent:", err);
      toast({
        title: "Error",
        description: `Gagal Memuat Data Konten: ${err.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // --- CONTENT CHANGE: handleImageUpload now sets thumbnailUrl ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingImage(true);
      const response = await axios.post(
        ENDPOINTS.uploadImage, // Use the constant ENDPOINTS.uploadImage
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const imageUrl = `${API_BASE_URL}${response.data.data.url}`;
      console.log(`imageUrl = ${imageUrl}`);
      setForm({ ...form, thumbnailUrl: imageUrl }); // 🚨 Set thumbnailUrl
      toast({
        title: "Upload Sukses",
        description: "Gambar thumbnail berhasil diunggah.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      console.log("Thumbnail Upload successful:", imageUrl);
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

  // --- CONTENT CHANGE: handleVideoUpload now sets url ---
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingVideo(true); 
      const response = await axios.post(
        ENDPOINTS.uploadVideo, // Use the video endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const videoUrl = response.data.data.url;
      // 🚨 IMPORTANT: Set the resulting file path to the main URL field
      setForm({ ...form, url: videoUrl }); 
      
      toast({
          title: "Upload Sukses",
          description: `Video berhasil diunggah.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
    } catch (error) {
      console.error("Video Upload failed:", error);
      toast({
        title: "Error Upload Video",
        description: `Gagal mengunggah video: ${error.message}.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploadingVideo(false);
    }
  };

  // --- CONTENT CHANGE: Updated handleSubmit to match Content model payload ---
  async function handleSubmit(e) {
    e && e.preventDefault();

    const payload = {
      name: (form.name || "").trim(), // Content.Name
      category: form.category, // Content.Category
      date: new Date().toISOString(), // Content.Date 👈 CORRECTED LINE
      url: (form.url || "").trim(), // Content.URL (The main link/path)
      thumbnailUrl: (form.thumbnailUrl || "").trim(), // Content.ThumbnailURL
      image: (form.thumbnailUrl || "").trim(), // 🚨 Also map to 'image' for redundancy with your Go model
      description: (form.detail || "").trim(), // Content.Description
      type: form.type, // Content.Type
      rating: Number(form.rating) || 5, // Content.Rating
      duration: Number(form.duration) || 0, // Content.Duration
      // Removed all price, inclusion, bank, accommodation fields
    };

    // 👇 ADD THIS LINE TO LOG THE RAW REQUEST PAYLOAD
    console.log("Raw Request Payload:", JSON.stringify(payload, null, 2));

    if (!payload.name) {
      toast({
        title: "Validation Error",
        description: "Nama konten belum diisi",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!payload.description) {
      toast({
        title: "Validation Error",
        description: "Deskripsi konten belum diisi",
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

      console.log("Raw Fetch Response:", res);
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
        description: `Data Konten berhasil dikirim.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Reset form and refresh content list
      setForm(initialForm); 
      setPanelMode("add");
      fetchContent(page);
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

  // --- CONTENT CHANGE: Updated handleEdit to match Content model fields ---
  async function handleEdit(contentId) {
    setLoading(true);
    try {
      const res = await fetch(ENDPOINTS.detail(contentId), {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      const content = json.data; 

      const dateOnly = content.Date ? content.Date.split('T')[0] : ""; // Use capitalized Date from Gorm.Model

      // Set the form state with full data
      setForm({
        id: contentId,
        name: content.name || "",
        category: content.category || "Umum",
        date: content.date || dateOnly,
        url: content.url || "",
        thumbnailUrl: content.ThumbnailUrl || content.image || null, // 🚨 Use ThumbnailURL, fallback to Image
        rating: content.rating || 5,
        duration: content.duration || 0,
        type: content.type || "News",
        detail: content.description || "", // Mapped from Description
      });

      setPanelMode("edit");
      
      toast({
        title: "Mode Edit Aktif",
        description: `Memuat data untuk ${content.Name}.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      const formCard = document.getElementById("content-form-card");
      if (formCard) {
        formCard.scrollIntoView({ behavior: 'smooth' });
      }

    } catch (err) {
      console.error("handleEdit:", err);
      toast({
        title: "Error",
        description: `Gagal Memuat Data Konten: ${err.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  // --- CONTENT CHANGE: Updated handleDelete to match Content model ---
  async function handleDelete(contentId) {
    if (!window.confirm("Apakah Anda yakin ingin menghapus konten ini? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }

    setLoading(true);
    try {
      const url = ENDPOINTS.detail(contentId); 
      
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
        description: `Data Konten ID ${contentId} berhasil dihapus.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      fetchContent(page); // --- CONTENT CHANGE: Call fetchContent ---

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
    fetchContent(1); // --- CONTENT CHANGE: Initial fetch is fetchContent ---
  }, [categoryFilter]); // Add categoryFilter to dependency array for automatic refresh
  
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
                Konten Terbaru
              </Text>
              <Flex
                align='center'
                me='20px'
                ms={{ base: "24px", md: "0px" }}
                mt={{ base: "20px", md: "0px" }}>
                {CONTENT_CATEGORY_OPTIONS.map((cat) => (
                    <Link
                      key={cat}
                      color={categoryFilter === cat ? textColorBrand : subtextColor}
                      fontWeight='500'
                      me={{ base: "34px", md: "44px" }}
                      onClick={() => setCategoryFilter(cat)}
                      cursor="pointer"
                    >
                      {cat}
                    </Link>
                ))}
                <Link
                  color={categoryFilter === "" ? textColorBrand : subtextColor}
                  fontWeight='500'
                  me={{ base: "34px", md: "44px" }}
                  onClick={() => setCategoryFilter("")}
                  cursor="pointer"
                >
                  Semua
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
                Tidak Ada Konten
              </Text>
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 3 }} gap='20px'>
              {items.map((cnt) => (
                <Box key={cnt.ID}>
                    <ContentNFT
                      name={cnt.name} // Changed from cnt.Name
                      author={cnt.type} // Changed from cnt.Type
                      image={cnt.thumbnailUrl ? `${cnt.thumbnailUrl}` : Nft3} // Changed from cnt.ThumbnailURL
                      contentUrl={cnt.url}
                      currentbid={`Type: ${cnt.type}`} // Changed from cnt.Type
                      download={cnt.ID}
                      date={cnt.date} // Changed from cnt.Date (or use cnt.CreatedAt for Gorm field)
                      onEdit= {() => handleEdit(cnt.ID)}
                      onDelete= {()=> handleDelete(cnt.ID)}
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
          <Card pt='22px' mt={{ base: "40px", xl: "40px" }} p="22px" as="form" onSubmit={handleSubmit} id="content-form-card">
              <Flex alignItems="center" justifyContent="space-between" pb="10px">
                  <Text color={'brand.500'} fontSize='xl' fontWeight='700'>
                      {panelMode === "add" ? "Tambah Konten Baru" : "Edit Konten"}
                  </Text>
                  <Button 
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                          setForm(initialForm); 
                          setPanelMode("add"); 
                      }} 
                  >
                      {panelMode === "edit" ? "Batal Edit" : "Reset"}
                  </Button>
              </Flex>
              <Text fontSize="sm" color={subtextColor} mb={4}>
                  {panelMode === "add" ? "Isi detail berikut untuk menambahkan konten baru." : `Mengedit Konten ID: ${form.id}`}
              </Text>

              <VStack spacing={4} align="stretch" pb={4}>
                  
                  {/* Name + Type */}
                  <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <FormControl isRequired>
                          <FormLabel fontSize="sm">Nama Konten / Judul</FormLabel>
                          <Input 
                              height="45px" 
                              borderRadius="lg" 
                              value={form.name} 
                              onChange={(e) => setField("name", e.target.value)} 
                              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          />
                      </FormControl>

                      <FormControl isRequired>
                          <FormLabel fontSize="sm">Tipe Konten</FormLabel>
                          <Select 
                              height="45px" 
                              borderRadius="lg"
                              value={form.type} 
                              onChange={(e) => setField("type", e.target.value)}
                              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          >
                              {CONTENT_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                          </Select>
                      </FormControl>
                  </Grid>

                  {/* Date + Category */}
                  {/*<Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <FormControl isRequired>
                          <FormLabel fontSize="sm">Tanggal Publish</FormLabel>
                          <Input 
                              height="45px" 
                              borderRadius="lg"
                              type="date" 
                              value={form.date} 
                              onChange={(e) => setField("date", e.target.value)} 
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
                              {CONTENT_CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                          </Select>
                      </FormControl>
                  </Grid>*/}
                  
                  {/* URL + Rating/Duration */}
                  <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      {panelMode === "add" ? <FormControl isRequired={panelMode != "add"}>
                        <FormLabel fontSize="sm">Link Konten Utama (URL)</FormLabel>
                        {form.type === "Video" ? (
                            // --- VIDEO UPLOAD INPUT (Displayed when type is Video) ---
                            <VStack 
                                spacing={1} 
                                border="2px dashed" 
                                borderColor={uploadingVideo ? "brand.500" : "gray.300"}
                                borderRadius="lg"
                                p={4}
                            >
                                <Text fontSize="sm" color={subtextColor} mb={2}>
                                    {uploadingVideo ? "Mengunggah..." : "Klik atau seret file video ke sini (.mp4, .mov)"}
                                </Text>

                                <Input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoUpload}
                                    p={1}
                                    // Hide the default button to make the drag area cleaner
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
                                />
                                {form.url && (
                                    <Text fontSize="xs" color="green.500" mt={2}>
                                        Diunggah: {form.url}
                                    </Text>
                                )}
                            </VStack>
                        ) : (
                            // --- STANDARD URL INPUT (Displayed for other types) ---
                            <Input 
                                height="45px" 
                                borderRadius="lg"
                                value={form.url} 
                                onChange={(e) => setField("url", e.target.value)} 
                                placeholder="e.g., https://youtube.com/..."
                                _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                            />
                        )}
                    </FormControl> : null}
                      <FormControl>
                          <FormLabel fontSize="sm">Durasi (Menit / Bab)</FormLabel>
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
                  </Grid>
                  
                  {/* Rating Field */}
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

                  {/* Image Upload for ThumbnailURL */}
                  <FormControl>
                      <FormLabel fontSize="sm">Gambar Thumbnail</FormLabel>
                      <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload} // This handler sets thumbnailUrl
                          p={2} 
                          height="45px"
                          borderRadius="lg"
                      />
                      {form.thumbnailUrl && (
                          <Image
                              src={form.thumbnailUrl.startsWith("http") ? form.thumbnailUrl : `${API_BASE_URL}${form.thumbnailUrl}`}
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

                  {/* Detail Textarea (Content.Description) */}
                  <FormControl mt={4} isRequired>
                      <FormLabel fontSize="sm">Detail/Deskripsi Konten</FormLabel>
                      <Textarea
                          value={form.detail}
                          onChange={(e) => setField("detail", e.target.value)}
                          placeholder="Masukkan detail atau deskripsi lengkap konten di sini..."
                          borderRadius="lg"
                          minHeight="150px"
                          _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                      />
                  </FormControl>

                  {/* --- CONTENT CHANGE: Removed all Inclusion Checkboxes --- */}
                  {/* --- CONTENT CHANGE: Removed all Bank Account UI --- */}

                  {/* Submit Button */}
                  <Button colorScheme="blue" type="submit" mt={4} w="100%">
                      Simpan Konten
                  </Button>
              </VStack>
          </Card>
      </Flex>
      </Grid>
    </Box>
  );
}
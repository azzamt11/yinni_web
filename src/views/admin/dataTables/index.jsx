// Chakra imports
import { 
    Box, 
    SimpleGrid, 
    Flex, 
    useToast, 
    Spinner, // Added Spinner for loading state
    Text, // Retained Text for error message
    Button, // Added Button
    HStack, // Added HStack for horizontal alignment
    Select // Added Select for changing page size (optional but recommended)
} from "@chakra-ui/react";

import {useEffect, useState, useCallback} from 'react';
// Import only the necessary table components and data
import TableTopCreators from "views/admin/dataTables/components/TableTopCreators";
import Card from "components/card/Card.js";
import { tableColumnsTopCreators } from "views/admin/dataTables/variables/tableColumnsTopCreators";

import React from "react";

// --- REQUIRED UTILITY IMPORTS --
// Import token and role update functions from your Auth.js
import api from "../../../utils/Api";
import { getToken, getStoredUser, updateUserRoleInStorage } from "../../../Auth"; 
// --------------------------------

export default function Settings() {
    const toast = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [pagination, setPagination] = useState({ 
        page: 1, 
        pageSize: 10, 
        totalCount: 0, 
        count: 0 
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Function to fetch all users (or a paginated list for administration)
    const fetchUsers = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) throw new Error("Authentication token missing.");

            // 1. Send request (You can also add ?page=x&pageSize=y here if needed)
            const response = await api.get(`superadmin/users/all?page=${page}&pageSize=${pagination.pageSize}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            // 2. Extract the PaginatedUserResponse object
            // This is the object containing date, count, page, totalCount, and items
            const paginatedData = response.data.data; 

            // 3. Extract the array of users
            const userItems = paginatedData.items || [];
            
            // 4. Filter out the current logged-in SUPERADMIN
            const currentUser = getStoredUser();
            const filteredUsers = userItems
                .filter(user => user.id !== currentUser?.id);
                
            // 5. Update state
            setUsers(filteredUsers);
            
            // Optional: Store pagination data if you want to display page numbers later
            setPagination({
                count: paginatedData.count,
                page: paginatedData.page,
                pageSize: paginatedData.pageSize,
                totalCount: paginatedData.totalCount,
            });

        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Gagal memuat daftar pengguna. Pastikan Anda memiliki peran SUPERADMIN.");
            toast({
                title: "Error",
                description: "Gagal memuat daftar pengguna.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }, [toast, pagination.pageSize]);

    useEffect(() => {
        fetchUsers(currentPage); 
    }, [fetchUsers, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0) {
            setCurrentPage(newPage);
        }
    };

    // Function to promote a user's role
    const promoteFunction = useCallback(async (userId) => {
        const newRole = "ADMIN";
        if (!window.confirm(`Yakin ingin mempromosikan pengguna ini (ID: ${userId}) menjadi ${newRole}?`)) {
            return;
        }

        try {
            const token = getToken();
            if (!token) throw new Error("Authentication token missing.");

            // Call the protected SUPERADMIN API endpoint
            await api.post('/superadmin/promote-user', {
                user_id: userId,
                new_role: newRole, 
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast({
                title: "Promosi Berhasil",
                description: `Pengguna berhasil dipromosikan menjadi ${newRole}.`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            // Re-fetch users to update the table's displayed roles
            fetchUsers();

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Promosi gagal karena kesalahan tak dikenal.";
            console.error("Promotion failed:", err);
            toast({
                title: "Promosi Gagal",
                description: errorMessage,
                status: "error",
                duration: 7000,
                isClosable: true,
            });
        }
    }, [toast, fetchUsers]);


    if (loading) {
        return (
             <Box pt={{ base: "50px", md: "10px", xl: "10px" }} textAlign="center">
                <Spinner size="xl" color="brand.500" />
                <Text mt={4}>Memuat daftar pengguna...</Text>
             </Box>
        );
    }
    
    if (error) {
        return (
            <Box pt={{ base: "50px", md: "10px", xl: "10px" }} textAlign="center">
                <Text color="red.500" fontSize="xl">{error}</Text>
                <Text mt={2}>Silakan coba refresh halaman atau cek koneksi API.</Text>
            </Box>
        );
    }

    const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);
    const hasNextPage = pagination.page < totalPages;
    const hasPrevPage = pagination.page > 1;

    return (
        <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
            <SimpleGrid
                mb='20px'
                columns={{ sm: 1, md: 1, xl: 1 }} 
                spacing={{ base: "0", xl: "0" }}
            >
                <Flex flexDirection='column' w='100%'>
                    <Card px='0px' mb='20px'>
                        <TableTopCreators
                            tableData={users}
                            columnsData={tableColumnsTopCreators} 
                            promoteFunction={promoteFunction}
                        />
                    </Card>
                    
                    {/* -------------------- PAGINATION CONTROLS START -------------------- */}
                    {pagination.totalCount > 0 && (
                        <Flex 
                            justifyContent="space-between" 
                            alignItems="center" 
                            mt={4} 
                            px={4}
                        >
                            {/* Status Info */}
                            <Text fontSize="sm">
                                Menampilkan {pagination.count} dari {pagination.totalCount} pengguna. (Halaman {pagination.page} dari {totalPages})
                            </Text>

                            {/* Navigation Buttons */}
                            <HStack spacing={2}>
                                <Button
                                    size="sm"
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    isDisabled={!hasPrevPage}
                                >
                                    Sebelumnya
                                </Button>
                                
                                {/* Current Page Text or simple selector */}
                                <Text fontSize="md" fontWeight="bold">
                                    {pagination.page}
                                </Text>

                                <Button
                                    size="sm"
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    isDisabled={!hasNextPage}
                                >
                                    Berikutnya
                                </Button>
                            </HStack>
                        </Flex>
                    )}
                    {/* -------------------- PAGINATION CONTROLS END -------------------- */}

                </Flex>
            </SimpleGrid>
        </Box>
    );
}
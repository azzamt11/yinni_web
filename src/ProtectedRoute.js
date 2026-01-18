// src/router/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, hasRole } from "./Auth";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Center,
} from "@chakra-ui/react";

export default function ProtectedRoute({ children, roles = [] }) {
  const location = useLocation();

  if (location.pathname.startsWith("/auth")) {
    return children;
  }

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/auth/sign-in"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (roles.length > 0 && !hasRole(roles)) {
    return (
      <>
        <Center h="100vh" bg="gray.50">
          <Text fontSize="xl" fontWeight="bold" color="gray.600">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </Text>
        </Center>

        <Modal isOpen={true} onClose={() => window.history.back()}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Akses Ditolak</ModalHeader>
            <ModalBody>
              <Text color="red.500">
                Anda tidak memiliki izin untuk mengakses halaman ini.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                onClick={() => window.history.back()}
              >
                Back
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  // 🎯 Allowed — render child route
  return children;
}

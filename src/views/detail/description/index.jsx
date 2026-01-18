// Chakra imports
import { Box, Grid} from "@chakra-ui/react";
import { useLocation } from 'react-router-dom'; // 👈 IMPORT useLocation
import CheckoutNFT from "./components/CheckoutNFT";
import Projects from "./components/Projects";

import avatar from "assets/img/avatars/avatar4.png";
import banner from "assets/img/nfts/NftBanner1.png";

// Custom components
import General from "views/user/checkout/components/General";

// Assets
import React, {useEffect} from "react";

export default function Description({ checkoutPackage }) {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Fallback: If no package data is found, display an error or redirect
    if (!checkoutPackage) {
        return (
            <Box pt="130px" textAlign="center">
                <p>No package selected for Description. Please return to the product page.</p>
            </Box>
        );
    }
    
    // Destructure pkg for cleaner access (optional, but good practice)
    const pkg = checkoutPackage;
    
    // Assuming API_BASE_URL and Nft3 are defined somewhere in scope
    const API_BASE_URL = 'http://your-api-base-url.com/'; // Replace with actual base URL
    const Nft3 = 'path/to/default/image.jpg'; // Replace with actual default image

    return (
      <Box pt={{ base: "100px", md: "50px", xl: "50px" }}>
        {/* COMBINED GRID: We use a single Grid container to stack both components
            and set gap="0px" to remove the vertical spacing between them. */}
        <Grid
          templateColumns="1fr" // Always full width
          templateRows="auto auto" // Auto-sizing rows for the two stacked components
          gap="0px" // CRITICAL: This removes the vertical gap between the rows
          w="100%"
        > 
          
          {/* Item 1: CheckoutNFT Card (Row 1) */}
          <CheckoutNFT
            name={pkg.name}
            author={pkg.category}
            image={pkg.image}
            currentbid={pkg.discountedPrice ? `Rp ${pkg.discountedPrice}` : `Rp ${pkg.originalPrice}`}
            download={pkg.ID}
            date={pkg.date}
          />
          
          {/* Item 2: General Information (Row 2) */}
        </Grid>
        <Projects    
            gridArea='1 / 2 / 2 / 2'
            banner={banner}
            avatar={avatar}
            name='Adela Parkson'
            job='Product Designer'
            posts='17'
            followers='9.7k'
            following='274'
            pkg= {pkg}
        />
      </Box>
  );
}
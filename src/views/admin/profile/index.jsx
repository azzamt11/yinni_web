/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Yinni - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Yinni (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, Grid } from "@chakra-ui/react";
import {useEffect} from 'react';

// Custom components
import Banner from "views/admin/profile/components/Banner";
import General from "views/admin/profile/components/General";
import Notifications from "views/admin/profile/components/Notifications";
import Projects from "views/admin/profile/components/Projects";
import Storage from "views/admin/profile/components/Storage";
import Upload from "views/admin/profile/components/Upload";
import { getStoredUser } from "../../../Auth";

// Assets
import banner from "assets/img/auth/Banner.jpg";
import React from "react";

export default function Overview() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1fr",
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <Banner
          gridArea='1 / 1 / 1 / 1'
          banner={banner}
          avatar={null}
          name={getStoredUser().name}
          job={getStoredUser().role}
          posts='0'
          followers='0'
          following='0'
        />
        {/*<Upload
          gridArea={{
            base: "3 / 1 / 4 / 2",
            lg: "1 / 2 / 2 / 3",
          }}
          minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
          pe='20px'
          pb={{ base: "100px", lg: "20px" }}
        />*/}
      </Grid>
    </Box>
  );
}

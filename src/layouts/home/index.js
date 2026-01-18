import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'; // 2. Import useLocation
// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterUser.js';
// Layout components
import Navbar from 'components/navbar/NavbarUser.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import { isAuthenticated, hasRole } from '../../Auth';
import homeRoutes from 'homeRoutes.js';

// Custom Chakra theme
export default function HomeLayout(props) {
  const { ...rest } = props;
  
  // 3. Initialize useLocation hook
  const location = useLocation(); 

  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  
  // 4. Use state to store the computed values for Navbar
  const [activeRouteName, setActiveRouteName] = useState('Default Brand Text');
  const [activeNavbarState, setActiveNavbarState] = useState(false);
  const [activeNavbarText, setActiveNavbarText] = useState(false);
  
  // 5. Functions are moved outside the component or memoized/kept as is.
  // We will call them inside useEffect to trigger updates.

  // functions for changing the states from components
  const getRoute = () => {
    // Uses location.pathname instead of window.location.pathname for React Router awareness
    return location.pathname !== '/user/full-screen-maps'; 
  };
  
  // 6. Refactored functions to accept the path directly instead of reading window.location
  const getActiveRoute = (routes, currentPath) => {
    let activeRoute = 'Default Brand Text';
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].items, currentPath);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].items, currentPath);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        // Use path comparison against the current location
        if (currentPath.includes(routes[i].layout + routes[i].path)) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  
  // Apply the same logic change to getActiveNavbar and getActiveNavbarText
  const getActiveNavbar = (routes, currentPath) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbar(routes[i].items, currentPath);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbar(routes[i].items, currentPath);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (currentPath.includes(routes[i].layout + routes[i].path)) {
          return routes[i].secondary;
        }
      }
    }
    return activeNavbar;
  };

  const getActiveNavbarText = (routes, currentPath) => {
    let activeNavbarText = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbarText(routes[i].items, currentPath);
        if (collapseActiveNavbar !== activeNavbarText) {
          return collapseActiveNavbar;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbarText(routes[i].items, currentPath);
        if (categoryActiveNavbar !== activeNavbarText) {
          return categoryActiveNavbar;
        }
      } else {
        if (currentPath.includes(routes[i].layout + routes[i].path)) {
          return routes[i].messageNavbar;
        }
      }
    }
    return activeNavbarText;
  };

  const getRoutes = (routes) => {
    return routes.map((route, key) => {
      if (route.layout === '/home') {
        console.log(`route.layout = ${route.layout}. route.path = ${route.path}, returning...`)
        return (
          <Route path={`${route.path}`} element={route.component} key={key} />
        );
      } else if (route.layout === '/user' && hasRole(["USER"])) {
        console.log(`route.layout = ${route.layout}. route.path = ${route.path}, returning...`)
        return (
          <Route path={`${route.path}`} element={route.component} key={key} />
        );
      }
      if (route.collapse) {
        return getRoutes(route.items);
      } else {
        return null;
      }
    });
  };

  // 7. Use useEffect to run the functions whenever the location changes
  useEffect(() => {
    const currentPath = location.pathname;
    setActiveRouteName(getActiveRoute(homeRoutes, currentPath));
    setActiveNavbarState(getActiveNavbar(homeRoutes, currentPath));
    setActiveNavbarText(getActiveNavbarText(homeRoutes, currentPath));
  }, [location.pathname]); // Re-run this effect whenever location.pathname changes
  
  document.documentElement.dir = 'ltr';
  const { onOpen } = useDisclosure();
  
  return (
    <Box>
      <Box>
        <SidebarContext.Provider
          value={{
            toggleSidebar,
            setToggleSidebar,
          }}
        >
          <Sidebar routes={homeRoutes} display="none" {...rest} />
          <Box
            float="right"
            minHeight="100vh"
            height="100%"
            overflow="auto"
            position="relative"
            maxHeight="100%"
            w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
            maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
            transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
            transitionDuration=".2s, .2s, .35s"
            transitionProperty="top, bottom, width"
            transitionTimingFunction="linear, linear, ease"
          >
            <Portal>
              <Box>
                <Navbar
                  onOpen={onOpen}
                  logoText={'Yinni Dashboard PRO'}
                  // 8. Pass the state values to the Navbar
                  brandText={activeRouteName}
                  secondary={activeNavbarState}
                  message={activeNavbarText}
                  fixed={fixed}
                  {...rest}
                />
              </Box>
            </Portal>

            {getRoute() ? (
              <Box
                mx="auto"
                p={{ base: '20px', md: '30px' }}
                pe="20px"
                minH="100vh"
                pt="50px"
              >
                <Routes>
                  {getRoutes(homeRoutes)}
                  <Route
                    path="/"
                    element={<Navigate to="/home/default" replace />}
                  />
                </Routes>
              </Box>
            ) : null}
            <Box>
              <Footer />
            </Box>
          </Box>
        </SidebarContext.Provider>
      </Box>
    </Box>
  );
}
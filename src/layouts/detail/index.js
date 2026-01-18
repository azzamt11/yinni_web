import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterUser.js';
import Navbar from 'components/navbar/NavbarUser.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import { isAuthenticated, hasRole } from '../../Auth';
import detailRoutes from 'detailRoutes.js';

export default function Detail(props) {
  const { ...rest } = props;

  // ----------------------------------------
  // 1. Read state from navigation
  // ----------------------------------------
  const location = useLocation();
  const incomingPkg = location.state?.checkoutPackage;

  // ----------------------------------------
  // 2. Persist data in layout-level state
  // (IMPORTANT: this keeps it alive across all subroutes)
  // ----------------------------------------
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    if (incomingPkg) {
      setPackageData(incomingPkg);
    }
  }, [incomingPkg]); // Only updates during first navigation into /detail/*


  // ----------------------------------------
  // Sidebar & Navbar states
  // ----------------------------------------
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [activeRouteName, setActiveRouteName] = useState('Default Brand Text');
  const [activeNavbarState, setActiveNavbarState] = useState(false);
  const [activeNavbarText, setActiveNavbarText] = useState(false);

  // ----------------------------------------
  // Helper functions
  // ----------------------------------------
  const getRoute = () => location.pathname !== '/user/full-screen-maps';

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
        if (currentPath.includes(routes[i].layout + routes[i].path)) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };

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
        let collapseActiveNavbarText = getActiveNavbarText(routes[i].items, currentPath);
        if (collapseActiveNavbarText !== activeNavbarText) {
          return collapseActiveNavbarText;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbarText = getActiveNavbarText(routes[i].items, currentPath);
        if (categoryActiveNavbarText !== activeNavbarText) {
          return categoryActiveNavbarText;
        }
      } else {
        if (currentPath.includes(routes[i].layout + routes[i].path)) {
          return routes[i].messageNavbar;
        }
      }
    }
    return activeNavbarText;
  };

  // ----------------------------------------
  // 3. Generate all nested detail routes
  // ----------------------------------------
  const getRoutes = (routes) => {
    return routes
      .map((route, key) => {
        if (route.layout === '/detail' && hasRole(["USER"])) {

          const Component = route.component;

          return (
            <Route
              path={`${route.path}`}
              key={key}
              element={<Component checkoutPackage={packageData} />} 
            />
          );
        }

        if (route.collapse) {
          return getRoutes(route.items);
        }

        return null;
      })
      .flat()
      .filter(Boolean);
  };


  // ----------------------------------------
  // 4. Update navbar text dynamically
  // ----------------------------------------
  useEffect(() => {
    const currentPath = location.pathname;
    setActiveRouteName(getActiveRoute(detailRoutes, currentPath));
    setActiveNavbarState(getActiveNavbar(detailRoutes, currentPath));
    setActiveNavbarText(getActiveNavbarText(detailRoutes, currentPath));
  }, [location.pathname]);


  document.documentElement.dir = 'ltr';
  const { onOpen } = useDisclosure();


  // ----------------------------------------
  // 5. Render final layout
  // ----------------------------------------
  return (
    <Box>
      <Box>
        <SidebarContext.Provider value={{ toggleSidebar, setToggleSidebar }}>
          <Sidebar routes={detailRoutes} display="none" {...rest} />

          <Box
            float="right"
            minHeight="100vh"
            height="100%"
            overflow="auto"
            position="relative"
            maxHeight="100%"
            w={{ base: '100%', xl: 'calc(100% - 290px)' }}
            maxWidth={{ base: '100%', xl: 'calc(100% - 290px)' }}
            transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          >
            <Portal>
              <Box>
                <Navbar
                  onOpen={onOpen}
                  logoText={'Yinni Dashboard PRO'}
                  brandText={activeRouteName}
                  secondary={activeNavbarState}
                  message={activeNavbarText}
                  fixed={fixed}
                  {...rest}
                />
              </Box>
            </Portal>

            {getRoute() && (
              <Box
                mx="auto"
                p={{ base: '20px', md: '30px' }}
                pe="20px"
                minH="100vh"
                pt="50px"
              >
                <Routes>
                  {getRoutes(detailRoutes)}

                  {/* Default redirect when going to /detail */}
                  <Route
                    path="/"
                    element={<Navigate to="/detail/description" replace />}
                  />
                </Routes>
              </Box>
            )}

            <Box>
              <Footer />
            </Box>
          </Box>
        </SidebarContext.Provider>
      </Box>
    </Box>
  );
}

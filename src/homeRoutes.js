import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdSell,
  MdVideocam,
  MdShoppingBasket,
  MdShoppingCart,
} from 'react-icons/md';

import Default from 'views/home/default';
import Contents from 'views/home/contents';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import HomeProduct from 'views/home/product';

const homeRoutes = [
  {
    name: 'Home',
    layout: '/home',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    path: '/default',
    component: <Default />,
  },
  // {
  //   name: 'Payment',
  //   layout: '/home',
  //   icon: <Icon as={MdSell} width="20px" height="20px" color="inherit" />,
  //   path: '/products',
  //   component: <HomeProduct />,
  // },
  {
    name: 'Konten',
    layout: '/user',
    icon: <Icon as={MdVideocam} width="20px" height="20px" color="inherit" />,
    path: '/content',
    component: <Contents />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default homeRoutes;

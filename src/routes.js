import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdHome,
  MdLock,
} from 'react-icons/md';

import Default from 'views/home/default';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
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
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;

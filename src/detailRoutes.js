import React from 'react';
import {Navigate} from 'react-router-dom';

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
  MdCheck,
  MdDescription,
} from 'react-icons/md';

import UserProfile from 'views/user/profile';
import Checkout from 'views/detail/checkout';
import Description from 'views/detail/description';
import Default from 'views/home/default';
// Auth Imports
import SignInCentered from 'views/auth/signIn';
import Product from 'views/admin/product';
import HomeProduct from 'views/home/product';

const detailRoutes = [
  {
    name: 'Deskripsi Paket',
    layout: '/detail',
    path: '/description',
    icon: <Icon as={MdDescription} width="20px" height="20px" color="inherit" />,
    component: Description
  },
  {
    name: 'Checkout',
    layout: '/detail',
    path: '/checkout',
    icon: <Icon as={MdShoppingCart} width="20px" height="20px" color="inherit" />,
    component: Checkout,
  },
  {
    name: 'Exit',
    layout: '/detail',
    path: '/exit',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: () => <Navigate to="/home/default" replace />
  },
];

export default detailRoutes;

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
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import Profile from 'views/admin/profile';
import Content from 'views/admin/content';
import Orders from 'views/admin/orders';
import SuperAdminDashboard from 'views/admin/dataTables';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import SignUpCentered from 'views/auth/register';
import Product from 'views/admin/product';

const routes = [
  {
    name: 'Dashboard Utama',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Produk',
    layout: '/admin',
    icon: <Icon as={MdSell} width="20px" height="20px" color="inherit" />,
    path: '/products',
    component: <Product />,
  },
  {
    name: 'Order',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/order',
    component: <Orders />,
  },
  {
    name: 'Konten',
    layout: '/admin',
    icon: <Icon as={MdVideocam} width="20px" height="20px" color="inherit" />,
    path: '/content',
    component: <Content />,
  },
  {
    name: 'Profil',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
  {
    name: 'Sign Up',
    layout: '/auth',
    path: '/sign-up',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignUpCentered />,
  },
  {
    name: 'Dashboard Super Admin',
    layout: '/admin',
    path: '/super-admin-dashboard',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SuperAdminDashboard />,
  },
];

export default routes;

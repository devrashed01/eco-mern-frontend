import { RiUserSettingsFill } from 'react-icons/ri'
import { RxDashboard } from 'react-icons/rx'

export const drawerLinks: DrawerLink[] = [
  {
    label: 'Dashboard',
    link: '/dashboard',
    icon: RxDashboard,
  },

  {
    label: 'All Users',
    link: '/users',
    icon: RiUserSettingsFill,
    child: [
      {
        label: 'Pending Users',
        link: '/users/pending',
      },
      {
        label: 'Active Users',
        link: '/users/active',
      },
      {
        label: 'Inactive Users',
        link: '/users/inactive',
      },
    ],
  },
]

export const sellerDrawerLinks: DrawerLink[] = [
  {
    label: 'Dashboard',
    link: '/dashboard',
    icon: RxDashboard,
  },
]

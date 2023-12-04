import PatientsIcon from 'components/icons/PatientsIcon'
import { RxDashboard } from 'react-icons/rx'

export const drawerLinks: DrawerLink[] = [
  {
    label: 'Dashboard',
    link: '/dashboard',
    icon: RxDashboard,
  },
  {
    label: 'All Patients',
    link: '/all-patients',
    icon: PatientsIcon,
    child: [
      {
        label: 'Pending Patients',
        link: '/all-patients/pending',
      },
    ],
  },
]

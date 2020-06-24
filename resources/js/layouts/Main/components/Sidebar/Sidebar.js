import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';

import { Profile, SidebarNav } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 200,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(1)
  },
  divider: {
    margin: theme.spacing(1, 0)
  },
  nav: {
    marginBottom: theme.spacing(1)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <DashboardIcon />,      
    },
    {
      title: 'Đào tạo',
      href: '#',
      icon: <LocalLibraryIcon />,
      children: [
        {
          title: 'Cơ sở',
          href: '/centers',
        },
        {
          title: 'Phòng học',
          href: '/rooms',
        },
        {
          title: 'Khóa học',
          href: '/courses',
        },
        {
          title: 'Lớp học',
          href: '/classes'
        },
        {
          title: 'Điểm danh',
          href: '/attendance'
        }
      ]
    },
    {
      title: 'Nhận sự',
      href: '#',
      icon: <PeopleIcon />,
      children: [
        {
          title: 'Giáo viên',
          href: '/teachers',
        },
        {
          title: 'Lương tối thiểu',
          href: '/base-salary',
        }

      ]
    },
    {
      title: 'Công tác học sinh',
      href: '#',
      icon: <AssignmentIndIcon />,
      children: [
        {
          title: 'Đăng ký ghi danh',
          href: '/entrance/create',
        },
        {
          title: 'Danh sách ghi danh',
          href: '/entrance/list',
        },
        {
          title: 'Ưu đãi',
          href: '/discount'
        },
        {
          title: 'Học phí',
          href: '/fee'
        }
        
      ]
    },
    {
      title: 'Kế Toán',
      href: '#',
      icon: <AccountBalanceIcon />,
      children: [
        {
          title: 'Tài khoản',
          href: '/finaccount',
        },
        {
          title: 'Giao dịch',
          href: '/transaction',
        },
        {
          title: 'Phiếu chi',
          href: '/payment',
        },
        
        {
          title: 'Phiếu thu',
          href: '/receipt',
        },
      ]
    },
    {
      title: 'Tài khoản',
      href: '/account',
      icon: <AssignmentIndIcon />
    },
    {
      title: 'Cài đặt',
      href: '#',
      icon: <SettingsIcon />,
      children: [
        {
          title: 'Cấu hình quan hệ',
          href: '/settings/relationship',
        },
        {
          title: 'Cấu hình quy trình',
          href: '/settings/step'
        },
        {
          title: 'Cấu hình trạng thái',
          href: '/settings/status'
        }

      ]
    }
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
        <Divider className={classes.divider} />
        <Profile />
        
        
        
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;

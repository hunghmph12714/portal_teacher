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
var to = new Date()
var from = new Date('2022-01-01')
const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;
  const classes = useStyles();

  const pages = [
    {
      title: 'Bảng điều khiển',
      href: '/dashboard',
      icon: <DashboardIcon />,      
    },
    {
      title: 'Đào tạo',
      href: '#',
      icon: <LocalLibraryIcon />,
      children: [
        {
          title: 'Lớp học',
          href: '/classes'
        },
        {
          title: 'Điểm danh',
          href: '/attendance'
        },
        {
          title: 'Kho bài tập',
          href: '/cau-hoi'
        },
        {
          title: 'Mục tiêu KS',
          href: '/muc-tieu'
        },
        {
          title: 'Thi thử',
          href: '/events',
        },   
        {
          title: 'Khoá học',
          href: '/khoa-hoc',
        },    
      ]
    },
    {
      title: 'Công tác học sinh',
      href: '#',
      icon: <AssignmentIndIcon />,
      children: [
        {
          title: 'Đăng ký ghi danh',
          href: '/entrance/quick-create',
        },
        {
          title: 'DS ghi danh',
          href: '/entrance/list/2_3_4_5/0/' + from.getTime() + '/' +to.getTime(),
          children: [
            {
              title: 'DS hoàn thành',
              href: '/entrance/completed',
            },
          ]
        },
        {
          title: 'Ưu đãi',
          href: '/discount'
        },
        {
          title: 'Học phí',
          href: '/fee',
        }        
      ]
    },
    {
      title: 'Kế Toán',
      href: '#',
      icon: <AccountBalanceIcon />,
      subject: 'Kế toán',
      action: 'view_account',
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
        {
          title: 'Báo cáo',
          href: '#',
          children: [
            {
              title: 'Báo cáo dòng tiền',
              href: '/report/cf'
            },
            {
              title: 'Sổ quỹ tiền mặt',
              href: '/report/book'
            },
            {
              title: 'Lương giáo viên',
              href: '/report/revenue'
            },
            
          ]
        },
        {
          title: 'Kết xuất dữ liệu',
          href: '/misa'
        }
      ]
    },
    {
      title: 'Tài khoản',
      href: '/account',
      icon: <AssignmentIndIcon />
    },
    {
      title: 'Nhân sự',
      href: '#',
      icon: <PeopleIcon />,
      subject: 'Nhân sự',
      action: 'view_hr',
      children: [        
        {
          title: 'Chức vụ',
          href: '/settings/role',
          subject: 'Phân quyền',
          action: 'view_roles'
        },
        {
          title: 'Người dùng',
          href: '/settings/user',
          subject: 'Người dùng',
          action: 'view_users'
        },        
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
      title: 'Cài đặt',
      href: '#',
      icon: <SettingsIcon />,
      subject: 'Cài đặt',
      action: 'view_settings',
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
        },

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

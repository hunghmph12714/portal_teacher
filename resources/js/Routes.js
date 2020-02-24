import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout, ProtectedRouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';
import auth from './auth';
import {
  Dashboard as DashboardView,
  ProductList as ProductListView,
  UserList as UserListView,
  Typography as TypographyView,
  Icons as IconsView,
  Account as AccountView,
  Settings as SettingsView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  CenterList as CenterListView,
  TeacherList as TeacherListView,
  BaseSalary as BaseSalary
} from './views';

const Routes = (props) => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/dashboard"
      />
      <Redirect
        exact
        from="/home"
        to="/dashboard"
      />
      <ProtectedRouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <ProtectedRouteWithLayout
        component={CenterListView}
        exact
        layout={MainLayout}
        path="/centers"
      />
      <ProtectedRouteWithLayout
        component={TeacherListView}
        exact
        layout={MainLayout}
        path="/teachers"
      />
      <ProtectedRouteWithLayout
        component={BaseSalary}
        exact
        layout={MainLayout}
        path="/base-salary"
      />
      <ProtectedRouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      />
      <ProtectedRouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/products"
      />
      <ProtectedRouteWithLayout
        component={TypographyView}
        exact
        layout={MainLayout}
        path="/typography"
      />
      <ProtectedRouteWithLayout
        component={IconsView}
        exact
        layout={MainLayout}
        path="/icons"
      />
      <ProtectedRouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      <ProtectedRouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
      />
      
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/login"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;

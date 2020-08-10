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
  BaseSalary as BaseSalary,
  Room as Room,
  Courses as Courses,
  Classes,
  Relationship,
  Step,
  Status, 
  CreateEntrance, ViewEntrance, ClassDetail, Attendance,
  FinAccount, Transaction, Discount,
  Payment, Receipt, Fee, AdjustFee, 
  Financial
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
        component={Room}
        exact
        layout={MainLayout}
        path="/rooms"
      />
      <ProtectedRouteWithLayout 
        component = { Classes }
        exact
        layout = { MainLayout }
        path = "/classes"
      />
      <ProtectedRouteWithLayout
        component={Courses}
        exact
        layout={MainLayout}
        path="/courses"
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
      <ProtectedRouteWithLayout
        component={Relationship}
        exact
        layout={MainLayout}
        path="/settings/relationship"
      />
      <ProtectedRouteWithLayout
        component={Step}
        exact
        layout={MainLayout}
        path="/settings/step"
      />
      <ProtectedRouteWithLayout
        component={Status}
        exact
        layout={MainLayout}
        path="/settings/status"
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
      <ProtectedRouteWithLayout 
        component = {CreateEntrance}
        exact
        layout={MainLayout}
        path="/entrance/create"
      />
      <ProtectedRouteWithLayout 
        component = {ViewEntrance}
        exact
        layout={MainLayout}
        path="/entrance/list"
      />
      
      <ProtectedRouteWithLayout 
        component = {ClassDetail}        
        layout={MainLayout}
        path="/class/:id"
      />
      <ProtectedRouteWithLayout 
        component = {Attendance}        
        layout={MainLayout}
        path="/attendance"
      />
      <ProtectedRouteWithLayout 
        component = {FinAccount}        
        layout={MainLayout}
        path="/finaccount"
      />
      <ProtectedRouteWithLayout 
        component = {Transaction}        
        layout={MainLayout}
        path="/transaction"
      />
      <ProtectedRouteWithLayout 
        component = {Discount}
        layout = {MainLayout}
        path = "/discount"
      />
      <ProtectedRouteWithLayout 
        component = {Payment}
        layout = {MainLayout}
        path = "/payment"
      />
      <ProtectedRouteWithLayout 
        component = {Receipt}
        layout = {MainLayout}
        path = "/receipt"
      />
      
      <ProtectedRouteWithLayout 
        component = {Fee}
        layout = {MainLayout}
        path = "/fee"
      />
      <ProtectedRouteWithLayout 
        component = {AdjustFee}
        layout = {MainLayout}
        path = "/fee-adjust"
      />
      <ProtectedRouteWithLayout 
        component = {Financial}
        layout = {MainLayout}
        path = "/report/financial"
      />
      
      <Redirect to="/not-found" />

    </Switch>
  );
};

export default Routes;

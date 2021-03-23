import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

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
  Roles,
  Status, 
  CreateEntrance, ViewEntrance, ClassDetail, Attendance, QuickCreateEntrance,
  FinAccount, Transaction, Discount,
  Payment, Receipt, Fee, AdjustFee, 
  Financial, Revenue, CashFlow,
  StudentDetail, Documents,
  Events, EventDetail, PublicForm, PublicResult,
  Users,Budget, BudgetStats

} from './views';

const Routes = (props) => {
  return (
    <Switch>
      <Route
        component={PublicForm}
        exact
        layout={MinimalLayout}
        path="/event-form"
      />
      <Route
        component={PublicResult}
        exact
        layout={MinimalLayout}
        path="/event-tra-cuu"
      />
      <Redirect
        exact
        from="/"
        to="/classes"
      />
      <Redirect
        exact
        from="/home"
        to="/classes"
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
        component={Budget}
        exact
        layout={MainLayout}
        path="/budget"
      />
      <ProtectedRouteWithLayout
        component={BudgetStats}
        exact
        layout={MainLayout}
        path="/budget/:id"
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
        component={Roles}
        exact
        layout={MainLayout}
        path="/settings/role"
      />
      <ProtectedRouteWithLayout
        component={Users}
        exact
        layout={MainLayout}
        path="/settings/user"
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
        component = {QuickCreateEntrance}
        exact
        layout={MainLayout}
        path="/entrance/quick-create"
      />
      <ProtectedRouteWithLayout 
        component = {ViewEntrance}
        exact
        layout={MainLayout}
        path="/entrance/list"
      />
      <ProtectedRouteWithLayout 
        component = {ViewEntrance}        
        layout={MainLayout}
        path="/entrance/list/:center_id/:step_id"
      />
      <ProtectedRouteWithLayout 
        component = {ClassDetail}        
        layout={MainLayout}
        path="/class/:id"
      />
      <ProtectedRouteWithLayout 
        component = {StudentDetail}        
        layout={MainLayout}
        path="/student/:id"
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
      <ProtectedRouteWithLayout 
        component = {CashFlow}
        layout = {MainLayout}
        path = "/report/cf"
      />
      <ProtectedRouteWithLayout 
        component = {Revenue}
        layout = {MainLayout}
        path = "/report/revenue"
      />
      
      <ProtectedRouteWithLayout 
        component = {Documents}
        layout = {MainLayout}
        path = "/documents"
      />
      <ProtectedRouteWithLayout 
        component = {Events}
        layout = {MainLayout}
        path = "/events"
      />
      <ProtectedRouteWithLayout 
        component = {EventDetail}
        layout = {MainLayout}
        path = "/event/:id"
      />
      
      <Redirect to="/not-found" />

    </Switch>
  );
};

export default Routes;

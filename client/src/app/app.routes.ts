import { Routes } from '@angular/router';
import { AdminAuthGuard } from './core/guards/admin-auth.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminLoginComponent } from './features/admin/admin-login/admin-login.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { ManageCommentComponent } from './features/admin/manage-comment/manage-comment.component';
import { ManagePostComponent } from './features/admin/manage-post/manage-post.component';
import { ManageUserComponent } from './features/admin/manage-user/manage-user.component';
import { ForgotPasswordComponent } from './features/forgot-password/forgot-password.component';
import { LoginComponent } from './features/login/login.component';
import { ProfileComponent } from './features/profile/profile.component';
import { RegisterComponent } from './features/register/register.component';
import { AdminLayoutComponent } from './shared/layout/admin-layout/admin-layout.component';
import { BlankLayoutComponent } from './shared/layout/blank-layout/blank-layout.component';
import { UserLayoutComponent } from './shared/layout/user-layout/user-layout.component';
import { HomeComponent } from './features/home/home.component';
import { ManageReportComponent } from './features/admin/manage-report/manage-report.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'manage-user',
        component: ManageUserComponent,
      },
      {
        path: 'manage-post',
        component: ManagePostComponent,
      },
      {
        path: 'manage-comment',
        component: ManageCommentComponent,
      },
      {
        path: 'manage-report',
        component: ManageReportComponent,
      },
    ],
  },
  {
    path: '',
    component: UserLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'admin/login', component: AdminLoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
    ],
  },
  //admin site
  { path: '**', redirectTo: '/login' },
];

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
  imports: [RouterModule, CommonModule],
})
export class AdminSidebarComponent {
  LinkManager = [
    {
      id: 1,
      title: 'DASHBOARD',
      link: '/admin/dashboard',
      icon: '📊',
    },
    {
      id: 2,
      title: 'MANAGER USER',
      link: '/admin/manage-user',
      icon: '👥',
    },
    {
      id: 3,
      title: 'MANAGER POST',
      link: '/admin/manage-post',
      icon: '📝',
    },
    {
      id: 4,
      title: 'MANAGER COMMENT',
      link: '/admin/manage-comment',
      icon: '💬',
    },
    {
      id: 5,
      title: 'MANAGER REPORT',
      link: '/admin/manage-report',
      icon: ' 📝',
    },
  ];
}

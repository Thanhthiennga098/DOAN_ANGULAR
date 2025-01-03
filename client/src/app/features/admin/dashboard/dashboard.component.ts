import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit } from '@angular/core';
import {
  getCommentSummary,
  getPostSummary,
  getReportSummary,
  getTotalSumary,
  getUserSummary,
} from '../../../core/service/summayService';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    BaseChartDirective,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalData = [
    {
      id: 1,
      title: '',
      total: 0,
      icon: 'person',
      background: '',
    },
  ];
  typeLoading = 'day';
  lineChartData = {
    datasets: [] as any[],
    labels: [] as string[],
  };
  lineChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
    },
  };
  lineChartType: ChartType = 'line';
  dataLineChart = {} as any;
  ngOnInit() {
    this.loadData();
  }
  loadData = async () => {
    try {
      const response = await getTotalSumary();
      const responseUser = await getUserSummary(this.typeLoading);
      const responseComment = await getCommentSummary(this.typeLoading);
      const responseReport = await getReportSummary(this.typeLoading);
      const responsePost = await getPostSummary(this.typeLoading);
      if (response.data) {
        const { countUser, countPost, countComment, countReport } =
          response.data.data;

        this.totalData = [
          {
            id: 1,
            title: 'Users',
            total: countUser,
            icon: 'person',
            background: '#e0f7fa',
          },
          {
            id: 2,
            title: 'Posts',
            total: countPost,
            icon: 'article',
            background: '#fce4ec',
          },
          {
            id: 3,
            title: 'Comments',
            total: countComment,
            icon: 'comment',
            background: '#e8f5e9',
          },
          {
            id: 4,
            title: 'Reports',
            total: countReport,
            icon: 'report',
            background: '#fff3e0',
          },
        ];
      }

      if (responseUser && responseComment && responsePost) {
        this.dataLineChart = {
          user: responseUser.data.data,
          comment: responseComment.data.data,
          post: responsePost.data.data,
          report: responseReport.data.data,
        };

        const labels = this.dataLineChart.user.map((entry: any) => entry.time);

        this.lineChartData = {
          labels: labels,
          datasets: [
            {
              label: 'Users',
              data: this.dataLineChart.user.map((entry: any) => entry.count),
              borderColor: '#42A5F5',
              backgroundColor: 'rgba(66,165,245,0.2)',
            },
            {
              label: 'Comments',
              data: this.dataLineChart.comment.map((entry: any) => entry.count),
              borderColor: '#66BB6A',
              backgroundColor: 'rgba(102,187,106,0.2)',
            },
            {
              label: 'Posts',
              data: this.dataLineChart.post.map((entry: any) => entry.count),
              borderColor: '#FFA726',
              backgroundColor: 'rgba(255,167,38,0.2)',
            },
            {
              label: 'Reports',
              data: this.dataLineChart.report.map((entry: any) => entry.count),
              borderColor: '#ff0f0f',
              backgroundColor: 'rgba(201,31,31,0.2)',
            },
          ],
        };
      }
    } catch (error) {
      console.error('Error loading summary data:', error);
    }
  };
  onTypeChange(selectedValue: string): void {
    this.typeLoading = selectedValue;
    this.loadData();
  }
}

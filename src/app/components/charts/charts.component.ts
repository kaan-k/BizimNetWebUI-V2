import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table'; 
import { CommonModule } from '@angular/common';
import { DutyComponentService } from '../../services/component/duty-component.service';
import { Duty } from '../../models/duties/duty';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [ChartModule, TableModule, CommonModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent implements OnInit {
    
    // Charts Data
    pieData: any;
    userContributionData: any; 
    upcomingDeadlineData: any; // Now holds Service vs Task Count
    bottleneckData: any; 
    weeklyTrendData: any; 
    
    // Options
    doughnutOptions: any;
    pieOptions: any;
    barOptions: any;
    // We will reuse the forecastOptions structure for the vertical bar chart
    forecastOptions: any; 
    lineOptions: any;

    // Real Data & Stats
    duties: Duty[] = [];
    totalCount = 0;
    completedCount = 0;
    activeCount = 0;

    constructor(private dutyService: DutyComponentService) {}

    async ngOnInit() {
        await this.loadData();
        this.processUserContribution(this.duties);
        this.processTopBottlenecks(this.duties); 
        this.processServiceVsTaskBreakdown(this.duties); // NEW CRUCIAL METRIC
        this.processWeeklyTrend(this.duties);
        this.initCharts(); 
    }

    async loadData() {
        this.duties = await this.dutyService.getAllDuty();

        // FIX: Sort the array descending by creation date (newest first)
        this.duties.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA; 
        });

        this.totalCount = this.duties.length;
        this.completedCount = this.duties.filter(d => d.status === 'Tamamlandı').length;
        this.activeCount = this.totalCount - this.completedCount;
    }

    processUserContribution(duties: Duty[]) {
        const contributionMap = new Map<string, number>();
        
        duties.forEach(duty => {
            if (duty.status === 'Tamamlandı' && duty.assignedEmployeeId) {
                const name = duty.assignedToName || duty.assignedEmployeeId.substring(0, 10); 
                contributionMap.set(name, (contributionMap.get(name) || 0) + 1);
            }
        });

        const labels = Array.from(contributionMap.keys());
        const data = labels.map(label => contributionMap.get(label));
        const colorPalette = [
            '#26a69a', '#42a5f5', '#ef4444', '#ff9800', '#673ab7', '#38ef7d', '#00bcd4', '#203b46'
        ];
        const backgroundColors = labels.map((_, index) => colorPalette[index % colorPalette.length]);

        this.userContributionData = {
            labels: labels,
            datasets: [{ data: data, backgroundColor: backgroundColors, hoverBackgroundColor: backgroundColors, borderWidth: 0 }]
        };
    }
    
    // NEW CRUCIAL METRIC: Service vs Task Breakdown
    processServiceVsTaskBreakdown(duties: Duty[]) {
        let serviceCount = 0;
        let taskCount = 0;

        duties.forEach(d => {
            if (d.signatureBase64 && d.signatureBase64.length > 0) {
                serviceCount++;
            } else {
                taskCount++;
            }
        });

        this.upcomingDeadlineData = { // Stored in the forecast slot
            labels: ['Servis (İmzalı)', 'Görev (İmzasız)'],
            datasets: [{
                label: 'Belge Sayısı',
                backgroundColor: ['#42a5f5', '#203b46'], // Blue for Service, Dark Teal for Task
                data: [serviceCount, taskCount]
            }]
        };
    }

    processTopBottlenecks(duties: Duty[]) {
        const validDuties = duties.filter(d => d.customerId);
        
        const customerCounts = validDuties.reduce((acc, duty) => {
            const customer = duty.customerId; 
            acc[customer] = (acc[customer] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const countsArray = Object.keys(customerCounts).map(customer => {
            return { customer, count: customerCounts[customer] };
        });

        const top5 = countsArray
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        this.bottleneckData = {
            labels: top5.map(d => d.customer),
            datasets: [{
                label: 'Toplam Görev Sayısı',
                backgroundColor: '#f59e0b',
                data: top5.map(d => d.count)
            }]
        };
    }
    
    processWeeklyTrend(duties: Duty[]) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const completionByDay = new Map<string, number>();
        for (let i = 13; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            completionByDay.set(d.toISOString().substring(0, 10), 0);
        }

        duties.forEach(duty => {
            if (duty.status === 'Tamamlandı' && duty.completedAt) {
                const completedDate = new Date(duty.completedAt);
                const dateKey = completedDate.toISOString().substring(0, 10);
                
                if (completionByDay.has(dateKey)) {
                    completionByDay.set(dateKey, completionByDay.get(dateKey)! + 1);
                }
            }
        });

        const labels = Array.from(completionByDay.keys()).map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
        });
        const data = Array.from(completionByDay.values());

        this.weeklyTrendData = {
            labels: labels,
            datasets: [{
                label: 'Tamamlanan Görev Sayısı',
                data: data,
                fill: true,
                borderColor: '#26a69a',
                tension: 0.4,
                backgroundColor: 'rgba(38, 166, 154, 0.2)'
            }]
        };
    }

    initCharts() {
        const textColor = '#1e293b';
        const textColorSecondary = '#64748b';
        const surfaceBorder = '#e2e8f0';

        // 1. DOUGHNUT/PIE OPTIONS (Shared)
        this.doughnutOptions = {
            maintainAspectRatio: false, aspectRatio: 1, 
            plugins: { legend: { position: 'right', labels: { usePointStyle: true, color: textColor } } }
        };
        this.pieOptions = { ...this.doughnutOptions, plugins: { legend: { labels: { usePointStyle: true, color: textColor } } } };

        // 2. BAR CHART OPTIONS (Horizontal Bottlenecks)
        this.barOptions = {
            indexAxis: 'y', maintainAspectRatio: false, aspectRatio: 0.8, 
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    title: { display: true, text: 'Toplam Görev Sayısı', color: textColorSecondary },
                    ticks: { color: textColorSecondary, beginAtZero: true },
                    grid: { color: surfaceBorder }
                },
                y: {
                    ticks: { color: textColorSecondary },
                    grid: { display: false }
                }
            }
        };
        
        // 3. FORECAST CHART OPTIONS (Vertical Bar) - Used for Service vs Task
        this.forecastOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: { legend: { display: false } },
            scales: {
                x: { // Categories on X-axis
                    grid: { display: false },
                    ticks: { color: textColorSecondary }
                },
                y: { // Counts on Y-axis
                    title: { display: true, text: 'Görev Sayısı', color: textColorSecondary },
                    ticks: { color: textColorSecondary, stepSize: 1, beginAtZero: true },
                    grid: { color: surfaceBorder }
                }
            }
        };

        // 4. LINE CHART OPTIONS (Weekly Trend)
        this.lineOptions = {
            maintainAspectRatio: false, aspectRatio: 3, plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: textColorSecondary }, grid: { display: false } },
                y: {
                    title: { display: true, text: 'Görev Sayısı', color: textColorSecondary },
                    ticks: { color: textColorSecondary, stepSize: 1, beginAtZero: true },
                    grid: { color: surfaceBorder }
                }
            }
        };

        // 5. STATUS DISTRIBUTION DATA
        const colorPrimary = '#203b46';
        const colorAccent = '#26a69a';
        this.pieData = {
            labels: ['Tamamlandı', 'Açık'],
            datasets: [{ data: [this.completedCount, this.activeCount], backgroundColor: [colorAccent, colorPrimary], borderWidth: 0 }]
        };
    }
}
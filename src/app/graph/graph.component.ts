import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Getimgservice } from '../services/api/Getimgservice';
import { VoteImg } from '../model/img';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-graph',
    standalone: true,
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss'],
    imports: [HeaderComponent,CommonModule]
})
export class GraphComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef;

  GetImg: VoteImg[] = [];
  isLoading: boolean = true;

  constructor(private getimgservice: Getimgservice ,private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      const user = JSON.parse(localStorage.getItem('user')!);
      if (user) {
        this.GetImg = await this.getimgservice.GetGraph(user[0].userID);
        console.log('GetImg:', this.GetImg);
        this.ngAfterViewInit();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.GetImg && this.GetImg.length > 0) {
        this.createCharts();
      }
    }, 0);
  }  

  createCharts(): void {
    for (const img of this.GetImg) {
      const id = `myChart${img.imageID}`;
      const existingCanvas = document.getElementById(id) as HTMLCanvasElement;
     
      
      if (!existingCanvas) {
        console.error(`Canvas element with id '${id}' not found.`);
        continue;
      }
      const currentDate = new Date();
      const sevenDaysAgo = new Date(currentDate);
      sevenDaysAgo.setDate(currentDate.getDate() - 6);

      const voteDateArray = img.voteDate.split(',');
      const totalScoreArray = img.totalScore.split(',').map(Number);
  
      const labels = this.generateDateLabels(sevenDaysAgo);
      const data = this.generateDataArray(voteDateArray, totalScoreArray, sevenDaysAgo);
  
      new Chart(existingCanvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Scores for each days',
              data: data,
              borderWidth: 2,
              pointRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            title: {
              display: true,
            },
          },
        },
      });
    }
  }
  generateDateLabels(sevenDaysAgo: Date): string[] {
  const labels = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + i);
    labels.push(date.toISOString().split('T')[0]);
  }
  return labels;
}
generateDataArray(voteDateArray: string[], totalScoreArray: number[], sevenDaysAgo: Date): number[] {
  const data = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(sevenDaysAgo);
    currentDate.setDate(sevenDaysAgo.getDate() + i);

    const index = voteDateArray.indexOf(currentDate.toISOString().split('T')[0]);
    if (index !== -1) {
      data.push(totalScoreArray[index]);
    } else {
      data.push(0);
    }
  }

  return data;
}
login() {
  this.router.navigate(['/login']);
}
signup(){
  this.router.navigate(['/login/signup'])
}
}

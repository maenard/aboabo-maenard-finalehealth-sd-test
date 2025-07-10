import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StatsService } from './services/stats.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(
    private titleService: Title,
    private statsService: StatsService
  ) { }

  totalPatients: number = 0
  totalVisits: number = 0
  totalVisitsToday: number = 0

  ngOnInit(): void {
    this.titleService.setTitle('Strongwill Assessment')
    this.statsService.getStats().subscribe({
      next: (res: any) => {
        const {
          totalPatients,
          totalVisits,
          totalVisitsToday,
        } = res
        this.totalPatients = totalPatients
        this.totalVisits = totalVisits
        this.totalVisitsToday = totalVisitsToday
      }
    })
  }

}

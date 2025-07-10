import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl: string = `${environment.apiBaseUrl}/stats`

  constructor(private api: HttpClient) { }

  getStats() {
    return this.api.get(this.apiUrl)
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class VisitService {
  private apiUrl = 'http://localhost:3000/visit'

  constructor(private api: HttpClient) { }

  update(id: string, payload: any) {
    return this.api.put(`${this.apiUrl}/${id}`, payload)
  }

  delete(id: string) {
    return this.api.delete(`${this.apiUrl}/${id}`)
  }

}

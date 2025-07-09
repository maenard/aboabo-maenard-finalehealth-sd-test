import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class VisitService {
  private apiUrl: string = `${environment.apiBaseUrl}/visit`

  constructor(private api: HttpClient) { }

  update(id: string, payload: any) {
    return this.api.put(`${this.apiUrl}/${id}`, payload)
  }

  delete(id: string) {
    return this.api.delete(`${this.apiUrl}/${id}`)
  }

}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class PatientService {
    private url = 'http://localhost:3000/patient'

    constructor(private api: HttpClient) { }

    findAll(query: any = {}) {
        return this.api.get(this.url, { params: query })
    }

    create(payload: any) {
        return this.api.post(this.url, payload)
    }

    update(id: string, payload: any) {
        return this.api.put(`${this.url}/${id}`, payload)
    }

    delete(id: string) {
        return this.api.delete(`${this.url}/${id}`)
    }

    getVisitsPerPatient(patientId: string, query: any = {}) {
        return this.api.get(`${this.url}/${patientId}/visits`, { params: query })
    }

    creatVisitForPatient(patientId: string, payload: any) {
        return this.api.post(`${this.url}/${patientId}/visits`, payload)
    }

}
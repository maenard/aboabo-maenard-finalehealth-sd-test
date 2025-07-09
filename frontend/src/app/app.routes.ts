import { Routes } from '@angular/router';
import { PatientsComponent } from './patients/patients.component';
import { VisitsComponent } from './visits/visits.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'patients', component: PatientsComponent },
    { path: 'patients/:id/visits', component: VisitsComponent }
];

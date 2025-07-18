import { Component, OnInit, inject, TemplateRef } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { PatientService } from './services/patient.service';
import { NgbDatepickerModule, NgbModal, NgbModalRef, NgbDropdownModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { PaginationMeta, PaginationQuery } from '../shared/interfaces/pagination-meta.interface';
import { Title } from '@angular/platform-browser';
import { ToastService } from '../shared/services/toast/toast.service';


@Component({
  selector: 'app-patients',
  imports: [
    DatePipe,
    NgbDatepickerModule,
    ReactiveFormsModule,
    CommonModule,
    NgbDropdownModule,
    PaginationComponent,
    RouterModule
  ],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
})

export class PatientsComponent implements OnInit {
  constructor(private patientService: PatientService, private router: Router, private modalService: NgbModal, private titleService: Title, private toastService: ToastService) { }


  private modalRef!: NgbModalRef

  selectedPt: any = {}
  search = new FormControl('', { nonNullable: true });
  sortBy = new FormControl('dateCreated', { nonNullable: true })
  order = new FormControl('desc', { nonNullable: true })

  patients: any = []
  meta: PaginationMeta = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 5,
    nextPage: null,
    prevPage: null
  }

  query: PaginationQuery = {
    search: '',
    page: 1,
    limit: 5,
    sortBy: 'dateCreated',
    sortOrder: 'desc'
  }

  patientForm!: FormGroup
  loading: boolean = false

  ngOnInit(): void {
    this.titleService.setTitle('Strongwill | Patients')

    this.initForm()

    this.patientGet()

    this.search.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((keyword: string) => {
        this.patientGet({ search: keyword, page: 1 })
      }),
    ).subscribe()

    this.sortBy.valueChanges.subscribe((sortBy) => {
      this.patientGet({ sortBy, page: 1 })
    })

    this.order.valueChanges.subscribe((sortOrder) => {
      this.patientGet({ sortOrder, page: 1 })
    })
  }

  initForm() {
    this.patientForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required)
    })
  }

  open(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(
      content,
      {
        backdrop: 'static',
        keyboard: false
      },
    )
  }

  patientGet(overrides: Partial<PaginationQuery> = {}) {
    this.loading = true

    const query: PaginationQuery = {
      ...this.query,
      ...overrides,
      search: overrides.search ?? this.search.value,
      sortBy: overrides.sortBy ?? this.sortBy.value,
      sortOrder: overrides.sortOrder ?? this.order.value,
      limit: overrides.limit ?? this.meta.perPage,
      page: overrides.page ?? 1,
    }

    this.query = query
    this.patientService.findAll(query).subscribe({
      next: (res: any) => {
        this.patients = res.data
        this.meta = res.meta
      },
      complete: () => {
        this.loading = false
      }
    })
  }

  onPageChange(page: number) {
    this.patientGet({ page })
  }

  onPerPageChange(limit: number) {
    this.patientGet({ limit, page: 1 })
  }

  onSubmit() {
    this.patientForm.markAllAsTouched()
    if (this.selectedPt && Object.keys(this.selectedPt).length > 0) {
      this.patientPut()
    } else {
      this.patientPost()
    }
  }

  patientPost() {
    const payload = this.patientForm.value

    if (this.patientForm.valid) {
      this.loading = true
      this.patientService.create(payload).subscribe({
        next: () => {
          this.toastService.success('Patient addedd successfully!')
        },
        error: () => {
          this.toastService.error('Oops! Something went wrong.')
        },
        complete: () => {
          this.patientForm.reset()
          this.modalRef.close()
          this.loading = false
        }
      })
      this.patientGet({ search: this.search.value })
    }

  }

  confirmDeletion(content: TemplateRef<any>, pt: any) {
    this.selectedPt = pt
    this.open(content)
  }

  patientDelete(id: string) {
    this.loading = true
    this.patientService.delete(id).subscribe({
      next: () => {
        this.toastService.success('Patient deleted successfully!')
      },
      error: () => {
        this.toastService.error('Oops! Something went wrong.')
      },
      complete: () => {
        this.loading = false
        this.selectedPt = {}
        this.modalRef.close()
      }
    })
    this.patientGet({ search: this.search.value })
  }

  viewPatient(pt: any) {
    this.selectedPt = pt
    this.patientForm.setValue({
      firstName: this.selectedPt.firstName,
      lastName: this.selectedPt.lastName,
      dob: pt.dob ? pt.dob.split('T')[0] : '',
      email: this.selectedPt.email,
      phoneNumber: this.selectedPt.phoneNumber,
      address: this.selectedPt.address
    })
  }

  patientPut() {
    if (this.patientForm.valid) {
      this.loading = true
      this.patientService.update(this.selectedPt._id, this.patientForm.value).subscribe({
        next: () => {
          this.toastService.success('Patient updated successfully!')
        },
        error: () => {
          this.toastService.error('Oops! Something went wrong.')
        },
        complete: () => {
          this.selectedPt = {}
          this.patientForm.reset()
          this.loading = false
          this.modalRef.close()
        }
      })
    }

    this.patientGet({ search: this.search.value })
  }

  resetForm() {
    this.patientForm.reset()
    this.selectedPt = {}
  }

  goToVisits(id: string) {
    this.router.navigate(['/patients', id, 'visits'])
  }

}

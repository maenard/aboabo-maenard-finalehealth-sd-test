import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OnInit } from '@angular/core';
import { PatientService } from '../patients/services/patient.service';
import { CommonModule, DatePipe } from '@angular/common';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { PaginationMeta, PaginationQuery } from '../shared/interfaces/pagination-meta.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { VisitService } from './services/visit.service';
import { ToastService } from '../shared/services/toast/toast.service';

@Component({
  selector: 'app-visits',
  imports: [
    DatePipe,
    PaginationComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    RouterModule
  ],
  templateUrl: './visits.component.html',
  styleUrl: './visits.component.css',
})

export class VisitsComponent implements OnInit {

  constructor(
    private patientService: PatientService,
    private activeRoute: ActivatedRoute,
    private visitService: VisitService,
    private modalService: NgbModal,
    private titleService: Title,
    private toastService: ToastService
  ) { }

  private modalRef!: NgbModalRef

  search = new FormControl('', { nonNullable: true })
  sortBy = new FormControl('dateCreated', { nonNullable: true })
  order = new FormControl('desc', { nonNullable: true })
  visitForm!: FormGroup

  selectedVisit: any = {}
  pt: any = {}
  patientId!: string
  visits: any = []
  loading: boolean = false
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

  visitTypes = [
    { label: 'Home', value: 'Home' },
    { label: 'Telehealth', value: 'Telehealth' },
    { label: 'Clinic', value: 'Clinic' }
  ]

  ngOnInit(): void {

    this.initForm()

    this.activeRoute.params.subscribe((value) => {
      const id = value['id']
      if (id) {
        this.patientId = id
        this.visitsGet(id)
      }
    })

    this.search.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((keyword: string) => {
        this.visitsGet(this.patientId, { search: keyword, page: 1 })
      }),
    ).subscribe()

    this.sortBy.valueChanges.subscribe((sortBy) => {
      this.visitsGet(this.patientId, { sortBy, page: 1 })
    })

    this.order.valueChanges.subscribe((sortOrder) => {
      this.visitsGet(this.patientId, { sortOrder, page: 1 })
    })

  }

  initForm() {
    this.visitForm = new FormGroup({
      visitType: new FormControl('', Validators.required),
      notes: new FormControl(''),
      visitDate: new FormControl('', Validators.required)
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

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  onSubmit() {
    this.visitForm.markAllAsTouched()
    if (this.visitForm.valid) {
      if (this.visitForm.valid && Object.keys(this.selectedVisit).length > 0) {
        this.visitPut()
      } else {
        this.visitPost(this.visitForm.value)
      }
    }
  }

  visitsGet(id: string, overrides: Partial<PaginationQuery> = {}) {
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

    this.patientService.getVisitsPerPatient(id, query).subscribe({
      next: (res: any) => {
        this.pt = res.data.patient
        const patientName = this.pt.firstName + " " + this.pt.lastName
        this.titleService.setTitle(patientName + " | Visits")
        this.visits = res.data.visits
        this.meta = res.meta
      },
      complete: () => {
        this.loading = false
      }
    })
  }

  visitPost(payload: any) {
    this.loading = true

    this.patientService.creatVisitForPatient(this.patientId, payload).subscribe({
      next: () => {
        this.resetForm()
        this.toastService.success('Visit created successfully!')
      },
      error: () => {
        this.toastService.error('Oops! Something went wrong.')
      },
      complete: () => {
        this.modalRef.close()
        this.loading = false
        this.visitsGet(this.patientId)
      }
    })
  }

  visitDelete(id: string): void {
    this.loading = true
    this.visitService.delete(id).subscribe({
      next: () => {
        this.toastService.success('Patient deleted successfully!')
      },
      error: () => {
        this.toastService.error('Oops! Something went wrong.')
      },
      complete: () => {
        this.loading = false
        this.selectedVisit = {}
        this.modalRef.close()
      }
    })

    this.visitsGet(this.patientId, { search: this.search.value })
  }

  visitPut(): void {
    this.loading = true
    this.visitService.update(this.selectedVisit._id, this.visitForm.value).subscribe({
      next: () => {
        this.toastService.success('Patient updated successfully!')
      },
      error: () => {
        this.toastService.error('Oops! Something went wrong.')
      },
      complete: () => {
        this.selectedVisit = {}
        this.resetForm()
        this.loading = false
        this.modalRef.close()
      }
    })
    this.visitsGet(this.patientId, { search: this.search.value })

  }

  viewVisit(visit: any): void {
    this.selectedVisit = visit
    this.visitForm.setValue({
      visitType: this.selectedVisit.visitType,
      visitDate: this.selectedVisit.visitDate ? this.selectedVisit.visitDate.split('T')[0] : '',
      notes: this.selectedVisit.notes
    })

  }

  confirmDeletion(content: TemplateRef<any>, visit: any): void {
    this.selectedVisit = visit
    this.open(content)
  }

  onPageChange(page: number) {
    this.visitsGet(this.patientId, { page })
  }

  onPerPageChange(limit: number) {
    this.visitsGet(this.patientId, { limit, page: 1 })
  }

  resetForm() {
    this.visitForm.reset()
  }

}

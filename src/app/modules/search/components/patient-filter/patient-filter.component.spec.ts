/**
 * Copyright 2021 Vitagroup AG
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { LayoutModule } from '@angular/cdk/layout'
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { HttpErrorResponse } from '@angular/common/http'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateModule } from '@ngx-translate/core'
import { of, Subject, throwError } from 'rxjs'
import { PatientFilterService } from 'src/app/core/services/patient-filter/patient-filter.service'
import { IDetermineHits } from 'src/app/shared/components/editor-determine-hits/determine-hits.interface'
import { AqlUiModel } from 'src/app/shared/models/aql/aql-ui.model'
import { CohortGroupUiModel } from 'src/app/shared/models/project/cohort-group-ui.model'
import { ProjectUiModel } from 'src/app/shared/models/project/project-ui.model'
import { SharedModule } from 'src/app/shared/shared.module'
import { mockAqlCohort } from 'src/mocks/data-mocks/aqls.mock'
import { mockCohortPreviewData } from 'src/mocks/data-mocks/cohort-graph.mock'
import { PatientCountInfoComponent } from '../patient-count-info/patient-count-info.component'
import { PatientCountInfoHarness } from '../patient-count-info/testing/patient-count-info.harness'
import { PatientFilterComponent } from './patient-filter.component'

describe('PatientFilterComponent', () => {
  let component: PatientFilterComponent
  let fixture: ComponentFixture<PatientFilterComponent>
  let loader: HarnessLoader

  const mockDataSetSubject$ = new Subject<number>()
  const mockPreviewDataSubject$ = new Subject<string>()
  const mockPatientFilterService = ({
    getAllDatasetCount: jest.fn(),
    getPreviewData: jest.fn(),
    previewDataObservable$: mockPreviewDataSubject$.asObservable(),
    totalDatasetCountObservable: mockDataSetSubject$.asObservable(),
  } as unknown) as PatientFilterService

  @Component({
    selector: 'num-cohort-builder',
    template: '<div></div>',
  })
  class CohortBuilderComponentStub {
    @Input() cohortNode: CohortGroupUiModel
    @Input() isLoadingComplete: boolean
    @Input() raised: boolean
  }

  @Component({
    selector: 'num-cohort-graphs',
    template: '<div></div>',
  })
  class CohortGraphsComponentStub {
    @Input() previewData: string
    @Input() determineHits: IDetermineHits
    @Output() determine = new EventEmitter<void>()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CohortBuilderComponentStub,
        CohortGraphsComponentStub,
        PatientCountInfoComponent,
        PatientFilterComponent,
      ],
      imports: [LayoutModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: PatientFilterService,
          useValue: mockPatientFilterService,
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    jest.spyOn(mockPatientFilterService, 'getAllDatasetCount').mockImplementation(() => of(123))
    jest.clearAllMocks()
    fixture = TestBed.createComponent(PatientFilterComponent)
    component = fixture.componentInstance
    loader = TestbedHarnessEnvironment.loader(fixture)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('Patient data set count', () => {
    let patientCountInfo: PatientCountInfoHarness
    beforeEach(async () => {
      patientCountInfo = await loader.getHarness(PatientCountInfoHarness)
    })

    it('should call getAllDatasets on first load', () => {
      expect(mockPatientFilterService.getAllDatasetCount).toHaveBeenCalledTimes(1)
    })

    it('should provide the dataset count to patient info component', async () => {
      expect(await patientCountInfo.getCountText()).toEqual('SEARCH.PATIENT_COUNT_INFO')
    })
  })

  describe('When determine hits has been clicked', () => {
    let cohort: CohortGroupUiModel
    let project: ProjectUiModel
    beforeEach(() => {
      project = new ProjectUiModel()
      cohort = new CohortGroupUiModel()
      cohort.children.push(
        new AqlUiModel(mockAqlCohort, false, {
          $bodyHeight: 'testHeight',
          $bodyWeight: 'testWeight',
        })
      )
      project.cohortGroup = cohort
      component.project = project
      fixture.detectChanges()
    })

    it('should set loading status if no cohortNode has been provided', async () => {
      component.project.cohortGroup = undefined
      await component.getPreviewData()
      expect(component.determineHits.isLoading).toBe(false)
    })

    it('gets the cohort size from service', async () => {
      jest
        .spyOn(mockPatientFilterService, 'getPreviewData')
        .mockImplementation(() => of(mockCohortPreviewData))
      await component.getPreviewData()
      expect(mockPatientFilterService.getPreviewData).toHaveBeenCalledTimes(1)
      expect(component.determineHits.count).toEqual(mockCohortPreviewData.count)
    })

    it('should show an error for to few hits', async () => {
      jest
        .spyOn(mockPatientFilterService, 'getPreviewData')
        .mockImplementation(() => throwError(new HttpErrorResponse({ status: 451 })))

      await component.getPreviewData()
      expect(component.determineHits.message).toEqual('PROJECT.HITS.MESSAGE_ERROR_FEW_HITS')
    })

    it('should show a general error message for unknown errors', async () => {
      jest
        .spyOn(mockPatientFilterService, 'getPreviewData')
        .mockImplementation(() => throwError(new HttpErrorResponse({ status: 500 })))
      await component.getPreviewData()
      expect(component.determineHits.message).toEqual('PROJECT.HITS.MESSAGE_ERROR_MESSAGE')
    })

    it('should call the service to get preview data from api', async () => {
      jest
        .spyOn(mockPatientFilterService, 'getPreviewData')
        .mockImplementation(() => of(mockCohortPreviewData))

      await component.getPreviewData()
      const cohortGroupApi = component.cohortNode.convertToApi()
      expect(mockPatientFilterService.getPreviewData).toHaveBeenCalledWith(cohortGroupApi, false)
    })
  })
})

import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing'
import { TranslateModule } from '@ngx-translate/core'
import { BehaviorSubject, of, Subject } from 'rxjs'
import { AdminService } from 'src/app/core/services/admin/admin.service'
import { CohortService } from 'src/app/core/services/cohort/cohort.service'
import { DialogService } from 'src/app/core/services/dialog/dialog.service'
import { PhenotypeService } from 'src/app/core/services/phenotype/phenotype.service'
import { StudyService } from 'src/app/core/services/study/study.service'
import { MaterialModule } from 'src/app/layout/material/material.module'
import { ButtonComponent } from 'src/app/shared/components/button/button.component'
import { IDetermineHits } from 'src/app/shared/components/editor-determine-hits/determineHits.interface'
import { IDefinitionList } from 'src/app/shared/models/definition-list.interface'
import { PossibleStudyEditorMode } from 'src/app/shared/models/study/possible-study-editor-mode.enum'
import { StudyStatus } from 'src/app/shared/models/study/study-status.enum'
import { StudyUiModel } from 'src/app/shared/models/study/study-ui.model'
import { mockUsers } from 'src/mocks/data-mocks/admin.mock'
import { mockCohort1 } from 'src/mocks/data-mocks/cohorts.mock'
import { mockStudy1 } from 'src/mocks/data-mocks/studies.mock'
import { studyCommentMock1, studyCommentMocks } from 'src/mocks/data-mocks/study-comments.mock'
import { ApprovalOption } from '../../models/approval-option.enum'
import { IStudyResolved } from '../../models/study-resolved.interface'
import { APPROVE_STUDY_DIALOG_CONFIG } from './constants'

import { StudyEditorComponent } from './study-editor.component'

describe('StudyEditorComponent', () => {
  let component: StudyEditorComponent
  let fixture: ComponentFixture<StudyEditorComponent>
  let router: Router

  const studyService = ({
    create: jest.fn(),
    update: jest.fn(),
    getCommentsByStudyId: jest.fn(),
    createCommentByStudyId: jest.fn(),
    updateStatusById: jest.fn(),
  } as unknown) as StudyService

  const cohortService = ({
    create: jest.fn(),
    update: jest.fn(),
    get: jest.fn(),
  } as unknown) as CohortService

  const adminService = ({
    getUsersByIds: jest.fn(),
  } as unknown) as AdminService

  const phenotypeService = ({
    get: jest.fn().mockImplementation(() => of()),
  } as unknown) as PhenotypeService

  const afterClosedSubject$ = new Subject()
  const mockDialogService = ({
    openDialog: jest.fn().mockImplementation((_: any) => {
      return {
        afterClosed: () => afterClosedSubject$.asObservable(),
      }
    }),
  } as unknown) as DialogService

  const resolvedData: IStudyResolved = {
    study: new StudyUiModel(mockStudy1, phenotypeService),
    error: null,
  }

  const queryParamsSubject$ = new BehaviorSubject<Params>({})
  const route = ({
    snapshot: {
      data: {
        resolvedData,
      },
    },
    queryParams: queryParamsSubject$.asObservable(),
  } as unknown) as ActivatedRoute

  @Component({ selector: 'num-study-editor-general-info', template: '' })
  class StubGeneralInfoComponent {
    @Input() form: any
    @Input() isDisabled: boolean
    @Input() generalInfoData: IDefinitionList[]
  }

  @Component({ selector: 'num-study-editor-connector', template: '' })
  class StubStudyEditorConnector {
    @Input() cohortNode: any
    @Input() isLoadingComplete: boolean
    @Input() isDisabled: boolean
    @Input() determineHitsContent: IDetermineHits
    @Output() determineHitsClicked = new EventEmitter()
  }
  @Component({ selector: 'num-study-editor-researchers', template: '' })
  class StudyEditorResearchers {
    @Input() researchers: any[]
    @Input() isDisabled: boolean
    @Input() isLoadingComplete: boolean
  }

  @Component({ selector: 'num-study-editor-templates', template: '' })
  class StudyEditorTemplatesStubComponent {
    @Input() templates: any
    @Input() isDisabled: boolean
  }

  const postCommentEmitter = new EventEmitter()
  @Component({ selector: 'num-study-editor-comments', template: '' })
  class StudyEditorCommentsStubComponent {
    @Input() isLoadingComplete: any
    @Input() comments: any[]
    @Input() form: any
    @Output() postComment = postCommentEmitter
  }

  @Component({ selector: 'num-study-editor-approval', template: '' })
  class StudyEditorApprovalStubComponent {
    @Input() form: any
  }

  const saveAllEmitter = new EventEmitter()
  const saveResearchersEmitter = new EventEmitter()
  const saveAsApprovalRequestEmitter = new EventEmitter()
  const saveAsApprovalReplyEmitter = new EventEmitter()
  const startEditEmitter = new EventEmitter()
  const cancelEmitter = new EventEmitter()
  @Component({ selector: 'num-study-editor-buttons', template: '' })
  class StudyEditorButtonsStubComponent {
    @Input() editorMode: any
    @Input() studyStatus: any
    @Input() isFormValid: any
    @Input() isResearchersDefined: any
    @Input() isTemplatesDefined: any
    @Input() isCohortDefined: any
    @Input() approverForm: any

    @Output() saveAll = saveAllEmitter
    @Output() saveResearchers = saveResearchersEmitter
    @Output() saveAsApprovalRequest = saveAsApprovalRequestEmitter
    @Output() saveAsApprovalReply = saveAsApprovalReplyEmitter
    @Output() startEdit = startEditEmitter
    @Output() cancel = cancelEmitter
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StudyEditorComponent,
        StubGeneralInfoComponent,
        StubStudyEditorConnector,
        StudyEditorResearchers,
        ButtonComponent,
        StudyEditorTemplatesStubComponent,
        StudyEditorButtonsStubComponent,
        StudyEditorCommentsStubComponent,
        StudyEditorApprovalStubComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
        FontAwesomeTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: route,
        },
        {
          provide: StudyService,
          useValue: studyService,
        },
        {
          provide: CohortService,
          useValue: cohortService,
        },
        {
          provide: AdminService,
          useValue: adminService,
        },
        {
          provide: DialogService,
          useValue: mockDialogService,
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    router = TestBed.inject(Router)
    jest.restoreAllMocks()
    jest.clearAllMocks()
    jest.spyOn(router, 'navigate').mockImplementation()
    jest.spyOn(cohortService, 'get').mockImplementation(() => of(mockCohort1))
    jest.spyOn(cohortService, 'update').mockImplementation(() => of(mockCohort1))
    jest.spyOn(adminService, 'getUsersByIds').mockImplementation(() => of(mockUsers))
    jest.spyOn(studyService, 'getCommentsByStudyId').mockImplementation(() => of(studyCommentMocks))
    jest.spyOn(studyService, 'update').mockImplementation(() => of(mockStudy1))
    jest.spyOn(studyService, 'updateStatusById').mockImplementation(() => of(mockStudy1))
  })

  describe('When the components gets initialized and the cohortId is not specified', () => {
    test.each([null, undefined])('should flag the cohorts as fetched', (cohortId) => {
      const cohortIdBackup = resolvedData.study.cohortId
      resolvedData.study.cohortId = cohortId
      fixture = TestBed.createComponent(StudyEditorComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
      expect(component.isCohortsFetched).toBeTruthy()
      resolvedData.study.cohortId = cohortIdBackup
    })
  })

  describe('When the components gets initialized and the researchers are not specified', () => {
    it('should flag the researchers as fetched', () => {
      resolvedData.study.researchersApi = []
      fixture = TestBed.createComponent(StudyEditorComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
      expect(component.isResearchersFetched).toBeTruthy()
    })
  })

  describe('When the components gets initialized and the cohortId is specified', () => {
    it('should call the cohortService to get the cohort and flag the cohort as fetched', async (done) => {
      fixture = TestBed.createComponent(StudyEditorComponent)
      component = fixture.componentInstance

      fixture.detectChanges()
      component.resolvedData.study = new StudyUiModel(mockStudy1, phenotypeService)
      expect(cohortService.get).toHaveBeenLastCalledWith(mockStudy1.cohortId)

      fixture.whenStable().then(() => {
        expect(component.isCohortsFetched).toBeTruthy()
        done()
      })
    })
  })

  describe('When the components gets initialized and the researchers are specified', () => {
    it('should call the adminService to get the researchers and flag the researchers as fetched', async (done) => {
      const users = [{ userId: 'abc-1' }, { userId: 'abc-2' }]
      resolvedData.study.researchersApi = users
      fixture = TestBed.createComponent(StudyEditorComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
      expect(adminService.getUsersByIds).toHaveBeenLastCalledWith([
        ...users.map((user) => user.userId),
      ])

      fixture.whenStable().then(() => {
        expect(component.isResearchersFetched).toBeTruthy()
        done()
      })
    })
  })

  describe('When the components gets initialized and the studyId is specified', () => {
    it('should call the study service to fetch related comments and flag comments as fetched', async (done) => {
      resolvedData.study.id = 1
      fixture = TestBed.createComponent(StudyEditorComponent)
      component = fixture.componentInstance
      fixture.detectChanges()

      expect(studyService.getCommentsByStudyId).toHaveBeenCalledWith(1)
      fixture.whenStable().then(() => {
        expect(component.isCommentsFetched).toBeTruthy()
        expect(component.studyComments).toEqual(studyCommentMocks)
        done()
      })
    })
  })

  describe('When the comment component emits the event to post a comment', () => {
    beforeEach(() => {
      resolvedData.study.id = 1
      fixture = TestBed.createComponent(StudyEditorComponent)
      component = fixture.componentInstance
      fixture.detectChanges()

      jest
        .spyOn(studyService, 'createCommentByStudyId')
        .mockImplementation(() => of(studyCommentMock1))

      component.commentForm.patchValue({ text: 'Test 123' })
    })
    it('should call the study service to create the comment', () => {
      postCommentEmitter.emit()
      expect(studyService.createCommentByStudyId).toHaveBeenCalledWith(1, 'Test 123')
    })

    it('should reset the form after posting', () => {
      expect(component.commentForm.value.text).not.toEqual(null)
      postCommentEmitter.emit()
      expect(component.commentForm.value.text).toEqual(null)
    })
  })

  describe('When the buttons component emits to saveAll', () => {
    beforeEach(() => {
      resolvedData.study.id = 1
      fixture = TestBed.createComponent(StudyEditorComponent)
      component = fixture.componentInstance

      fixture.detectChanges()
      saveAllEmitter.emit('')
    })

    it('should update the study if its an existing study', () => {
      expect(studyService.update).toHaveBeenCalledTimes(1)
    })
    it('should update the cohort if its an existing cohort', () => {
      expect(cohortService.update).toHaveBeenCalledTimes(1)
    })
  })

  describe('When the buttons component emits to saveResearchers', () => {
    it('should update the study if its an existing study', () => {
      resolvedData.study.id = 1
      fixture = TestBed.createComponent(StudyEditorComponent)
      component = fixture.componentInstance
      jest.spyOn(component, 'save')

      fixture.detectChanges()
      saveResearchersEmitter.emit()
      expect(component.save).toHaveBeenCalledTimes(1)
    })
  })

  describe('When the buttons component emits to startEdit', () => {
    it('should navigate to the editor with the study id and edit mode', () => {
      resolvedData.study.id = 1
      fixture = TestBed.createComponent(StudyEditorComponent)
      component = fixture.componentInstance

      fixture.detectChanges()
      startEditEmitter.emit()

      const queryParams = { mode: PossibleStudyEditorMode.EDIT.toString().toLowerCase() }

      expect(router.navigate).toHaveBeenCalledWith(['studies', resolvedData.study.id, 'editor'], {
        queryParams,
      })
    })
  })

  describe('When the buttons component emits to cancel', () => {
    it('should navigate back to the studies overview', () => {
      resolvedData.study.id = 1
      fixture = TestBed.createComponent(StudyEditorComponent)
      component = fixture.componentInstance

      fixture.detectChanges()
      cancelEmitter.emit()
      expect(router.navigate).toHaveBeenCalledWith(['studies'])
    })
  })

  describe('When the buttons component emits to save as approval reply', () => {
    beforeEach(() => {
      resolvedData.study.id = 1
      fixture = TestBed.createComponent(StudyEditorComponent)
      component = fixture.componentInstance

      fixture.detectChanges()
    })

    const testCases = [
      {
        decision: ApprovalOption.Approve,
        newState: StudyStatus.Approved,
      },
      {
        decision: ApprovalOption.ChangeRequest,
        newState: StudyStatus.ChangeRequest,
      },
      {
        decision: ApprovalOption.Deny,
        newState: StudyStatus.Denied,
      },
    ]

    test.each(testCases)(
      'should call the study service with the new state and navigate to overview',
      (testCase) => {
        component.approverForm = new FormGroup({
          decision: new FormControl(testCase.decision, Validators.required),
        })
        saveAsApprovalReplyEmitter.emit()
        if (testCase.decision === ApprovalOption.Approve) {
          afterClosedSubject$.next(true)
        }
        expect(studyService.updateStatusById).toHaveBeenCalledWith(1, testCase.newState)
        expect(router.navigate).toHaveBeenCalledWith(['/studies'])
      }
    )

    it('should open the dialog to confirm the approval on approval decision and do nothing on cancel', () => {
      component.approverForm = new FormGroup({
        decision: new FormControl(ApprovalOption.Approve, Validators.required),
      })
      saveAsApprovalReplyEmitter.emit()
      expect(mockDialogService.openDialog).toHaveBeenCalledWith(APPROVE_STUDY_DIALOG_CONFIG)
      afterClosedSubject$.next(false)
      expect(studyService.updateStatusById).not.toHaveBeenCalledWith(1, StudyStatus.Approved)
      expect(router.navigate).not.toHaveBeenCalledWith(['/studies'])
    })
  })
})

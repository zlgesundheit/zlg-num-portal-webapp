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

import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing'
import { TranslateModule } from '@ngx-translate/core'
import { MaterialModule } from 'src/app/layout/material/material.module'
import { CohortGroupUiModel } from 'src/app/shared/models/project/cohort-group-ui.model'

import { ProjectEditorCohortBuilderComponent } from './project-editor-cohort-builder.component'

describe('ProjectEditorCohortBuilderComponent', () => {
  let component: ProjectEditorCohortBuilderComponent
  let fixture: ComponentFixture<ProjectEditorCohortBuilderComponent>

  @Component({ selector: 'num-cohort-builder', template: '' })
  class StubCohortBuilderComponent {
    @Input() cohortNode: CohortGroupUiModel
    @Input() isDisabled: boolean
    @Input() isLoadingComplete: boolean
    @Input() raised: boolean
  }

  @Component({ selector: 'num-editor-determine-hits', template: '' })
  class StubEditorDetermineHitsComponent {
    @Input() isButtonDisabled: boolean
    @Input() content: any
    @Output() clicked = new EventEmitter()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProjectEditorCohortBuilderComponent,
        StubCohortBuilderComponent,
        StubEditorDetermineHitsComponent,
      ],
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        FontAwesomeTestingModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEditorCohortBuilderComponent)
    component = fixture.componentInstance

    component.cohortNode = new CohortGroupUiModel()
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

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
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { Subject } from 'rxjs'
import { DialogService } from 'src/app/core/services/dialog/dialog.service'
import { LayoutModule } from 'src/app/layout/layout.module'
import { ADD_DIALOG_CONFIG } from 'src/app/modules/projects/components/project-editor-templates/constants'
import { DialogConfig } from 'src/app/shared/models/dialog/dialog-config.interface'
import { IProjectTemplateInfoApi } from 'src/app/shared/models/project/project-template-info-api.interface'
import { ProjectUiModel } from 'src/app/shared/models/project/project-ui.model'
import { ITemplateMetaDataApi } from 'src/app/shared/models/template/template-api.interface'
import { SharedModule } from 'src/app/shared/shared.module'

import { DataFilterTemplatesComponent } from './data-filter-templates.component'

describe('DataFilterTemplatesComponent', () => {
  let component: DataFilterTemplatesComponent
  let fixture: ComponentFixture<DataFilterTemplatesComponent>

  const afterClosedSubject$ = new Subject<IProjectTemplateInfoApi[] | undefined>()
  const mockDialogService = {
    openDialog: jest.fn().mockImplementation((_: any) => {
      return {
        afterClosed: () => afterClosedSubject$.asObservable(),
      }
    }),
  } as unknown as DialogService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataFilterTemplatesComponent],
      imports: [
        BrowserAnimationsModule,
        FontAwesomeModule,
        LayoutModule,
        SharedModule,
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: DialogService, useValue: mockDialogService }],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFilterTemplatesComponent)
    component = fixture.componentInstance
    component.project = new ProjectUiModel()

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

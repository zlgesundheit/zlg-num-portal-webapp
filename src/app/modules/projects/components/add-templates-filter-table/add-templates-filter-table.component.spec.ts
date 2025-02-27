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

import { AddTemplatesFilterTableComponent } from './add-templates-filter-table.component'
import { mockTemplate1 } from '../../../../../mocks/data-mocks/templates.mock'
import { of, Subject } from 'rxjs'
import { ITemplateMetaDataApi } from '../../../../shared/models/template/template-api.interface'
import { TemplateService } from '../../../../core/services/template/template.service'
import { MaterialModule } from '../../../../layout/material/material.module'
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing'
import { TranslateModule } from '@ngx-translate/core'
import { IProjectTemplateInfoApi } from '../../../../shared/models/project/project-template-info-api.interface'
import { SimpleChange } from '@angular/core'

describe('AddTemplatesFilterTableComponent', () => {
  let component: AddTemplatesFilterTableComponent
  let fixture: ComponentFixture<AddTemplatesFilterTableComponent>

  const filteredTemplatesSubject$ = new Subject<ITemplateMetaDataApi[]>()
  const templateService = {
    filteredTemplatesObservable$: filteredTemplatesSubject$.asObservable(),
    getAll: () => of(),
  } as TemplateService

  const templateRow: ITemplateMetaDataApi = {
    templateId: '123',
    archetypeId: '123',
    createdOn: '2020-12-07T21:19:18.980Z',
    name: 'Template test',
  }

  const projectTemplate: IProjectTemplateInfoApi = {
    templateId: templateRow.templateId,
    name: templateRow.name,
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTemplatesFilterTableComponent],
      imports: [MaterialModule, FontAwesomeTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: TemplateService,
          useValue: templateService,
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTemplatesFilterTableComponent)
    component = fixture.componentInstance
    component.selectedTemplates = []
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('When new filtered template are received', () => {
    it('should set them as data in the dataSource', () => {
      filteredTemplatesSubject$.next([mockTemplate1])
      expect(component.dataSource.data).toEqual([mockTemplate1])
    })
  })

  describe('When the selected templates passed in are changed', () => {
    it('should set up the selected templates lookup', () => {
      component.selectedTemplates = [projectTemplate]
      const change = new SimpleChange([], component.selectedTemplates, false)
      component.ngOnChanges({ selectedTemplates: change })
      fixture.detectChanges()
      expect(component.lookupSelectedTemplates[123]).toEqual(true)
    })
  })
})

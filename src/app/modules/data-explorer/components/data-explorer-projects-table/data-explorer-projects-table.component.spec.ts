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

import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { Pipe, PipeTransform } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatSortHeaderHarness } from '@angular/material/sort/testing'
import { MatTableHarness } from '@angular/material/table/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing'
import { TranslateModule } from '@ngx-translate/core'
import { maxBy, minBy } from 'lodash-es'
import { of, Subject } from 'rxjs'
import { ProjectService } from 'src/app/core/services/project/project.service'
import { MaterialModule } from 'src/app/layout/material/material.module'
import { IProjectApi } from 'src/app/shared/models/project/project-api.interface'
import { PipesModule } from 'src/app/shared/pipes/pipes.module'
import { mockProject3, mockProjectsForSort } from 'src/mocks/data-mocks/project.mock'

import { DataExplorerProjectsTableComponent } from './data-explorer-projects-table.component'
import { MatSort } from '@angular/material/sort'

describe('DataExplorerProjectsTableComponent', () => {
  let component: DataExplorerProjectsTableComponent
  let fixture: ComponentFixture<DataExplorerProjectsTableComponent>
  let router: Router

  @Pipe({ name: 'localizedDate' })
  class MockLocalizedDatePipe implements PipeTransform {
    transform(value: number): number {
      return value
    }
  }

  const myPublishedProjectsSubject$ = new Subject<IProjectApi[]>()
  const projectService = {
    myPublishedProjectsObservable$: myPublishedProjectsSubject$.asObservable(),
    getAllPag: () => of(),
  } as unknown as ProjectService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataExplorerProjectsTableComponent, MockLocalizedDatePipe],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        PipesModule,
        FontAwesomeTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        {
          provide: ProjectService,
          useValue: projectService,
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    router = TestBed.inject(Router)
    fixture = TestBed.createComponent(DataExplorerProjectsTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('When a project is selected', () => {
    beforeEach(() => {
      jest.spyOn(router, 'navigate').mockImplementation()
    })
    it('should navigate to the data explorer project detail page', () => {
      const projectId = 1
      component.handleSelectClick(projectId)
      expect(router.navigate).toHaveBeenCalledWith(['data-explorer/projects', projectId])
    })
  })

  describe('When pagination is triggered', () => {
    it('should fetch next page', () => {
      jest.spyOn(projectService, 'getAllPag').mockReturnValue(of({}))
      const params = {
        pageIndex: 1,
        pageSize: 10,
      }
      component.onPageChange(params)
    })
  })

  describe('When sorting is triggered', () => {
    it('should fetch sorting page', () => {
      jest.spyOn(projectService, 'getAllPag').mockReturnValue(of({}))
      const sort = new MatSort()
      sort.active = 'name'
      sort.direction = 'asc'
      component.handleSortChangeTable(sort)
    })
  })
})

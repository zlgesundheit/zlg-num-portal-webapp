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
import { TranslateModule } from '@ngx-translate/core'
import { BehaviorSubject, of, Subject } from 'rxjs'
import { AdminService } from 'src/app/core/services/admin/admin.service'
import { ApprovedUsersComponent } from './approved-users.component'
import { MaterialModule } from 'src/app/layout/material/material.module'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IUser } from 'src/app/shared/models/user/user.interface'
import { SearchComponent } from 'src/app/shared/components/search/search.component'
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { IUserFilter } from 'src/app/shared/models/user/user-filter.interface'
import { IFilterItem } from 'src/app/shared/models/filter-chip.interface'
import { UserFilterChipId } from '../../../../shared/models/user/user-filter-chip.enum'
import { ApprovedUsersTableComponent } from '../approved-users-table/approved-users-table.component'

describe('ApprovedUsersComponent', () => {
  let component: ApprovedUsersComponent
  let fixture: ComponentFixture<ApprovedUsersComponent>

  const approvedUsersSubject$ = new Subject<IUser[]>()
  const filteredApprovedUsersSubject$ = new Subject<IUser[]>()
  const filterConfigSubject$ = new BehaviorSubject<IUserFilter>({
    searchText: '',
    filterItem: [],
  })

  const adminService = {
    approvedUsersObservable$: approvedUsersSubject$.asObservable(),
    filteredApprovedUsersObservable$: filteredApprovedUsersSubject$.asObservable(),
    filterConfigObservable$: filterConfigSubject$.asObservable(),
    getAllPag: () => of(),
    setFilter: (_: any) => {},
  } as unknown as AdminService

  @Component({ selector: 'num-filter-chips', template: '' })
  class StubFilterChipsComponent {
    @Input() filterChips: IFilterItem<string | number>[]
    @Input() multiSelect: boolean
    @Output() selectionChange = new EventEmitter()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ApprovedUsersComponent,
        SearchComponent,
        StubFilterChipsComponent,
        ApprovedUsersTableComponent,
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        FontAwesomeTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: AdminService,
          useValue: adminService,
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedUsersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    jest.spyOn(adminService, 'setFilter')
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('When handleFilterChange is triggered', () => {
    it('should filter', () => {
      component.filterConfig['filterItem'] = [
        { id: UserFilterChipId.OrganizationUser, title: 'aaaa', isSelected: true },
      ]
      component.handleFilterChange()
    })
  })
})

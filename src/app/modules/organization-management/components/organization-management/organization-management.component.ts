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

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { OrganizationService } from 'src/app/core/services/organization/organization.service'
import { AvailableRoles } from 'src/app/shared/models/available-roles.enum'
import { Subscription } from 'rxjs'
import { DEFAULT_ORGANIZATION_FILTER } from 'src/app/core/constants/default-filter-organization'
import { OrganizationsTableComponent } from '../organizations-table/organizations-table.component'
import { OrganizationUserFilterChipId } from 'src/app/shared/models/organization/organization-filter-chip.enum'

@Component({
  selector: 'num-organization-management',
  templateUrl: './organization-management.component.html',
  styleUrls: ['./organization-management.component.scss'],
})
export class OrganizationManagementComponent implements OnInit, OnDestroy {
  @ViewChild(OrganizationsTableComponent) table: OrganizationsTableComponent
  availableRoles = AvailableRoles

  private subscription: Subscription[] = []
  filterConfig = DEFAULT_ORGANIZATION_FILTER

  constructor(private organizationService: OrganizationService, private router: Router) {}

  get pageSize(): number {
    return +localStorage.getItem('pageSize') || 5
  }

  ngOnInit(): void {
    this.subscription.push(this.organizationService.getAllPag(0, this.pageSize).subscribe())
    for (let i = 0; i < this.filterConfig.filterItem.length; i++) {
      this.filterConfig.filterItem[i].isSelected = false
    }
    this.filterConfig.filterItem[0].isSelected = true
  }

  createOrganization(): void {
    this.router.navigate(['organizations/new/editor'])
  }
  handleFilterChange(): void {
    let selectedFilter: OrganizationUserFilterChipId
    for (let i = 0; i < this.filterConfig.filterItem.length; i++) {
      if (this.filterConfig.filterItem[i].isSelected) {
        selectedFilter = this.filterConfig.filterItem[i].id
      }
    }
    this.table.handleFilterChange(selectedFilter)
  }

  ngOnDestroy() {
    this.subscription.forEach((subscription) => subscription.unsubscribe())
  }
}

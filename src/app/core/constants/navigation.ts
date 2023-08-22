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

import { AvailableRoles } from 'src/app/shared/models/available-roles.enum'
import INavItem from '../../layout/models/nav-item.interface'

export const mainNavItems: INavItem[] = [
  {
    routeTo: 'home',
    icon: 'num-welcome',
    translationKey: 'NAVIGATION.DASHBOARD',
  },
  {
    routeTo: 'search',
    icon: 'search',
    translationKey: 'NAVIGATION.SEARCH',
    tabNav: [
      {
        routeTo: 'search',
        id: 'patient-filter',
        translationKey: 'NAVIGATION.PATIENT_FILTER',
        disabled: true,
      },
      {
        routeTo: 'search/data-filter',
        id: 'data-filter',
        translationKey: 'NAVIGATION.DATA_FILTER',
        disabled: true,
      },
      {
        routeTo: 'search/data-explorer',
        id: 'data-explorer',
        translationKey: 'NAVIGATION.DATA_RETRIEVAL',
        roles: [AvailableRoles.Manager],
        disabled: true,
      },
    ],
  },
  {
    routeTo: 'projects',
    icon: 'microscope',
    translationKey: 'NAVIGATION.PROJECTS',
    tabNav: [
      {
        routeTo: 'projects',
        id: 'overview',
        translationKey: 'NAVIGATION.PROJECTS_OVERVIEW',
      },
      {
        routeTo: 'projects/new/editor',
        id: 'editor',
        translationKey: 'NAVIGATION.PROJECTS_EDITOR',
        disabled: true,
      },
    ],
  },
  {
    routeTo: 'data-explorer',
    icon: 'table',
    translationKey: 'NAVIGATION.DATA_RETRIEVAL',
    tabNav: [
      {
        routeTo: 'data-explorer/projects',
        id: 'overview',
        translationKey: 'NAVIGATION.PROJECTS_OVERVIEW',
      },
      {
        routeTo: 'data-explorer',
        id: 'data-explorer',
        translationKey: 'NAVIGATION.DATA_RETRIEVAL',
        disabled: true,
      },
    ],
  },
  {
    routeTo: 'aqls',
    icon: 'dna',
    translationKey: 'NAVIGATION.QUERIES',
    tabNav: [
      {
        routeTo: 'aqls',
        id: 'overview',
        translationKey: 'NAVIGATION.QUERIES_OVERVIEW',
      },
      {
        routeTo: 'aqls/new/editor',
        id: 'editor',
        translationKey: 'NAVIGATION.QUERIES_EDITOR',
      },
      {
        routeTo: 'aqls/categories',
        id: 'aql-categories',
        translationKey: 'NAVIGATION.QUERIES_CATEGORIES_OVERVIEW',
        roles: [AvailableRoles.Manager],
      },
    ],
  },
  {
    routeTo: 'users',
    icon: 'user-edit',
    translationKey: 'NAVIGATION.USER_MANAGEMENT',
    tabNav: [
      {
        routeTo: 'users',
        id: 'unapproved',
        translationKey: 'NAVIGATION.NEW_USERS',
      },
      {
        routeTo: 'users/all',
        id: 'approved',
        translationKey: 'NAVIGATION.ALL_USERS',
      },
    ],
  },
  {
    routeTo: 'organizations',
    icon: 'building',
    translationKey: 'NAVIGATION.ORGANIZATION_MANAGEMENT',
    tabNav: [
      {
        routeTo: 'organizations',
        id: 'overview',
        translationKey: 'NAVIGATION.ALL_ORGANIZATIONS',
      },
      {
        routeTo: 'organizations/new/editor',
        id: 'editor',
        translationKey: 'NAVIGATION.ORGANIZATION_EDITOR',
      },
    ],
  },
  {
    routeTo: 'content-editor',
    icon: ['far', 'newspaper'],
    translationKey: 'NAVIGATION.CONTENT_EDITOR',
    tabNav: [
      {
        routeTo: 'content-editor',
        id: 'welcome-page',
        translationKey: 'NAVIGATION.CONTENT_EDITOR_WELCOME_PAGE',
      },
      {
        routeTo: 'content-editor/navigation-items',
        id: 'navigation-items',
        translationKey: 'NAVIGATION.CONTENT_EDITOR_NAVIGATION_ITEMS',
      },
    ],
  },
  {
    routeTo: 'manager-tools',
    icon: 'chart-pie',
    translationKey: 'NAVIGATION.MANAGER_TOOLS',
    roles: [AvailableRoles.Manager],
  },
  {
    routeTo: 'user-manual',
    icon: 'book-open',
    translationKey: 'NAVIGATION.USER_MANUAL',
  },
  {
    routeTo: 'health-check',
    icon: 'file-waveform',
    translationKey: 'NAVIGATION.HEALTH_CHECK',
  },
]

export const secondaryNavItemsLoggedIn: INavItem[] = [
  {
    routeTo: 'profile',
    icon: 'user-circle',
    translationKey: 'NAVIGATION.PROFILE',
  },
  {
    routeTo: '#logout',
    icon: 'sign-out-alt',
    translationKey: 'NAVIGATION.SIGNOUT',
  },
]

export const secondaryNavItemsLoggedOut: INavItem[] = [
  {
    routeTo: '#login',
    icon: 'sign-in-alt',
    translationKey: 'NAVIGATION.SIGNIN',
  },
]

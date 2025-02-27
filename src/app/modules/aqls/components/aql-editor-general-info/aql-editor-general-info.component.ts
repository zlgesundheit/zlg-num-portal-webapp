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

import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'num-aql-editor-general-info',
  templateUrl: './aql-editor-general-info.component.html',
  styleUrls: ['./aql-editor-general-info.component.scss'],
})
export class AqlEditorGeneralInfoComponent implements OnDestroy, OnInit {
  @Input() availableCategories: any
  @Input() form: FormGroup

  lang = 'en'

  private subscriptions = new Subscription()

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.translateService.onLangChange.subscribe((event) => {
        this.lang = event.lang
      })
    )

    this.lang = this.translateService.currentLang
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
}

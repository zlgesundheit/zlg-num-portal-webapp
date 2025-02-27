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

import { Component, EventEmitter, Output } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { IGenericDialog } from 'src/app/shared/models/generic-dialog.interface'

@Component({
  selector: 'num-dialog-confirm-project-approval',
  templateUrl: './dialog-confirm-project-approval.component.html',
  styleUrls: ['./dialog-confirm-project-approval.component.scss'],
})
export class DialogConfirmProjectApprovalComponent implements IGenericDialog<never> {
  constructor() {}

  @Output() closeDialog = new EventEmitter()
  dialogInput: never

  form = new FormGroup({
    check: new FormControl(false, [Validators.requiredTrue]),
  })

  handleDialogCancel(): void {
    this.closeDialog.emit(false)
  }

  handleDialogConfirm(): void {
    this.closeDialog.emit(true)
  }
}

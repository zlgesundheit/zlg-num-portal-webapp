import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { Subscription } from 'rxjs'
import { IAql } from 'src/app/core/models/aql.interface'
import { AqlService } from 'src/app/core/services/aql.service'

@Component({
  selector: 'num-add-aqls-filter-table',
  templateUrl: './add-aqls-filter-table.component.html',
  styleUrls: ['./add-aqls-filter-table.component.scss'],
})
export class AddAqlsFilterTableComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  private subscriptions = new Subscription()
  @ViewChild(MatPaginator) paginator: MatPaginator
  @Input() selectedAqls: IAql[]
  @Output() selectedAqlsChange = new EventEmitter<IAql[]>()

  constructor(private aqlService: AqlService) {}
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['name', 'author', 'organisation', 'icon']
  lookupSelectedAql: { [id: number]: boolean } = {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.aqlService.filteredAqlsObservable$.subscribe((aqls) => this.handleData(aqls))
    )
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'selectedAqls': {
            const changedData = changes[propName].currentValue as IAql[]
            const selectedAqls: { [id: number]: boolean } = {}
            changedData.forEach((selectedAql) => (selectedAqls[selectedAql.id] = true))
            this.lookupSelectedAql = selectedAqls
          }
        }
      }
    }
  }

  handleData(aqls: IAql[]): void {
    this.dataSource.data = aqls
  }

  handleRowClick(row: IAql): void {
    this.lookupSelectedAql[row.id] = true
    this.selectedAqlsChange.emit([...this.selectedAqls, row])
  }
}

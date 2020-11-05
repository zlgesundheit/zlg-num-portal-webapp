import { AqlFilterChipId } from 'src/app/shared/models/aql-filter-chip.enum'
import { IAqlFilter } from '../models/aql-filter.interface'

export const DEFAULT_AQL_FILTER: IAqlFilter = {
  searchText: '',
  filterChips: [
    {
      id: AqlFilterChipId.MyAql,
      title: 'MY_AQLS',
      isSelected: true,
    },
    {
      id: AqlFilterChipId.OrganisationAql,
      title: 'ORGANISATION_AQLS',
      isSelected: true,
    },
    {
      id: AqlFilterChipId.AllAql,
      title: 'ALL_AQLS',
      isSelected: false,
    },
  ],
}

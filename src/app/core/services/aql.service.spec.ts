import { HttpClient } from '@angular/common/http'
import { of, throwError } from 'rxjs'
import { AppConfigService } from 'src/app/config/app-config.service'
import { IAqlFilter } from 'src/app/shared/models/aql/aql-filter.interface'
import { mockAql1, mockAqls } from 'src/mocks/data-mocks/aqls.mock'
import { AqlService } from './aql.service'
import { AqlEditorUiModel } from 'src/app/shared/models/aql/aql-editor-ui.model'

describe('AqlService', () => {
  let service: AqlService
  const baseUrl = 'localhost/api/aql'

  let throttleTime: number
  const httpClient = ({
    get: () => of(mockAqls),
    post: () => of({}),
  } as unknown) as HttpClient

  const appConfig = {
    config: {
      api: {
        baseUrl: 'localhost/api',
      },
    },
  } as AppConfigService

  const filterConfig: IAqlFilter = {
    filterChips: [],
    searchText: 'test',
  }

  beforeEach(() => {
    service = new AqlService(httpClient, appConfig)
    jest.restoreAllMocks()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('When a call to getAll method comes in', () => {
    beforeEach(() => {
      jest.spyOn(httpClient, 'get').mockImplementation(() => throwError('Error'))
      jest.spyOn(service, 'handleError')
    })

    it('should call the api - with error', () => {
      service
        .getAll()
        .toPromise()
        .then((_) => {})
        .catch((_) => {})
      expect(httpClient.get).toHaveBeenCalledWith('localhost/api/aql')
      expect(service.handleError).toHaveBeenCalled()
    })
  })

  describe('When a call to getAll method comes in', () => {
    beforeEach(() => {
      jest.spyOn(httpClient, 'get').mockImplementation(() => of(mockAqls))
    })
    it('should call the api - with success', () => {
      service.getAll().subscribe()
      expect(httpClient.get).toHaveBeenCalled()
    })
  })

  describe('When a call to get method comes in', () => {
    it('should return with a single aql found on the backend', async () => {
      const result = await service.get(1).toPromise()
      expect(result.id).toEqual(1)
    })

    it('should return with a single aql found in memory', async () => {
      const preFillMemory = await service.getAll().toPromise()
      const result = await service.get(1).toPromise()
      expect(result.id).toEqual(1)
    })

    it('should return with an not found error when not found', async () => {
      const result = await service
        .get(123)
        .toPromise()
        .catch((error) => {
          expect(error).toBeTruthy()
          expect(error).toEqual(new Error('Not Found'))
        })
    })
  })

  describe('When multiple filter are passed in', () => {
    beforeEach(() => {
      jest.restoreAllMocks()
      jest.spyOn(httpClient, 'get').mockImplementation(() => of([]))
      throttleTime = (service as any).throttleTime
    })

    it('should debounce the filtering', async (done) => {
      const filterConfigLast: IAqlFilter = {
        filterChips: [],
        searchText: 'name1',
      }
      let filterResult: AqlEditorUiModel[]
      const callHelper = jest.fn((result) => (filterResult = result))
      service.filteredAqlsObservable$.subscribe(callHelper)

      /* Service Init */
      expect(callHelper).toHaveBeenCalledTimes(1)

      /* First filter call after throttle time */
      setTimeout(() => {
        service.setFilter(filterConfig)
        expect(callHelper).toHaveBeenCalledTimes(3)
      }, throttleTime + 1)

      setTimeout(() => {
        /* Second filter call but within throttle time */
        service.setFilter(filterConfig)
        expect(callHelper).toHaveBeenCalledTimes(3)
      }, throttleTime + 1)

      setTimeout(() => {
        /* Third filter call but within throttle time */
        service.setFilter(filterConfig)
        expect(callHelper).toHaveBeenCalledTimes(3)
      }, throttleTime + 10)

      setTimeout(() => {
        /* Fourth filter call, meanwhile the third filter was pushed */
        service.setFilter(filterConfigLast)
        expect(callHelper).toHaveBeenCalledTimes(5)
        expect(filterResult.length).toEqual(1)
        expect(filterResult[0].id).toEqual(1)
        done()
      }, throttleTime * 3)
    })
  })

  describe('When a call to save method comes in', () => {
    it('should post to the api with the aqls as payload', () => {
      jest.spyOn(httpClient, 'post')
      service.save(mockAql1).subscribe()
      expect(httpClient.post).toHaveBeenCalledWith(baseUrl, mockAql1)
    })

    it('should call handleError on api error', () => {
      jest.spyOn(httpClient, 'post').mockImplementation(() => throwError('Error'))
      jest.spyOn(service, 'handleError')
      service.save(mockAql1).subscribe()
      expect(httpClient.post).toHaveBeenCalledWith(baseUrl, mockAql1)
      expect(service.handleError).toHaveBeenCalled()
    })
  })
})

import { Sort } from '@common/query';
import { filter, sort, paginate, list } from './knex-extensions';

describe('filter', () => {
  it('should apply all the filters to the query builder', () => {
    const queryBuilder = {};

    const filters = {
      name: 'John',
      height: undefined,
      age: 42,
    };

    const filterMap = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      name: jest.fn((qb, _name: string) => qb),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      age: jest.fn((qb, _age: number) => qb),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      height: jest.fn((qb, _height: number) => qb),
    };

    filter(queryBuilder as never, filters, filterMap as never);

    expect(filterMap.name).toHaveBeenCalledWith(queryBuilder, filters.name);
    expect(filterMap.height).not.toHaveBeenCalled();
    expect(filterMap.age).toHaveBeenCalledWith(queryBuilder, filters.age);
  });
});

describe('sort', () => {
  it('should apply all the sortings to the query builder', () => {
    const queryBuilder = {};

    const sorts: Sort<'name' | 'age'>[] = [
      { column: 'name' },
      { column: 'age', order: 'desc' },
    ];

    const sorterMap = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      name: jest.fn((qb, _order) => qb),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      age: jest.fn((qb, _order) => qb),
    };

    sort(queryBuilder, sorts, sorterMap);

    expect(sorterMap.name).toHaveBeenCalledWith(queryBuilder, 'asc');
    expect(sorterMap.age).toHaveBeenCalledWith(queryBuilder, 'desc');
  });
});

describe('paginate', () => {
  it('should apply an offset and a limit to the query builder', () => {
    const queryBuilder = {
      offset() {
        return this;
      },
      limit() {
        return this;
      },
    };

    jest.spyOn(queryBuilder, 'offset');
    jest.spyOn(queryBuilder, 'limit');

    const pagination = {
      page: 3,
      items: 15,
    };

    paginate(queryBuilder as never, pagination);

    expect(queryBuilder.offset).toHaveBeenCalledWith(30);
    expect(queryBuilder.limit).toHaveBeenCalledWith(15);
  });
});

describe('list', () => {
  it('should apply the filters, sortings and pagination', () => {
    const queryBuilder = {
      filter() {
        return this;
      },
      sort() {
        return this;
      },
      paginate() {
        return this;
      },
    };

    jest.spyOn(queryBuilder, 'filter');
    jest.spyOn(queryBuilder, 'sort');
    jest.spyOn(queryBuilder, 'paginate');

    const query = {
      filters: {
        name: 'John',
      },
      sorts: [{ column: 'age', order: 'desc' }],
      pagination: {
        page: 2,
        items: 9,
      },
    };

    const maps = {
      filterMap: {
        name: jest.fn((qb) => qb),
      },
      sorterMap: {
        age: jest.fn((qb) => qb),
      },
    };

    list(queryBuilder as never, query as never, maps as never);

    expect(queryBuilder.filter).toHaveBeenCalledWith(
      query.filters,
      maps.filterMap
    );
    expect(queryBuilder.sort).toHaveBeenCalledWith(query.sorts, maps.sorterMap);
    expect(queryBuilder.paginate).toHaveBeenCalledWith(query.pagination);
  });
});

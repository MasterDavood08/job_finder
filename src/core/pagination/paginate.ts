import { Repository, FindConditions, FindManyOptions, SelectQueryBuilder } from "typeorm";
import { IPaginationOptions } from "./interfaces";
import { Pagination } from "./pagination";
// import { Repository, FindConditions, FindManyOptions, SelectQueryBuilder } from "typeorm-plus";

export async function paginate<T>(
    repository: Repository<T>,
    options: IPaginationOptions,
    searchOptions?: FindConditions<T> | FindManyOptions<T>,
    dtoClass?: any,
): Promise<Pagination<T>>;

export async function paginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions,
    dtoClass?: any,
): Promise<Pagination<T>>;

export async function paginate<T>(
    repository: Repository<T>,
    options: IPaginationOptions,
    dtoClass?: any,
): Promise<Pagination<T>>;

export async function paginate<T>(
    repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
    options: IPaginationOptions,
    searchOptions?: FindConditions<T> | FindManyOptions<T>,
    dtoClass?: any,
) {
    return repositoryOrQueryBuilder instanceof Repository
        ? paginateRepository<T>(repositoryOrQueryBuilder, options, dtoClass, searchOptions)
        : paginateQueryBuilder(repositoryOrQueryBuilder, options, dtoClass);
}

function resolveOptions(options: IPaginationOptions): [number, number] {
    const page = options.page < 1 || !options.page ? 1 : options.page;
    let limit = options.limit || 10;
    limit = limit < 5 ? 10 : limit;
    limit = limit > 100 ? 100 : limit;

    return [page, limit];
}

function createPaginationObject<T>(
    items: any[],
    totalItems: number,
    currentPage: number,
    limit: number,
    dtoClass: any
) {
    const totalPages = Math.ceil(totalItems / limit);
    return new Pagination(
        (!!dtoClass ? items.map(i => new dtoClass(i)) : items),
        {
            totalItems: totalItems,
            itemCount: items.length,
            itemsPerPage: limit,

            totalPages: totalPages,
            currentPage: currentPage,
        },
    );
}

async function paginateRepository<T>(
    repository: Repository<T>,
    options: IPaginationOptions,
    dtoClass?: any,
    searchOptions?: FindConditions<T> | FindManyOptions<T>,
): Promise<Pagination<T>> {
    const [page, limit] = resolveOptions(options);

    const [items, total] = await repository.findAndCount({
        skip: limit * (page - 1),
        take: limit,
        where: searchOptions
    });

    return createPaginationObject<T>(items, total, page, limit, dtoClass);
}

async function paginateQueryBuilder<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions,
    dtoClass: any
): Promise<Pagination<T>> {
    const [page, limit] = resolveOptions(options);

    const [items, total] = await queryBuilder
        .take(limit)
        .skip((page - 1) * limit)
        .getManyAndCount();

    return createPaginationObject<T>(items, total, page, limit, dtoClass);
}

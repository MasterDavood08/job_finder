export interface IPaginationOptions {

    limit: number;

    page: number;

    // route: string;

}

export interface IPaginationMeta {

    itemCount: number,

    totalItems: number,

    itemsPerPage: number,

    totalPages: number,

    currentPage: number,
}

import { IPaginationMeta } from "./interfaces";

export class Pagination<PaginationObject> {
    constructor(

        public items: PaginationObject[],

        public meta: IPaginationMeta,

    ) { }
}

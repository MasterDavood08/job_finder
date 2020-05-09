export class Serializable<T> {
    public constructor(public readonly serialize: (roles: string[]) => Promise<T | T[]>) { }
}

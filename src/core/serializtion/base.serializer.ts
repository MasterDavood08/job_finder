import { Serializable } from "./serializable";


export abstract class BaseSerializerService<E, T> {
    public abstract async serialize(entity: E, roles: string[]): Promise<T>;

    private serializeCollection(values: E[], roles: string[]): Promise<T[]> {
        return Promise.all<T>(values.map((v) => this.serialize(v, roles)));
    }

    public markSerializableValue(value: E): Serializable<T> {
        return new Serializable<T>(this.serialize.bind(this, value));
    }

    public markSerializableCollection(values: E[]): Serializable<T[]> {
        return new Serializable<T[]>(this.serializeCollection.bind(this, values));
    }
}

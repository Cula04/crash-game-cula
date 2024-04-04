import { v4 as uuidV4 } from 'uuid';

const isEntity = (v: any): v is BaseEntity<any> => {
  return v instanceof BaseEntity;
};

export abstract class BaseEntity<T> {
  protected readonly _id: string;
  protected _props: T;

  get props(): T {
    return Object.freeze({ ...this._props });
  }

  constructor(props: T, id?: string) {
    this._id = id ? id : uuidV4();
    this._props = props;
  }

  public equals(object?: BaseEntity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id === object._id;
  }
}

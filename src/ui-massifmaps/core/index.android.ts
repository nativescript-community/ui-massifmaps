import { BaseNative } from '../BaseNative';
import { AltitudeKey, DefaultLatLonKeys, GenericMapPos, LatitudeKey, LongitudeKey, MapVec, ScreenBounds, ScreenPos } from './index.common';
export * from './index.common';

export class MapBounds<T = DefaultLatLonKeys> extends BaseNative<com.massifmaps.core.MapBounds, {}> {
    constructor(
        public northeast?: GenericMapPos<T>,
        public southwest?: GenericMapPos<T>,
        native?: com.massifmaps.core.MapBounds
    ) {
        super(undefined, native);
    }
    createNative() {
        if (this.southwest && this.northeast) {
            return new com.massifmaps.core.MapBounds(toNativeMapPos<T>(this.southwest), toNativeMapPos<T>(this.northeast));
        } else {
            return new com.massifmaps.core.MapBounds();
        }
    }
    contains(position: GenericMapPos<T> | MapBounds<T>) {
        if (position['southwest']) {
            return this.getNative().contains(toNativeMapBounds<T>(position as MapBounds<T>));
        } else {
            return this.getNative().contains(toNativeMapPos<T>(position as GenericMapPos<T>));
        }
    }
    intersects(position: MapBounds) {
        return this.getNative().intersects(toNativeMapBounds(position));
    }
    shrinkToIntersection(position: MapBounds) {
        return this.getNative().shrinkToIntersection(toNativeMapBounds(position));
    }
    equals(position: MapBounds) {
        return this.getNative().equals(toNativeMapBounds(position));
    }
    getCenter() {
        return fromNativeMapPos(this.getNative().getCenter());
    }
    getMin() {
        return fromNativeMapPos(this.getNative().getMin());
    }
    getMax() {
        return fromNativeMapPos(this.getNative().getMax());
    }
    toJSON() {
        return { southwest: this.southwest, northeast: this.northeast };
    }
}

export function fromNativeMapPos<T = DefaultLatLonKeys>(position: com.massifmaps.core.MapPos) {
    if (!position) {
        return null;
    }
    return {
        [LatitudeKey]: position.getY(),
        [LongitudeKey]: position.getX(),
        [AltitudeKey]: position.getZ()
    } as GenericMapPos<T>;
}
export function toNativeMapPos<T = DefaultLatLonKeys>(position: GenericMapPos<T> | com.massifmaps.core.MapPos, ignoreAltitude = false) {
    if (!position) {
        return null;
    }
    if (position instanceof com.massifmaps.core.MapPos) {
        return position;
    }
    if (position[LongitudeKey] === undefined || position[LatitudeKey] === undefined) {
        throw new Error(`toNativeMapPos: missing lat/lon parameters in ${position}`);
    }
    const result = new com.massifmaps.core.MapPos(position[LongitudeKey], position[LatitudeKey], !ignoreAltitude && position[AltitudeKey] > 0 ? position[AltitudeKey] : 0);
    // non-positive altitude is dropped: points can get under the map
    return result;
}
export function fromNativeScreenPos(position: com.massifmaps.core.ScreenPos) {
    return {
        x: position.getX(),
        y: position.getY()
    } as ScreenPos;
}
export function toNativeScreenPos(position: ScreenPos) {
    if (position instanceof com.massifmaps.core.ScreenPos) {
        return position;
    }
    return new com.massifmaps.core.ScreenPos(position.x, position.y);
}

export function toNativeMapVec(value: MapVec | [number, number, number]) {
    if (Array.isArray(value)) {
        return new com.massifmaps.core.MapVec(value[0], value[1], value[2]);
    }
    if (value instanceof com.massifmaps.core.MapVec) {
        return value;
    }
    return new com.massifmaps.core.MapVec(value.x, value.y, value.z);
}

export function fromNativeMapVec(value: com.massifmaps.core.MapVec) {
    return {
        x: value.getX(),
        y: value.getY(),
        z: value.getZ()
    } as MapVec;
}

export function fromNativeMapBounds<T = DefaultLatLonKeys>(bounds: com.massifmaps.core.MapBounds) {
    return new MapBounds<T>(fromNativeMapPos<T>(bounds.getMax()), fromNativeMapPos<T>(bounds.getMin()));
}
export function toNativeMapBounds<T = DefaultLatLonKeys>(bounds: MapBounds<T>) {
    if (bounds instanceof com.massifmaps.core.MapBounds) {
        return bounds;
    } else if (bounds.getNative) {
        return bounds.getNative();
    }
    return new com.massifmaps.core.MapBounds(toNativeMapPos<T>(bounds.southwest), toNativeMapPos<T>(bounds.northeast));
}

export function fromNativeScreenBounds(bounds: com.massifmaps.core.ScreenBounds) {
    return {
        min: fromNativeScreenPos(bounds.getMin()),
        max: fromNativeScreenPos(bounds.getMax())
    } as ScreenBounds;
}
export function toNativeScreenBounds(bounds: ScreenBounds) {
    if (bounds instanceof com.massifmaps.core.ScreenBounds) {
        return bounds;
    }
    if (bounds) {
        return new com.massifmaps.core.ScreenBounds(toNativeScreenPos(bounds.min), toNativeScreenPos(bounds.max));
    }
    return new com.massifmaps.core.ScreenBounds();
}

export abstract class NativeVector<T, U = T> extends BaseNative<U, any> {
    constructor(native) {
        super(null, native);
    }

    size() {
        //@ts-ignore
        return this.getNative().size();
    }
    public reserve(size: number) {
        //@ts-ignore
        return this.getNative().reserve(size);
    }
    //@ts-ignore
    public get(index: number): T {
        //@ts-ignore
        return this.getNative().get(index);
    }
    public add(position: T) {
        //@ts-ignore
        return this.getNative().add(position);
    }
    public capacity() {
        //@ts-ignore
        return this.getNative().capacity();
    }
    public clear() {
        //@ts-ignore
        return this.getNative().clear();
    }
    public isEmpty() {
        //@ts-ignore
        return this.getNative().isEmpty();
    }
    //@ts-ignore
    public set(index: number, position: T) {
        //@ts-ignore
        return this.getNative().set(index, position);
    }
    toArray(): any[] {
        const result: T[] = [];
        for (let i = 0; i < this.size(); i++) {
            result.push(this.get(i));
        }
        return result;
    }
}
export class MapPosVector<T = DefaultLatLonKeys> extends NativeVector<com.massifmaps.core.MapPos, com.massifmaps.core.MapPosVector> {
    createNative() {
        return new com.massifmaps.core.MapPosVector();
    }
    public add(position: com.massifmaps.core.MapPos | GenericMapPos<T>) {
        if (position instanceof com.massifmaps.core.MapPos) {
            position = toNativeMapPos<T>(position);
            return this.getNative().add(position);
        }
        return this.getNative().add(toNativeMapPos(position));
    }

    getPos(index: number) {
        return fromNativeMapPos<T>(this.get(index));
    }

    toArray() {
        const result: GenericMapPos<T>[] = [];
        for (let i = 0; i < this.size(); i++) {
            result.push(fromNativeMapPos<T>(this.get(i)));
        }
        return result;
    }
}
export class IntVector extends NativeVector<com.massifmaps.core.IntVector, com.massifmaps.core.IntVector> {
    createNative() {
        return new com.massifmaps.core.IntVector();
    }
}
export class DoubleVector extends NativeVector<com.massifmaps.core.DoubleVector, com.massifmaps.core.DoubleVector> {
    createNative() {
        return new com.massifmaps.core.DoubleVector();
    }
}
export class MapPosVectorVector<T = DefaultLatLonKeys> extends NativeVector<com.massifmaps.core.MapPosVector, com.massifmaps.core.MapPosVectorVector> {
    createNative() {
        return new com.massifmaps.core.MapPosVectorVector();
    }
    public add(position: com.massifmaps.core.MapPosVector | MapPosVector<T>) {
        if (position instanceof MapPosVector) {
            return this.getNative().add(position.getNative());
        }
        return this.getNative().add(position);
    }
}

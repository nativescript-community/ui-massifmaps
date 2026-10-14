import { BaseNative } from '../BaseNative';
import { AltitudeKey, DefaultLatLonKeys, GenericMapPos, LatitudeKey, LongitudeKey, MapVec, ScreenBounds, ScreenPos } from './index.common';
export * from './index.common';

export class MapBounds<T = DefaultLatLonKeys> extends BaseNative<MSFMapBounds, {}> {
    constructor(
        public northeast?: GenericMapPos<T>,
        public southwest?: GenericMapPos<T>,
        native?: MSFMapBounds
    ) {
        super(undefined, native);
    }
    createNative() {
        if (this.southwest && this.northeast) {
            return MSFMapBounds.alloc().initWithMinMax(toNativeMapPos<T>(this.southwest), toNativeMapPos<T>(this.northeast));
        } else {
            return MSFMapBounds.alloc().init();
        }
    }
    contains(position: GenericMapPos<T> | MapBounds<T>) {
        if (position['southwest']) {
            return this.getNative().containsBounds(toNativeMapBounds<T>(position as MapBounds<T>));
        } else {
            return this.getNative().containsPos(toNativeMapPos<T>(position as GenericMapPos<T>));
        }
    }
    intersects(position: MapBounds<T>) {
        return this.getNative().intersects(toNativeMapBounds<T>(position));
    }
    shrinkToIntersection(position: MapBounds) {
        return this.getNative().shrinkToIntersection(toNativeMapBounds(position));
    }
    equals(position: MapBounds<T>) {
        return this.getNative().isEqualInternal(toNativeMapBounds<T>(position));
    }
    getCenter() {
        return fromNativeMapPos(this.getNative().getCenter());
    }

    toJSON() {
        return { southwest: this.southwest, northeast: this.northeast };
    }
}

export function fromNativeMapPos<T = DefaultLatLonKeys>(position: MSFMapPos) {
    if (!position) {
        return null;
    }
    return {
        [LatitudeKey]: position.getY(),
        [LongitudeKey]: position.getX(),
        [AltitudeKey]: position.getZ()
    } as GenericMapPos<T>;
}
export function toNativeMapPos<T = DefaultLatLonKeys>(position: GenericMapPos<T> | MSFMapPos, ignoreAltitude = false) {
    if (!position) {
        return null;
    }
    if (position instanceof MSFMapPos) {
        return position;
    }
    // non-positive altitude is dropped: points can get under the map
    return MSFMapPos.alloc().initWithXYZ(position[LongitudeKey], position[LatitudeKey], !ignoreAltitude && position[AltitudeKey] > 0 ? position[AltitudeKey] : 0);
}
export function fromNativeScreenPos(position: MSFScreenPos) {
    return {
        x: position.getX(),
        y: position.getY()
    } as ScreenPos;
}
export function toNativeScreenPos(position: ScreenPos | MSFScreenPos) {
    if (position instanceof MSFScreenPos) {
        return position;
    }
    return MSFScreenPos.alloc().initWithXY(position.x, position.y);
}
export function toNativeMapVec(value: MapVec | [number, number, number]) {
    if (Array.isArray(value)) {
        return MSFMapVec.alloc().initWithXYZ(value[0], value[1], value[2]);
    }
    if (value instanceof MSFMapVec) {
        return value;
    }
    return MSFMapVec.alloc().initWithXYZ(value.x, value.y, value.z);
}
export function fromNativeMapVec(value: MSFMapVec) {
    return {
        x: value.getX(),
        y: value.getY(),
        z: value.getZ()
    } as MapVec;
}

export function fromNativeMapBounds<T = DefaultLatLonKeys>(bounds: MSFMapBounds) {
    return new MapBounds<T>(fromNativeMapPos<T>(bounds.getMax()), fromNativeMapPos<T>(bounds.getMin()));
}
export function toNativeMapBounds<T = DefaultLatLonKeys>(bounds: MapBounds<T>) {
    if (bounds instanceof MSFMapBounds) {
        return bounds;
    }
    if (typeof bounds.getNative === 'function') {
        return bounds.getNative();
    }
    return MSFMapBounds.alloc().initWithMinMax(toNativeMapPos<T>(bounds.southwest), toNativeMapPos<T>(bounds.northeast));
}

export function fromNativeScreenBounds(bounds: MSFScreenBounds) {
    return {
        min: fromNativeScreenPos(bounds.getMin()),
        max: fromNativeScreenPos(bounds.getMax())
    } as ScreenBounds;
}
export function toNativeScreenBounds(bounds: ScreenBounds) {
    if (bounds instanceof MSFScreenBounds) {
        return bounds;
    }
    if (bounds) {
        return MSFScreenBounds.alloc().initWithMinMax(toNativeScreenPos(bounds.min), toNativeScreenPos(bounds.max));
    }
    return MSFScreenBounds.alloc().init();
}

export abstract class NativeVector<T, U = any> extends BaseNative<U, any> {
    constructor(native) {
        super(null, native);
    }
    createNative(options) {
        return null;
    }
    size() {
        //@ts-ignore
        return this.native.size();
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
        return this.getNative().setVal(index, position);
    }
}
export class MapPosVector<T = DefaultLatLonKeys> extends NativeVector<MSFMapPos, MSFMapPosVector> {
    createNative() {
        return MSFMapPosVector.alloc().init();
    }

    public add(position: MSFMapPos | GenericMapPos<T>) {
        if (position instanceof MSFMapPos) {
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
            result.push(fromNativeMapPos(this.get(i)));
        }
        return result;
    }
}

export class DoubleVector extends NativeVector<MSFDoubleVector, MSFDoubleVector> {
    createNative() {
        return MSFDoubleVector.alloc().init();
    }
}
export class MapPosVectorVector<T = DefaultLatLonKeys> extends NativeVector<MSFMapPosVector, MSFMapPosVectorVector> {
    createNative() {
        return MSFMapPosVectorVector.alloc().init();
    }
    public add(position: MSFMapPosVector | MapPosVector<T>) {
        if (position instanceof MapPosVector) {
            return this.getNative().add(position.getNative());
        }
        return this.getNative().add(position);
    }
}

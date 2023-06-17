import Object from "@rbxts/object-utils"

export type Dictionary = {
    [key: string]: defined
}

export namespace ObjectUtils {
    export function length(TargetObject: unknown[]) {
        let Length = 0

        Object.values(TargetObject).forEach(() => {
            Length++
        })

        return Length
    }

    export function without<T extends defined>(TargetObject: T[], TargetElement: T): T[] { 
        return TargetObject.filter(Element => Element !== TargetElement)
    }

    export function assignExisting(TargetObject: Dictionary, ReferenceObject: Dictionary) {
        Object.entries(ReferenceObject).forEach(([ReferenceKey, ReferenceValue]) => {
            if(pcall(() => TargetObject[ReferenceKey])[0]) {
                TargetObject[ReferenceKey] = ReferenceValue
            }
        })
    }
}
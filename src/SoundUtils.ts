// Imports
import Object from "@rbxts/object-utils"
import { SoundService, Workspace } from "@rbxts/services"

// Types
type SoundProperties = Partial<
    WritableInstanceProperties<Sound>>

export class SoundWrapper {
    readonly Object: Sound

    public constructor(
        readonly Id: string,
        readonly Properties: SoundProperties = { },
        readonly Group?: SoundGroup
    ) {
        this.Object = new Instance("Sound")
        this.Object.SoundId = Id
        this.Object.SoundGroup = Group
        this.Object.Parent = Workspace

        Object.assign(this.Object,Properties)
    }

    public Play() {
        this.Object.Play()
    }

    public Stop() {
        this.Object.Stop()
    }

    public PlayLocal() {
        SoundService.PlayLocalSound(this.Object)
    }
}
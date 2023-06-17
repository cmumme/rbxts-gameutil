import { AnimationUtils } from "./AnimationUtils"

export type Character = Model&{
    Humanoid: Humanoid,
    HumanoidRootPart: Part,
    Head: Part
}

export namespace CharacterUtils {
    export function God(Character: Character) {
        Character.WaitForChild("Humanoid")

        Character.Humanoid.MaxHealth = math.huge
        Character.Humanoid.Health = math.huge
    }

    export function HideDisplay(Character: Character) {
        Character.WaitForChild("Humanoid")

        Character.Humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None
        Character.Humanoid.HealthDisplayType = Enum.HumanoidHealthDisplayType.AlwaysOff
    }

    export function GetAnimator(Character: Character): Animator {
        Character.WaitForChild("Humanoid")

        return AnimationUtils.GetAnimator(Character.Humanoid)
    }

    export function Anchor(Character: Character) {
        Character.WaitForChild("HumanoidRootPart")

        Character.HumanoidRootPart.Anchored = true
    }
}
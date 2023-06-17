import { RunService } from "@rbxts/services"

export namespace AnimationUtils {
    export function GetAnimator(Animatable: Humanoid | AnimationController): Animator {
        let Animator = Animatable.FindFirstChildWhichIsA("Animator") as Animator

        if(Animator) return Animator

        if(RunService.IsServer()) {
            Animator = new Instance("Animator")
            Animator.Parent = Animatable
        }

        if(RunService.IsClient()) {
            Animator = Animatable.WaitForChild("Animator") as Animator
        }

        return Animator
    }

    export function LoadById(Animator: Animator, Id: string) {
        const Animation = new Instance("Animation")
        Animation.AnimationId = Id
        Animation.Parent = Animator

        return Animator.LoadAnimation(Animation)
    }
}
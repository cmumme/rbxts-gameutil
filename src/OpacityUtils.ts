import { Standard } from "@rbxts/easing-functions"
import Signal from "@rbxts/signal"
import Tween, { PseudoTween } from "@rbxts/tween"
import { Dictionary, ObjectUtils } from "./ObjectUtils"

export class OpacityManager {
    private ObjectPool: (GuiBase | UIStroke)[] = [ ]
    public TargetReached = new Signal()

    private TargetOpacity = 0
    private CurrentOpacity = 0

    private CurrentTween?: PseudoTween

    public constructor(
        public Element: GuiBase | UIStroke,
        public Visible = true,
        public Easing: (Delta: number) => void = Standard,
        public Speed = 1
    ) {
        this.AddObject(Element)
        this.Element.GetDescendants().forEach(Object => this.AddObject(Object))
        this.Element.DescendantAdded.Connect(Object => this.AddObject(Object))
        
        this.AnchorOpacity(1)

        this.Visible && this.SetTargetOpacity(0)
    }

    private GetOpacityForElement(Element: GuiBase | UIStroke) {
        const OriginalTransparency = Element.FindFirstChild("OriginalTransparency")

        return OriginalTransparency ? 
                    OriginalTransparency.IsA("NumberValue") ?
                        OriginalTransparency.Value-this.CurrentOpacity :
                        this.CurrentOpacity :
                    this.CurrentOpacity
    }

    private SetOpacityForElement(Element: GuiBase | UIStroke, Opacity: number) {
        ObjectUtils.assignExisting(Element as never as Dictionary, {
            BackgroundTransparency: Opacity + (Element.GetAttribute("OriginalBackgroundTransparency") as number ?? 0),
            TextTransparency: Opacity + (Element.GetAttribute("OriginalTextTransparency") as number ?? 0),
            ImageTransparency: Opacity + (Element.GetAttribute("OriginalImageTransparency") as number ?? 0)
        })

        if(Element.IsA("UIStroke")) {
            ObjectUtils.assignExisting(Element as never as Dictionary, {
                Transparency: Opacity + (Element.GetAttribute("OriginalTransparency") as number ?? 0),
            })
        }
    }

    private HasProperty(Object: Dictionary, Property: string) {
        return pcall(() => Object[Property])[0]
    }

    private AddObject(Object: Instance) {
        if(!Object.IsA("GuiBase") && !Object.IsA("UIStroke")) return

        if(this.HasProperty(Object as never as Dictionary, "BackgroundTransparency") && Object.GetAttribute("OriginalBackgroundTransparency") === undefined) {
            Object.SetAttribute("OriginalBackgroundTransparency", (Object as GuiObject).BackgroundTransparency)
        }
        if(Object.IsA("UIStroke") && Object.GetAttribute("OriginalTransparency") === undefined) {
            Object.SetAttribute("OriginalTransparency", Object.Transparency)
        }
        if(this.HasProperty(Object as never as Dictionary, "ImageTransparency") && Object.GetAttribute("OriginalImageTransparency") === undefined) {
            Object.SetAttribute("OriginalImageTransparency", (Object as ImageLabel).ImageTransparency)
        }
        if(this.HasProperty(Object as never as Dictionary, "TextTransparency") && Object.GetAttribute("OriginalTextTransparency") === undefined) {
            Object.SetAttribute("OriginalTextTransparency", (Object as TextLabel).TextTransparency)
        }

        this.ObjectPool.push(Object)

        this.SetOpacityForElement(Object, this.GetOpacityForElement(Object))
        
        const AncestryChangedConnection = Object.AncestryChanged.Connect(() => {
            if(!Object.IsDescendantOf(this.Element)) {
                this.ObjectPool = ObjectUtils.without(this.ObjectPool, Object)
                AncestryChangedConnection.Disconnect()
            }
        })
    }

    public GetTargetOpacity() {
        return this.TargetOpacity
    }

    public SetTargetOpacity(TargetOpacity: number) {
        this.TargetOpacity = TargetOpacity

        this.CurrentTween?.Pause()

        const Difference = math.abs(this.CurrentOpacity - this.TargetOpacity)

        this.CurrentTween = Tween(Difference/(this.Speed * 2), this.Easing, (Opacity) => {
            this.SetCurrentOpacity(Opacity)
            if(Opacity === this.TargetOpacity) {
                this.TargetReached.Fire()
            }
        }, this.CurrentOpacity, this.TargetOpacity)
    }

    public GetCurrentOpacity() {
        return this.CurrentOpacity
    }

    public SetCurrentOpacity(CurrentOpacity: number) {
        this.CurrentOpacity = CurrentOpacity

        this.ObjectPool.forEach(Element => {
            const OpacityForElement = CurrentOpacity

            this.SetOpacityForElement(Element, OpacityForElement)
        })
    }

    /**
     * Immediately sets the element's opacity to ``Opacity``
     * @param Opacity The opacity to anchor the element at.
     */
    public AnchorOpacity(Opacity: number) {
        this.CurrentTween?.Cancel()
        this.SetCurrentOpacity(Opacity)
        this.TargetOpacity = Opacity
    }
}
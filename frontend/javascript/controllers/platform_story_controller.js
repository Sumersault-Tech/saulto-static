import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["tab", "tabUnderline", "copy", "visual", "dot"]
  static values = { index: { type: Number, default: 0 } }

  connect() {
    this._update()
  }

  select(event) {
    const idx = parseInt(event.currentTarget.dataset.storyIndex, 10)
    this.indexValue = idx
    this._update()
  }

  selectDot(event) {
    const idx = parseInt(event.currentTarget.dataset.dotIndex, 10)
    this.indexValue = idx
    this._update()
  }

  _update() {
    const idx = this.indexValue
    const dark = "hsl(155,28%,13%)"

    this.tabTargets.forEach((tab, i) => {
      const active = i === idx
      tab.style.background = active ? dark : "transparent"

      const num = tab.querySelector("[data-tab-num]")
      const label = tab.querySelector("[data-tab-label]")
      if (num) num.style.color = active ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.32)"
      if (label) label.style.color = active ? "white" : "hsl(155,30%,18%)"

      const underline = tab.querySelector("[data-tab-underline]")
      if (underline) underline.classList.toggle("hidden", !active)
    })

    this.copyTargets.forEach((el, i) => el.classList.toggle("hidden", i !== idx))
    this.visualTargets.forEach((el, i) => el.classList.toggle("hidden", i !== idx))

    this.dotTargets.forEach((dot, i) => {
      const active = i === idx
      dot.style.width = active ? "22px" : "6px"
      dot.style.background = active ? "hsl(155,55%,32%)" : "rgba(0,0,0,0.14)"
    })
  }
}

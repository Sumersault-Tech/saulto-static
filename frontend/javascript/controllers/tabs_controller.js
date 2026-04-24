import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["tab", "panel", "underline"]
  static values = { index: { type: Number, default: 0 } }

  connect() {
    this._update()
  }

  select(event) {
    const idx = parseInt(event.currentTarget.dataset.tabIndex, 10)
    this.indexValue = idx
    this._update()
  }

  _update() {
    const idx = this.indexValue

    this.tabTargets.forEach((tab, i) => {
      const active = i === idx
      tab.setAttribute("aria-selected", active)

      if (active) {
        tab.style.color = tab.dataset.activeColor || "hsl(155,18%,16%)"
      } else {
        tab.style.color = tab.dataset.inactiveColor || "rgba(0,0,0,0.38)"
      }
    })

    this.panelTargets.forEach((panel, i) => {
      panel.classList.toggle("hidden", i !== idx)
    })

    // Animate underline position
    if (this.hasUnderlineTarget && this.tabTargets[idx]) {
      const tab = this.tabTargets[idx]
      const underline = this.underlineTarget
      underline.style.left = `${tab.offsetLeft}px`
      underline.style.width = `${tab.offsetWidth}px`
    }
  }
}

import { Controller } from "@hotwired/stimulus"

// Tab switching, show/hide scenario panels.
export default class extends Controller {
  static targets = ["tab", "panel"]

  connect() {
    this.show(0)
  }

  select(event) {
    const index = parseInt(event.currentTarget.dataset.index)
    this.show(index)
  }

  show(index) {
    this.tabTargets.forEach((tab, i) => {
      const isActive = i === index
      tab.style.background = isActive ? "#1a6044" : "rgba(25,41,32,0.04)"
      tab.style.color = isActive ? "#f7f9f8" : "rgba(25,41,32,0.60)"
      tab.style.borderColor = isActive ? "#1a6044" : "rgba(25,41,32,0.09)"
    })
    this.panelTargets.forEach((panel, i) => {
      panel.style.display = i === index ? "" : "none"
    })
  }
}

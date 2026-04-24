import { Controller } from "@hotwired/stimulus"

// Scattered dashboard cards collapse into a single gauge after 1.2s delay.
// Triggered by IntersectionObserver.
export default class extends Controller {
  static targets = ["cards", "gauge"]

  connect() {
    this.collapsed = false
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.timeout = setTimeout(() => this.collapse(), 1200)
        this.observer.disconnect()
      }
    }, { threshold: 0.3 })
    this.observer.observe(this.element)
  }

  disconnect() {
    if (this.observer) this.observer.disconnect()
    if (this.timeout) clearTimeout(this.timeout)
  }

  collapse() {
    this.collapsed = true
    if (this.hasCardsTarget) this.cardsTarget.style.display = "none"
    if (this.hasGaugeTarget) {
      this.gaugeTarget.style.display = "flex"
      this.gaugeTarget.style.animation = "hv2-collapse-in 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards"
    }
  }
}

import { Controller } from "@hotwired/stimulus"

// Animated counter with easing. Triggered by IntersectionObserver.
export default class extends Controller {
  static targets = ["number"]
  static values = { from: { type: Number, default: 0 }, to: { type: Number, default: 10000 }, duration: { type: Number, default: 2000 }, suffix: { type: String, default: "" } }

  connect() {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { this.animate(); this.observer.disconnect() }
    }, { threshold: 0.3 })
    this.observer.observe(this.element)
  }

  disconnect() {
    if (this.observer) this.observer.disconnect()
    if (this.raf) cancelAnimationFrame(this.raf)
  }

  animate() {
    const start = performance.now()
    const from = this.fromValue, to = this.toValue, dur = this.durationValue
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      const val = Math.round(from + (to - from) * eased)
      if (this.hasNumberTarget) this.numberTarget.textContent = val.toLocaleString() + this.suffixValue
      if (p < 1) this.raf = requestAnimationFrame(tick)
    }
    this.raf = requestAnimationFrame(tick)
  }
}

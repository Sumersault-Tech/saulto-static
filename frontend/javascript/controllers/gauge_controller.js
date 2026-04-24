import { Controller } from "@hotwired/stimulus"

// SVG circle gauge with animated counter, triggered by IntersectionObserver.
// Usage: data-controller="gauge" data-gauge-value-value="87" data-gauge-size-value="180"
export default class extends Controller {
  static values = { value: { type: Number, default: 87 }, size: { type: Number, default: 180 }, color: { type: String, default: "#1E6B3C" }, animated: { type: Boolean, default: true } }
  static targets = ["number", "arc"]

  connect() {
    this.displayed = this.animatedValue ? 0 : this.valueValue
    this.render()
    if (this.animatedValue) {
      this.observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { this.animate(); this.observer.disconnect() }
      }, { threshold: 0.3 })
      this.observer.observe(this.element)
    }
  }

  disconnect() {
    if (this.observer) this.observer.disconnect()
    if (this.raf) cancelAnimationFrame(this.raf)
  }

  render() {
    const size = this.sizeValue
    const r = (size / 2) * 0.72
    const circ = 2 * Math.PI * r
    const arc = circ * 0.75
    const pct = this.displayed / 100
    const filled = pct * arc

    if (this.hasArcTarget) {
      this.arcTarget.setAttribute("stroke-dasharray", `${filled} ${circ}`)
    }
    if (this.hasNumberTarget) {
      this.numberTarget.textContent = `${this.displayed}%`
    }
  }

  animate() {
    const duration = 900
    const startTime = performance.now()
    const target = this.valueValue
    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      this.displayed = Math.round(eased * target)
      this.render()
      if (t < 1) this.raf = requestAnimationFrame(tick)
    }
    this.raf = requestAnimationFrame(tick)
  }
}

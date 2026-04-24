import { Controller } from "@hotwired/stimulus"

// SVG bell curve with pathLength animation + delayed fill fade-in.
export default class extends Controller {
  static targets = ["curve", "hitFill", "missFill"]

  connect() {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.element.classList.add("is-animated")
        this.observer.disconnect()
      }
    }, { threshold: 0.3 })
    this.observer.observe(this.element)
  }

  disconnect() {
    if (this.observer) this.observer.disconnect()
  }
}

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    delay: { type: Number, default: 0 },
    threshold: { type: Number, default: 0.15 },
  }

  connect() {
    // Apply delay as transition-delay
    if (this.delayValue > 0) {
      this.element.style.transitionDelay = `${this.delayValue}s`
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            this.observer.unobserve(entry.target)
          }
        })
      },
      { threshold: this.thresholdValue }
    )

    this.observer.observe(this.element)
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}

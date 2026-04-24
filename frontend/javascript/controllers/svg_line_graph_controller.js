import { Controller } from "@hotwired/stimulus"

// SVG pathLength draw-on animation. Triggered by IntersectionObserver.
// Elements with data-svg-line-graph-target="path" get animated stroke.
export default class extends Controller {
  static targets = ["path"]

  connect() {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.draw()
        this.observer.disconnect()
      }
    }, { threshold: 0.3 })
    this.observer.observe(this.element)
  }

  disconnect() {
    if (this.observer) this.observer.disconnect()
  }

  draw() {
    this.pathTargets.forEach(path => {
      path.classList.add("is-drawn")
    })
  }
}

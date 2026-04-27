import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.element.remove()
      document.body.classList.remove("intro-active")
      document.body.style.overflow = ""
      return
    }

    document.body.classList.add("intro-active")
    document.body.style.overflow = "hidden"

    this.timer = setTimeout(() => this.dismiss(), 3000)
  }

  dismiss() {
    if (this.dismissed) return
    this.dismissed = true
    clearTimeout(this.timer)

    this.element.style.animation = "intro-exit 0.85s cubic-bezier(0.76, 0, 0.24, 1) forwards"

    this.element.addEventListener("animationend", () => {
      document.body.classList.remove("intro-active")
      document.body.style.overflow = ""
      this.element.remove()
    }, { once: true })
  }

  disconnect() {
    clearTimeout(this.timer)
  }
}

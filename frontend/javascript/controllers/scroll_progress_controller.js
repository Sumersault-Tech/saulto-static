import { Controller } from "@hotwired/stimulus"

// Fixed top bar width tracks scroll percentage.
export default class extends Controller {
  static targets = ["bar"]

  connect() {
    this.onScroll = this.onScroll.bind(this)
    window.addEventListener("scroll", this.onScroll, { passive: true })
    this.onScroll()
  }

  disconnect() {
    window.removeEventListener("scroll", this.onScroll)
  }

  onScroll() {
    const el = document.documentElement
    const total = el.scrollHeight - el.clientHeight
    const progress = total > 0 ? el.scrollTop / total : 0
    if (this.hasBarTarget) {
      this.barTarget.style.width = `${progress * 100}%`
    }
  }
}

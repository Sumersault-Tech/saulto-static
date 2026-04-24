import { Controller } from "@hotwired/stimulus"

// IntersectionObserver updates active dot, click scrolls to section.
export default class extends Controller {
  static targets = ["dot"]

  connect() {
    this.observers = []
    this.dotTargets.forEach(dot => {
      const sectionId = dot.dataset.section
      const el = document.getElementById(sectionId)
      if (!el) return
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) this.setActive(sectionId)
      }, { threshold: 0.25 })
      obs.observe(el)
      this.observers.push(obs)
    })
  }

  disconnect() {
    this.observers.forEach(o => o.disconnect())
  }

  setActive(id) {
    this.dotTargets.forEach(dot => {
      const isActive = dot.dataset.section === id
      dot.style.width = isActive ? "10px" : "7px"
      dot.style.height = isActive ? "10px" : "7px"
      dot.style.background = isActive ? "#1a6044" : "transparent"
      dot.style.borderColor = isActive ? "#1a6044" : "rgba(25,41,32,0.38)"
    })
  }

  scrollTo(event) {
    const sectionId = event.currentTarget.dataset.section
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }
}

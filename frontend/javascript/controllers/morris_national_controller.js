import { Controller } from "@hotwired/stimulus"

// Phase state machine for morris-national interactive case study.
// Manages keyboard (arrows/space), touch swipe, and button navigation.
// Shows/hides phase panels via class toggling.
export default class extends Controller {
  static targets = ["phase", "stepLabel", "navLabel"]
  static values = { phase: { type: String, default: "hero" }, step: { type: Number, default: 1 }, totalSteps: { type: Number, default: 5 } }

  connect() {
    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
    window.addEventListener("keydown", this.handleKeydown)
    this.element.addEventListener("touchstart", this.handleTouchStart, { passive: true })
    this.element.addEventListener("touchend", this.handleTouchEnd, { passive: true })
    this.showCurrentPhase()
  }

  disconnect() {
    window.removeEventListener("keydown", this.handleKeydown)
    this.element.removeEventListener("touchstart", this.handleTouchStart)
    this.element.removeEventListener("touchend", this.handleTouchEnd)
  }

  handleKeydown(e) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); this.advance() }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); this.back() }
  }

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX
    this.touchStartY = e.touches[0].clientY
  }

  handleTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - this.touchStartX
    const dy = Math.abs(e.changedTouches[0].clientY - this.touchStartY)
    if (Math.abs(dx) > 44 && dy < 60) {
      if (dx < 0) this.advance()
      else this.back()
    }
  }

  advance() {
    const phases = ["hero", "value", "prologue", "modeling", "steps", "result"]
    const idx = phases.indexOf(this.phaseValue)
    if (this.phaseValue === "steps") {
      if (this.stepValue < this.totalStepsValue) {
        this.stepValue++
      } else {
        this.phaseValue = "result"
      }
    } else if (idx < phases.length - 1) {
      this.phaseValue = phases[idx + 1]
      if (this.phaseValue === "steps") this.stepValue = 1
    }
    this.showCurrentPhase()
  }

  back() {
    const phases = ["hero", "value", "prologue", "modeling", "steps", "result"]
    if (this.phaseValue === "result") {
      this.phaseValue = "steps"
      this.stepValue = this.totalStepsValue
    } else if (this.phaseValue === "steps") {
      if (this.stepValue > 1) {
        this.stepValue--
      } else {
        this.phaseValue = "modeling"
      }
    } else {
      const idx = phases.indexOf(this.phaseValue)
      if (idx > 0) this.phaseValue = phases[idx - 1]
    }
    this.showCurrentPhase()
  }

  showCurrentPhase() {
    this.phaseTargets.forEach(el => {
      const phase = el.dataset.phase
      const step = el.dataset.step
      if (phase === this.phaseValue) {
        if (phase === "steps") {
          el.style.display = parseInt(step) === this.stepValue ? "" : "none"
        } else {
          el.style.display = ""
        }
      } else {
        el.style.display = "none"
      }
    })
    // Update step label
    if (this.hasStepLabelTarget) {
      this.stepLabelTarget.textContent = `Inside Morris National · ${this.stepValue} of ${this.totalStepsValue}`
      this.stepLabelTarget.style.display = this.phaseValue === "steps" ? "" : "none"
    }
    // Update nav label
    if (this.hasNavLabelTarget) {
      this.navLabelTarget.textContent = this.phaseValue === "modeling" ? "How Saulto connects" : ""
      this.navLabelTarget.style.display = this.phaseValue === "modeling" ? "" : "none"
    }
    // Update progress dots
    this.element.querySelectorAll("[data-progress-dot]").forEach((dot, i) => {
      dot.style.background = (this.phaseValue === "steps" && i === this.stepValue - 1) ? "#0B3D2E" : "#deeee7"
    })
    // Show/hide progress dots container
    const dotsContainer = this.element.querySelector("[data-progress-dots]")
    if (dotsContainer) {
      dotsContainer.style.display = this.phaseValue === "steps" ? "" : "none"
    }
  }
}

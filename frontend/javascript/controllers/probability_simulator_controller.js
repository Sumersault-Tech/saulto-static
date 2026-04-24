import { Controller } from "@hotwired/stimulus"

// Step 5 interactive probability cards. Click actions update probability.
// Card state: active/next/locked. Probability: 62→74→81→87%.
export default class extends Controller {
  static targets = ["number", "bar", "hint", "card"]
  static values = { activated: { type: Number, default: 0 } }

  static probabilities = [62, 74, 81, 87]

  connect() {
    this.render()
  }

  activate(event) {
    const index = parseInt(event.currentTarget.dataset.index)
    if (index > this.activatedValue) return // locked
    if (index < this.activatedValue) {
      this.activatedValue = index // deactivate
    } else {
      this.activatedValue = index + 1 // activate next
    }
    this.render()
  }

  get currentProb() {
    const probs = [62, 74, 81, 87]
    return probs[Math.min(this.activatedValue, probs.length - 1)]
  }

  render() {
    const prob = this.currentProb
    if (this.hasNumberTarget) this.numberTarget.textContent = `${prob}%`
    if (this.hasBarTarget) this.barTarget.style.width = `${prob}%`
    if (this.hasHintTarget) {
      const hints = [
        "Tap an action below to see how the outcome changes.",
        "One action taken. Two more available.",
        "Two actions taken. One more available.",
        "All three actions taken. Revenue recovered.",
      ]
      this.hintTarget.textContent = hints[this.activatedValue]
    }
    this.cardTargets.forEach((card, i) => {
      const isActive = this.activatedValue > i
      const isNext = this.activatedValue === i
      const isLocked = this.activatedValue < i
      card.style.background = isActive ? "#e8f5ef" : "#fff"
      card.style.borderColor = isActive ? "#0B3D2E" : "#deeee7"
      card.style.opacity = isLocked ? "0.42" : "1"
      card.style.cursor = isLocked ? "default" : "pointer"
      const rangeEl = card.querySelector("[data-range]")
      if (rangeEl) rangeEl.style.display = isActive ? "" : "none"
      const tapEl = card.querySelector("[data-tap]")
      if (tapEl) tapEl.style.display = (isNext && !isActive) ? "" : "none"
    })
  }
}

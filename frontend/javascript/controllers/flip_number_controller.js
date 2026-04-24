import { Controller } from "@hotwired/stimulus"

// Toggle 62%/38% display on click.
export default class extends Controller {
  static targets = ["hit", "miss"]

  toggle() {
    const showingMiss = this.hasHitTarget && this.hitTarget.style.display === "none"
    if (this.hasHitTarget) this.hitTarget.style.display = showingMiss ? "" : "none"
    if (this.hasMissTarget) this.missTarget.style.display = showingMiss ? "none" : ""
  }
}

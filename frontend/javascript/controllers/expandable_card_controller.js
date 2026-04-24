import { Controller } from "@hotwired/stimulus"

// Click expand/collapse with max-height transition.
export default class extends Controller {
  static targets = ["content", "chevron"]

  toggle() {
    const content = this.contentTarget
    const isOpen = content.style.maxHeight && content.style.maxHeight !== "0px"
    if (isOpen) {
      content.style.maxHeight = "0px"
      content.style.opacity = "0"
      if (this.hasChevronTarget) this.chevronTarget.style.transform = "rotate(0deg)"
    } else {
      content.style.maxHeight = content.scrollHeight + "px"
      content.style.opacity = "1"
      if (this.hasChevronTarget) this.chevronTarget.style.transform = "rotate(90deg)"
    }
  }
}

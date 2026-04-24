import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["header", "mobileMenu"]

  connect() {
    this.scrolled = false
    this.mobileOpen = false
    this._onScroll = this._onScroll.bind(this)
    window.addEventListener("scroll", this._onScroll, { passive: true })
    this._onScroll()
  }

  disconnect() {
    window.removeEventListener("scroll", this._onScroll)
  }

  _onScroll() {
    const scrolled = window.scrollY > 20
    if (scrolled !== this.scrolled) {
      this.scrolled = scrolled
      this._updateStyles()
    }
  }

  toggleMobile() {
    this.mobileOpen = !this.mobileOpen
    this.mobileMenuTarget.classList.toggle("hidden", !this.mobileOpen)
  }

  closeMobile() {
    this.mobileOpen = false
    this.mobileMenuTarget.classList.add("hidden")
  }

  _updateStyles() {
    const el = this.headerTarget
    if (this.scrolled) {
      el.classList.remove("bg-transparent", "py-5")
      el.classList.add("glass-nav", "py-3")
    } else {
      el.classList.remove("glass-nav", "py-3")
      el.classList.add("bg-transparent", "py-5")
    }

    // Update logo brightness
    const logo = el.querySelector("[data-navbar-logo]")
    if (logo) {
      if (this.scrolled) {
        logo.classList.remove("brightness-0", "invert", "opacity-100")
        logo.classList.add("opacity-95")
      } else {
        logo.classList.remove("opacity-95")
        logo.classList.add("brightness-0", "invert", "opacity-100")
      }
    }

    // Update nav link colors
    el.querySelectorAll("[data-navbar-link]").forEach(link => {
      if (this.scrolled) {
        link.classList.remove("text-white/70", "hover:text-white")
        link.classList.add("text-muted-foreground", "hover:text-foreground")
      } else {
        link.classList.remove("text-muted-foreground", "hover:text-foreground")
        link.classList.add("text-white/70", "hover:text-white")
      }
    })

    // Update client login button
    const loginBtn = el.querySelector("[data-navbar-login]")
    if (loginBtn) {
      if (this.scrolled) {
        loginBtn.classList.remove("text-white/80", "hover:text-white", "border-white/25", "hover:border-white/50")
        loginBtn.classList.add("text-muted-foreground", "hover:text-foreground", "border-border", "hover:border-foreground/30")
      } else {
        loginBtn.classList.remove("text-muted-foreground", "hover:text-foreground", "border-border", "hover:border-foreground/30")
        loginBtn.classList.add("text-white/80", "hover:text-white", "border-white/25", "hover:border-white/50")
      }
    }

    // Update CTA button
    const ctaBtn = el.querySelector("[data-navbar-cta]")
    if (ctaBtn) {
      if (this.scrolled) {
        ctaBtn.classList.remove("bg-white", "text-primary", "hover:bg-white/90")
        ctaBtn.classList.add("bg-primary", "text-primary-foreground", "hover:bg-primary/90")
      } else {
        ctaBtn.classList.remove("bg-primary", "text-primary-foreground", "hover:bg-primary/90")
        ctaBtn.classList.add("bg-white", "text-primary", "hover:bg-white/90")
      }
    }

    // Update mobile toggle color
    const toggleBtn = el.querySelector("[data-navbar-toggle]")
    if (toggleBtn) {
      if (this.scrolled) {
        toggleBtn.classList.remove("text-white")
        toggleBtn.classList.add("text-foreground")
      } else {
        toggleBtn.classList.remove("text-foreground")
        toggleBtn.classList.add("text-white")
      }
    }
  }
}

import { Controller } from "@hotwired/stimulus"

// Performance curve — Y increases downward (higher Y = further from goal)
const PERF_PTS = [
  [50, 48], [200, 58], [380, 88], [550, 136], [700, 196], [900, 254], [980, 278],
]

function lerp(a, b, t) {
  return a + (b - a) * Math.max(0, Math.min(1, t))
}

function getPerfY(x) {
  for (let i = 0; i < PERF_PTS.length - 1; i++) {
    const [x0, y0] = PERF_PTS[i]
    const [x1, y1] = PERF_PTS[i + 1]
    if (x >= x0 && x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0)
  }
  return 48
}

function makeRecoveryPath(dx, dy, endY) {
  const span = 980 - dx
  const cp1x = dx + span * 0.30
  const cp1y = dy - 6
  const cp2x = dx + span * 0.68
  const cp2y = endY + 14
  return `M ${dx},${dy} C ${cp1x},${cp1y} ${cp2x},${cp2y} 980,${endY}`
}

function makeNosaultoPath(dx, dy) {
  const endY = Math.min(dy + (278 - getPerfY(dx)) * 0.85 + 20, 290)
  const span = 980 - dx
  return `M ${dx},${dy} C ${dx + span * 0.35},${dy + 18} ${dx + span * 0.7},${endY - 10} 980,${endY}`
}

const GREEN = "hsl(155,55%,42%)"
const GREEN_LIGHT = "hsl(155,68%,58%)"
const RED = "#f87171"

export default class extends Controller {
  static targets = [
    "track", "thumb", "fillLeft", "fillRight",
    "probValue", "probLabel", "probSublabel",
    "recovery", "nosaulto", "detGuide", "detDot", "detDotPulse",
    "clipBefore", "clipAfter",
    "badge", "badgeDot", "badgeText",
    "saultoLabel", "tradLabel",
  ]

  connect() {
    this.value = 0.11
    this._onPointerMove = this._onPointerMove.bind(this)
    this._onPointerUp = this._onPointerUp.bind(this)
    this._update()

    // Start chart animation after a short delay
    this._animateIn()
  }

  pointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId)
    this._updateFromEvent(e)
  }

  pointerMove(e) {
    if (e.buttons > 0) {
      this._updateFromEvent(e)
    }
  }

  _onPointerMove(e) {
    this._updateFromEvent(e)
  }

  _onPointerUp() {
    document.removeEventListener("pointermove", this._onPointerMove)
    document.removeEventListener("pointerup", this._onPointerUp)
  }

  _updateFromEvent(e) {
    const track = this.trackTarget
    const rect = track.getBoundingClientRect()
    this.value = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    this._update()
  }

  _update() {
    const v = this.value
    const detX = lerp(200, 900, v)
    const detY = getPerfY(detX)
    const recEndY = lerp(36, 220, v)
    const prob = Math.round(lerp(87, 31, v))
    const recovPath = makeRecoveryPath(detX, detY, recEndY)
    const nosaultoPath = makeNosaultoPath(detX, detY)

    const isLate = v >= 0.65
    const thumbColor = isLate ? RED : GREEN_LIGHT
    const probColor = isLate ? RED : GREEN_LIGHT

    // Slider UI
    this.thumbTarget.style.left = `${v * 100}%`
    this.thumbTarget.style.background = thumbColor
    this.thumbTarget.style.boxShadow = `0 0 0 8px ${isLate ? "rgba(248,113,113,0.22)" : "rgba(80,200,130,0.22)"}, 0 4px 20px rgba(0,0,0,0.4)`
    this.fillLeftTarget.style.width = `${v * 100}%`
    this.fillRightTarget.style.width = `${(1 - v) * 100}%`

    // Probability display
    this.probValueTarget.textContent = `${prob}%`
    this.probValueTarget.style.color = probColor

    const label = v < 0.30
      ? "Saulto catches drift early. Strong recovery."
      : v < 0.58
      ? "Mid-quarter detection. Partial recovery possible."
      : "Traditional lag. Quarter already off track."
    this.probSublabelTarget.textContent = label
    this.probSublabelTarget.style.color = probColor

    // SVG paths
    this.recoveryTarget.setAttribute("d", recovPath)
    this.nosaultoTarget.setAttribute("d", nosaultoPath)

    // Detection guide + dot
    this.detGuideTarget.setAttribute("d", `M ${detX},30 L ${detX},${detY}`)
    this.detDotTarget.setAttribute("cx", detX)
    this.detDotTarget.setAttribute("cy", detY)
    this.detDotPulseTarget.setAttribute("cx", detX)
    this.detDotPulseTarget.setAttribute("cy", detY)

    // Clip paths
    this.clipBeforeTarget.querySelector("rect").setAttribute("width", detX)
    this.clipAfterTarget.querySelector("rect").setAttribute("x", detX)

    // Badge
    const badgePct = Math.min(Math.max(((detX - 50) / 930) * 100, 6), 84)
    const badgeTop = Math.min(Math.max(((detY - 30) / 300) * 100, 4), 58)
    const badgeText = v < 0.35 ? "Saulto detects drift" : v < 0.62 ? "Detected mid-quarter" : "Traditional, end of quarter"
    const badgeColor = isLate ? RED : GREEN_LIGHT

    this.badgeTarget.style.top = `${badgeTop}%`
    this.badgeTarget.style.left = `${badgePct}%`
    this.badgeTarget.style.borderColor = `${badgeColor}40`
    this.badgeDotTarget.style.background = badgeColor
    this.badgeTextTarget.textContent = badgeText
  }

  _animateIn() {
    // Show chart elements after brief delay
    this.element.querySelectorAll("[data-drift-animate]").forEach((el, i) => {
      el.style.opacity = "0"
      setTimeout(() => {
        el.style.transition = "opacity 0.8s ease-out"
        el.style.opacity = "1"
      }, 300 + i * 100)
    })
  }
}

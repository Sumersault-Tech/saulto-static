import { Controller } from "@hotwired/stimulus"

// Canvas: 110 probabilistic paths drawn via RAF, DPR-aware.
export default class extends Controller {
  static targets = ["canvas"]
  static values = { width: { type: Number, default: 420 }, height: { type: Number, default: 158 }, goalFrac: { type: Number, default: 0.44 } }

  connect() {
    const N = 110, STEPS = 60
    const rng = (s) => { const x = Math.sin(s) * 43758.5453; return x - Math.floor(x) }
    this.paths = Array.from({ length: N }, (_, i) => {
      const pts = [0.52]
      for (let s = 1; s <= STEPS; s++) {
        const vol = 0.016 + rng(42 + i * 100 + s * 7) * 0.011
        const noise = (rng(42 + i * 200 + s * 13) - 0.5) * 2 * vol
        pts.push(Math.max(0.02, Math.min(0.98, pts[s - 1] + 0.002 + noise)))
      }
      return pts
    })
    this.drawn = 0
    this.N = N
    this.STEPS = STEPS

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { this.animate(); this.observer.disconnect() }
    }, { threshold: 0.3 })
    this.observer.observe(this.element)
  }

  disconnect() {
    if (this.observer) this.observer.disconnect()
    if (this.raf) cancelAnimationFrame(this.raf)
  }

  animate() {
    const canvas = this.canvasTarget
    const ctx = canvas.getContext("2d")
    const w = this.widthValue, h = this.heightValue, goalFrac = this.goalFracValue
    const dpr = window.devicePixelRatio || 1
    canvas.width = w * dpr; canvas.height = h * dpr
    ctx.scale(dpr, dpr)
    const pad = { l: 16, r: 16, t: 10, b: 20 }
    const toX = (s) => pad.l + (s / this.STEPS) * (w - pad.l - pad.r)
    const toY = (v) => h - pad.b - v * (h - pad.t - pad.b)
    const goalY = toY(goalFrac)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      this.drawn = Math.min(this.drawn + 4, this.N)
      for (let i = 0; i < this.drawn; i++) {
        const pts = this.paths[i]
        const hit = pts[this.STEPS] > goalFrac
        ctx.beginPath(); ctx.moveTo(toX(0), toY(pts[0]))
        for (let s = 1; s <= this.STEPS; s++) ctx.lineTo(toX(s), toY(pts[s]))
        ctx.strokeStyle = hit ? "rgba(26,96,68,0.42)" : "rgba(25,41,32,0.05)"
        ctx.lineWidth = hit ? 0.7 : 0.5; ctx.stroke()
      }
      ctx.setLineDash([4, 4]); ctx.beginPath()
      ctx.moveTo(toX(0), goalY); ctx.lineTo(toX(this.STEPS), goalY)
      ctx.strokeStyle = "rgba(115,95,50,0.55)"; ctx.lineWidth = 1; ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = "rgba(115,95,50,0.75)"
      ctx.font = "9px Inter,system-ui"; ctx.fillText("GOAL", toX(this.STEPS) - 28, goalY - 5)
      ctx.beginPath(); ctx.moveTo(toX(0), h - pad.b); ctx.lineTo(toX(this.STEPS), h - pad.b)
      ctx.strokeStyle = "rgba(25,41,32,0.09)"; ctx.lineWidth = 1; ctx.stroke()
      if (this.drawn < this.N) this.raf = requestAnimationFrame(draw)
    }
    this.raf = requestAnimationFrame(draw)
  }
}

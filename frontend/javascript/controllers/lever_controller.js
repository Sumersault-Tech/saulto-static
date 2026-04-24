import { Controller } from "@hotwired/stimulus"

// 3 sliders → compute probability → update SVG distribution curve.
export default class extends Controller {
  static targets = ["closeRate", "pipeline", "retention", "probability", "projected", "curve", "hitArea", "missArea", "impact", "impactDetail", "resetBtn"]
  static values = { goalFrac: { type: Number, default: 0.50 } }

  connect() {
    this.update()
  }

  update() {
    const cr = this.hasCloseRateTarget ? parseInt(this.closeRateTarget.value) : 0
    const pl = this.hasPipelineTarget ? parseInt(this.pipelineTarget.value) : 0
    const rt = this.hasRetentionTarget ? parseInt(this.retentionTarget.value) : 0

    const totalImpact = cr * 1.2 + pl * 0.55 + rt * 0.65
    const probability = Math.min(95, Math.round(62 + totalImpact))

    if (this.hasProjectedTarget) this.projectedTarget.textContent = `${probability}%`
    if (this.hasProjectedTarget) {
      this.projectedTarget.style.color = probability > 76 ? "#1a6044" : probability > 68 ? "#2b7a52" : "#995018"
    }

    // Update slider labels
    this.element.querySelectorAll("[data-slider-value]").forEach(el => {
      const name = el.dataset.sliderValue
      const val = name === "closeRate" ? cr : name === "pipeline" ? pl : rt
      el.textContent = val > 0 ? `+${val}%` : "no change"
      el.style.color = val > 0 ? "#1a6044" : "rgba(25,41,32,0.38)"
    })

    // Update impact display
    if (this.hasImpactTarget) {
      this.impactTarget.style.display = totalImpact > 0 ? "" : "none"
      if (this.hasImpactTarget) {
        const impactNum = this.impactTarget.querySelector("[data-impact-num]")
        if (impactNum) impactNum.textContent = `+${Math.round(totalImpact)}pp`
      }
    }
    if (this.hasResetBtnTarget) this.resetBtnTarget.style.display = totalImpact > 0 ? "" : "none"

    // Update SVG distribution curve
    const mu = 0.30 + (probability / 100) * 0.40
    const sigma = 0.155
    const W = 400, H = 80, goalFrac = this.goalFracValue
    const normalPdf = (x) => Math.exp(-0.5 * ((x - mu) / sigma) ** 2)

    const N = 80; let maxY = 0
    const ys = Array.from({ length: N + 1 }, (_, i) => { const y = normalPdf(i / N); if (y > maxY) maxY = y; return y })
    const curvePath = Array.from({ length: N + 1 }, (_, i) =>
      `${i === 0 ? "M" : "L"} ${((i / N) * W).toFixed(1)} ${(H - (ys[i] / maxY) * H * 0.84).toFixed(1)}`
    ).join(" ")

    const pts = Array.from({ length: N + 1 }, (_, i) => [i / N, ys[i]])
    const hitPts = pts.filter(([x]) => x >= goalFrac)
    const missPts = pts.filter(([x]) => x <= goalFrac)

    const hitPath = hitPts.length >= 2
      ? `M ${goalFrac * W} ${H} ` + hitPts.map(([x, y]) => `L ${(x * W).toFixed(1)} ${(H - (y / maxY) * H * 0.84).toFixed(1)}`).join(" ") + ` L ${W} ${H} Z`
      : ""
    const missPath = missPts.length >= 2
      ? `M 0 ${H} ` + missPts.map(([x, y]) => `L ${(x * W).toFixed(1)} ${(H - (y / maxY) * H * 0.84).toFixed(1)}`).join(" ") + ` L ${(goalFrac * W).toFixed(0)} ${H} Z`
      : ""

    if (this.hasCurveTarget) this.curveTarget.setAttribute("d", curvePath)
    if (this.hasHitAreaTarget) this.hitAreaTarget.setAttribute("d", hitPath)
    if (this.hasMissAreaTarget) this.missAreaTarget.setAttribute("d", missPath)
  }

  reset() {
    if (this.hasCloseRateTarget) this.closeRateTarget.value = 0
    if (this.hasPipelineTarget) this.pipelineTarget.value = 0
    if (this.hasRetentionTarget) this.retentionTarget.value = 0
    this.update()
  }
}

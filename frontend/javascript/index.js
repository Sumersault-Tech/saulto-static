import "$styles/index.css"

import { Application } from "@hotwired/stimulus"

// Import all JavaScript & CSS files from src/_components
import components from "$components/**/*.{js,jsx,js.rb,css}"

// Stimulus setup
const application = Application.start()

// Import controllers
import NavbarController from "./controllers/navbar_controller.js"
import RevealController from "./controllers/reveal_controller.js"
import TabsController from "./controllers/tabs_controller.js"
import DriftSliderController from "./controllers/drift_slider_controller.js"
import PlatformStoryController from "./controllers/platform_story_controller.js"
import PrintController from "./controllers/print_controller.js"
import GaugeController from "./controllers/gauge_controller.js"
import DashboardChaosController from "./controllers/dashboard_chaos_controller.js"

application.register("navbar", NavbarController)
application.register("reveal", RevealController)
application.register("tabs", TabsController)
application.register("drift-slider", DriftSliderController)
application.register("platform-story", PlatformStoryController)
application.register("print", PrintController)
application.register("gauge", GaugeController)
application.register("dashboard-chaos", DashboardChaosController)

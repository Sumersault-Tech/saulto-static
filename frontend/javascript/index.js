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
import MorrisNationalController from "./controllers/morris_national_controller.js"
import ProbabilitySimulatorController from "./controllers/probability_simulator_controller.js"
import SvgLineGraphController from "./controllers/svg_line_graph_controller.js"
import ScrollProgressController from "./controllers/scroll_progress_controller.js"
import SectionNavController from "./controllers/section_nav_controller.js"
import PathFanController from "./controllers/path_fan_controller.js"
import CounterController from "./controllers/counter_controller.js"
import BellCurveController from "./controllers/bell_curve_controller.js"
import FlipNumberController from "./controllers/flip_number_controller.js"
import ExpandableCardController from "./controllers/expandable_card_controller.js"
import LeverController from "./controllers/lever_controller.js"
import ScenarioTabsController from "./controllers/scenario_tabs_controller.js"

application.register("navbar", NavbarController)
application.register("reveal", RevealController)
application.register("tabs", TabsController)
application.register("drift-slider", DriftSliderController)
application.register("platform-story", PlatformStoryController)
application.register("print", PrintController)
application.register("gauge", GaugeController)
application.register("dashboard-chaos", DashboardChaosController)
application.register("morris-national", MorrisNationalController)
application.register("probability-simulator", ProbabilitySimulatorController)
application.register("svg-line-graph", SvgLineGraphController)
application.register("scroll-progress", ScrollProgressController)
application.register("section-nav", SectionNavController)
application.register("path-fan", PathFanController)
application.register("counter", CounterController)
application.register("bell-curve", BellCurveController)
application.register("flip-number", FlipNumberController)
application.register("expandable-card", ExpandableCardController)
application.register("lever", LeverController)
application.register("scenario-tabs", ScenarioTabsController)

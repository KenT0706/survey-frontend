// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import ManagementAssessment from "../components/ManagementAssessment.vue";
import HRSelfAssessment from "../components/HRSelfAssessment.vue";
import UserSurvey from "../components/UserSurvey.vue";
import ResultsDashboard from "../views/ResultsDashboard.vue";
import AdminLogin from "../views/AdminLogin.vue";

const routes = [
  { path: "/management", component: ManagementAssessment },
  { path: "/self-assessment", component: HRSelfAssessment },
  { path: "/user-survey", component: UserSurvey },
  { path: "/admin-login", component: AdminLogin },
  { path: "/dashboard", component: ResultsDashboard },
  { path: "/:pathMatch(.*)*", redirect: "/management" }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
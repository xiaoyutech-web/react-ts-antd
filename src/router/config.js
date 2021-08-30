import Login from "../views/Login.tsx";
import Home from "../views/Home.tsx";
import NotFound from "../components/404.tsx";
import Rank from "@/views/Rank";
import Audit from "@/views/Audit";
import { viewUrl } from "@/utils/url";
export const routerConfig = [
  {
    path: viewUrl + "/",
    component: Home,
    auth: true,
  },
  {
    path: viewUrl + "/login",
    component: Login,
  },
  {
    path: viewUrl + "/rank",
    component: Rank,
  },
  {
    path: viewUrl + "/audit",
    component: Audit,
  },
  {
    path: viewUrl + "/404",
    component: NotFound,
    auth: true,
  },
];

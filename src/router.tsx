import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import SystemMenuLayout from "./pages/system/system/menu/layout";

// 懒加载路由组件
const RootLayout = lazy(() => import("./pages/__root"));
const SystemLayout = lazy(() => import("./pages/system/layout"));
const Index = lazy(() => import("./pages/index"));
const SystemWelcomePage = lazy(() => import("./pages/system/welcome/page"));
const SystemDashboardPage = lazy(() => import("./pages/system/dashboard/page"));
const SystemRolePage = lazy(() => import("./pages/system/system/role/page"));
const SystemPermissionPage = lazy(() => import("./pages/system/system/permission/page"));
const SystemShortsTagsPage = lazy(() => import("./pages/system/shorts/tags/page"));
const SystemShortsSeriesPage = lazy(() => import("./pages/system/shorts/series/page"));
const SystemAdminUserPage = lazy(() => import("./pages/system/admin/user/page"));
const SystemAdminTaskPage = lazy(() => import("./pages/system/admin/task/page"));

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/system",
        element: <SystemLayout />,
        children: [
          {
            path: "welcome",
            element: <SystemWelcomePage />,
          },
          {
            path: "dashboard",
            element: <SystemDashboardPage />,
          },
          {
            path: "system/role",
            element: <SystemRolePage />,
          },
          {
            path: "system/permission",
            element: <SystemPermissionPage />,
          },
          {
            path: "system/menu",
            element: <SystemMenuLayout/>
          },
          {
            path: "shorts/tags",
            element: <SystemShortsTagsPage />,
          },
          {
            path: "shorts/series",
            element: <SystemShortsSeriesPage />,
          },
          {
            path: "admin/user",
            element: <SystemAdminUserPage />,
          },
          {
            path: "admin/task",
            element: <SystemAdminTaskPage />,
          },
        ],
      },
    ],
  },
]);

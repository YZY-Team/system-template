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
const SystemPermissionPage = lazy(
  () => import("./pages/system/system/permission/page")
);
const SystemAdminUserPage = lazy(
  () => import("./pages/system/admin/user/page")
);

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
            element: <SystemMenuLayout />,
          },
          {
            path: "admin/user",
            element: <SystemAdminUserPage />,
          },
        ],
      },
    ],
  },
]);

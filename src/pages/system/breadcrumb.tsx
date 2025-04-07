

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Fragment } from "react";
import { useLocation } from "react-router-dom";

/**
 * 面包屑组件
 * 用于显示当前页面在网站层级结构中的位置
 */
export const BreadcrumbComponent = () => {
  // 获取当前路径
  const location = useLocation();
  const pathname = location.pathname;
  // 分割路径，去除前两个段（通常是空字符串和 'dashboard'）
  const pathSegments = pathname.split("/").splice(2);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          return (
            <Fragment key={index}>
              {/* 除了第一个段外，其他段前添加分隔符 */}
              {index !== 0 && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                  className={
                    // 如果是最后一个段，应用不同的样式
                    pathSegments[pathSegments.length - 1] === segment
                      ? "font-bold text-foreground"
                      : ""
                  }
                >
                  {/* 将段的首字母大写 */}
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};



import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * ModeToggle 组件
 * 用于切换主题模式（亮色、暗色、系统）
 */
export function ModeToggle() {
  return (
    <DropdownMenu>
      {/* 触发器按钮 */}
      <DropdownMenuTrigger asChild className="ml-auto">
        <Button variant="outline" size="icon">
          {/* 太阳图标：亮色模式 */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          {/* 月亮图标：暗色模式 */}
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      {/* 下拉菜单内容 */}
      <DropdownMenuContent align="end">
        {/* 亮色模式选项 */}
        <DropdownMenuItem onClick={() => {}}>Light</DropdownMenuItem>
        {/* 暗色模式选项 */}
        <DropdownMenuItem onClick={() => {}}>Dark</DropdownMenuItem>
        {/* 系统模式选项 */}
        <DropdownMenuItem onClick={() => {}}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

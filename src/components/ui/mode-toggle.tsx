import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
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
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      {/* 触发器按钮 */}
      <DropdownMenuTrigger asChild className="ml-auto">
        <Button variant="outline" size="icon">
          {/* 太阳图标：亮色模式 */}
          <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
          {/* 月亮图标：暗色模式 */}
          <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
          {/* 系统图标：系统模式 */}
          <Monitor className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${theme === 'system' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      {/* 下拉菜单内容 */}
      <DropdownMenuContent align="end">
        {/* 亮色模式选项 */}
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          亮色
        </DropdownMenuItem>
        {/* 暗色模式选项 */}
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          暗色
        </DropdownMenuItem>
        {/* 系统模式选项 */}
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

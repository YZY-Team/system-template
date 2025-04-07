'use client';

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (result.code === 200) {
        toast.success("退出成功，正在跳转...");
        window.location.href = '/';
      } else {
        toast.error("退出失败", {
          description: result.message || "退出登录时发生错误"
        });
      }
    } catch (error) {
      console.error('退出登录失败:', error);
      toast.error("退出失败", {
        description: "退出登录时发生错误"
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start gap-2 px-2 hover:bg-muted"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      <span>退出登录</span>
    </Button>
  );
} 


import { Login } from "@/api/auth";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { useMutation } from "@tanstack/react-query";
import type { HTMLAttributes } from "react";
import { useRef } from "react";

/**
 * 用户登录表单属性
 */
type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

/**
 * 用户登录表单
 * @param className 类名
 * @param props 其他属性
 * @returns 返回用户登录表单
 */
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const username = useRef("");
  const password = useRef("");
  const otp = useRef("");

  interface LoginResponse {
    code: number;
    data: {
      token?: string;
    };
    message: string;
  }

  const { mutate: login, isPending } = useMutation({
    mutationKey: ["login"],
    // @ts-expect-error 这里是 useMutation
    mutationFn: () =>
      Login({
        username: username.current,
        password: password.current,
        otp: otp.current,
      }),
    onSuccess: (data: LoginResponse) => {
      if (data.code === 200) {
        toast("登录成功");
        
        // 登录成功后直接跳转
        window.location.href = '/system/shorts/series';
      } else {
        toast("登录失败");
      }
    },
    onError: (error: Error) => {
      toast(error.message);
    },
  });
  async function onLogin(event: React.SyntheticEvent) {
    event.preventDefault();
    login();
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onLogin} method="post">
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Input
              id="username"
              name="username"
              placeholder="ACCOUNT"
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              onChange={(event) => (username.current = event.target.value)}
              disabled={isPending}
              required
            />
          </div>
          <div className="grid gap-1">
            <Input
              id="password"
              name="password"
              placeholder="PASSWORD"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck="false"
              onChange={(event) => (password.current = event.target.value)}
              disabled={isPending}
              required
            />
          </div>
          <div className="grid gap-1">
            <Input
              id="otp"
              name="otp"
              placeholder="OTP"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              onChange={(event) => (otp.current = event.target.value)}
              disabled={isPending}
              required
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          {/* <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span> */}
        </div>
      </div>
      {/* <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        GitHub
      </Button> */}
    </div>
  );
}

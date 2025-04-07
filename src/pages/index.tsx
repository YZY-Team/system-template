import { UserAuthForm } from "@/components/user-auth-form";

/**
 * 元数据
 */

/**
 * 登录页面
 * @returns 返回登录页面
 */
export default function AuthenticationPage() {
  return (
    <div className="container  relative flex h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* 左侧品牌展示区 */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          MEME SHORT
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;短剧管理系统让内容创作变得更加简单高效，
              帮助创作者专注于制作优质内容。&rdquo;
            </p>
            <footer className="text-sm">MEME TEAM</footer>
          </blockquote>
        </div>
      </div>

      {/* 右侧登录表单区 */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">账号登录</h1>
            <p className="text-sm text-muted-foreground">
              请输入您的账号信息进行登录
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            通过登录，即表示您同意我们的{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              服务条款
            </a>{" "}
            和{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              隐私政策
            </a>
            。
          </p>
        </div>
      </div>
    </div>
  );
}

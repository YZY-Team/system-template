

import { getShortSeries } from "@/api/short-series";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Edit2, Film, Globe, Plus, Clock } from "lucide-react";
import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CreateAndEditSeries } from "./createAndEditSeries";
import { ConfigureEpisodes } from "./configureEpisodes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import debounce from "lodash/debounce";
// 移除 next/image 导入
// import Image from "next/image";
import { ShortSerieInfo } from "@/types/short-series";

export const ShortSeries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const debouncedSearch = useCallback((value: string) => {
    const debouncedFn = debounce((searchValue: string) => {
      setDebouncedSearchQuery(searchValue);
    }, 300);
    debouncedFn(value);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["shortSeries", debouncedSearchQuery, priceFilter, statusFilter],
    queryFn: ({ pageParam = 1 }) =>
      getShortSeries({
        pageNum: pageParam,
        pageSize: 20,
        title: debouncedSearchQuery || undefined,
        isFree: priceFilter === "all" ? undefined : priceFilter === "free",
        isActive:
          statusFilter === "all" ? undefined : statusFilter === "active",
      }),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? lastPage.data.current + 1 : undefined,
    initialPageParam: 1,
  });

  const allSeries = data?.pages.flatMap((page) => page.data.records) ?? [];

  return (
    <div className="space-y-8">
      {/* 头部区域 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">短视频系列</h2>
          <p className="text-gray-500 mt-1">管理您的短视频内容</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              创建新系列
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>创建新系列</DialogTitle>
              <DialogDescription>
                在这里创建一个新的短视频系列
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <CreateAndEditSeries
                isEdit={false}
                onSuccess={() => setDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 筛选工具栏 */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索系列名称..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8"
            />
            {isLoading && (
              <div className="absolute right-2 top-2.5 text-sm text-muted-foreground">
                搜索中...
              </div>
            )}
          </div>
        </div>
        <Select value={priceFilter} onValueChange={setPriceFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="价格筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部价格</SelectItem>
            <SelectItem value="free">免费</SelectItem>
            <SelectItem value="paid">付费</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="active">已激活</SelectItem>
            <SelectItem value="inactive">未激活</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 系列列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {allSeries.map((series) => (
          <Card
            key={series.seriesId}
            className="group overflow-hidden border hover:border-gray-300 transition-all duration-300"
          >
            {/* 封面图片区域 */}
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              {series.coverImageUrl ? (
                <img
                  src={series.coverImageUrl}
                  alt={series.title}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.parentElement?.classList.add(
                      "flex",
                      "items-center",
                      "justify-center"
                    );
                    target.parentElement!.innerHTML = `
                      <div class="text-gray-400 flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span class="text-sm">暂无图片</span>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-gray-400 flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm">暂无图</span>
                  </div>
                </div>
              )}
              <Badge
                className={cn(
                  "absolute top-3 right-3 px-2 py-1",
                  series.isActive
                    ? "bg-green-500/90 hover:bg-green-600"
                    : "bg-gray-500/90 hover:bg-gray-600"
                )}
              >
                {series.isActive ? "已激活" : "未激活"}
              </Badge>
            </div>

            {/* 内容区域 */}
            <CardHeader>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold line-clamp-1">
                  {series.title}
                </h3>
                <Badge variant="outline">{series.genre || "未分类"}</Badge>
              </div>
              <p className="text-gray-500 text-sm line-clamp-2">
                {series.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{series.releaseDate || "未设置"}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Globe className="w-4 h-4 mr-2" />
                  <span>{series.language || "未设置"}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 pt-4 border-t">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Film className="w-4 h-4 mr-2" />
                    配置剧集
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[90vw] sm:max-w-[900px]"
                >
                  <SheetHeader>
                    <SheetTitle>配置剧集 - {series.title}</SheetTitle>
                    <SheetDescription>
                      管理短视频系列的剧集和上传视频
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 h-[calc(100vh-180px)] overflow-y-auto">
                    <ConfigureEpisodes seriesId={String(series.seriesId)} />
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-4 h-4 mr-2" />
                    编辑
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[90vw] sm:max-w-[720px] overflow-y-auto"
                >
                  <SheetHeader>
                    <SheetTitle>编辑系列</SheetTitle>
                    <SheetDescription>修改短视频系列的信息</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <CreateAndEditSeries
                      isEdit={true}
                      series={
                        {
                          ...series,
                          id: series.seriesId,
                        } as ShortSerieInfo
                      }
                      onSuccess={() => {
                        // 这里的关闭逻辑会由 SheetClose 组件自动处理
                      }}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* 加载更多 */}
      {hasNextPage && (
        <div className="flex justify-center py-4">
          <Button variant="outline" onClick={() => fetchNextPage()}>
            加载更多
          </Button>
        </div>
      )}
    </div>
  );
};

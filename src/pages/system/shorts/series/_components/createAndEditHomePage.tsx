

import {
  createShortHomepage,
  updateShortHomepage,
} from "@/api/short-homepage";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ShortHomepage } from "@/types/short-homepage";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getShortSeries } from "@/api/short-series";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// 移除 next/image 导入
// import Image from "next/image";
import {
  Search as SearchIcon,
  Loader2,
  Calendar,
  ArrowDown,
  Image as ImageIcon,
  Eye,
  EyeOff,
  FileText,
  Settings2,
  CalendarOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface CreateAndEditHomePageProps {
  carousel?: ShortHomepage;
  isEdit: boolean;
  onSuccess?: () => void;
}

export const CreateAndEditHomePage = ({
  carousel,
  isEdit,
  onSuccess,
}: CreateAndEditHomePageProps) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // 表单定义
  const formSchema = z.object({
    seriesId: z.string().min(1, "请选择关联系列"),
    position: z.number().min(1, "请输入位置"),
    isActive: z.boolean(),
    description: z.string().min(1, "请输入描述"),
    title: z.string().min(1, "请输入标题"),
    imageUrl: z.string(),
    displayStartTime: z.string(),
    displayEndTime: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      seriesId: carousel?.seriesId || "",
      position: carousel?.position || 1,
      isActive: carousel?.isActive || false,
      description: carousel?.description || "",
      title: carousel?.title || "",
      imageUrl: carousel?.imageUrl || "",
      displayStartTime: carousel?.displayStartTime || new Date().toISOString().slice(0, 16),
      displayEndTime: carousel?.displayEndTime || new Date().toISOString().slice(0, 16),
    },
  });

  // 获取系列列表
  const { data: seriesData, isLoading } = useQuery({
    queryKey: ["series-list", searchQuery],
    queryFn: async () => {
      const response = await getShortSeries({ 
        pageNum: 1, 
        pageSize: 100,
        ...(searchQuery && { keyword: searchQuery }),
      });
      return response;
    },
  });

  const seriesList = seriesData?.data?.records || [];

  // 处理系列选择
  const handleSeriesSelect = (seriesId: string) => {
    const selectedSeries = seriesList.find(s => s.seriesId === seriesId);
    if (selectedSeries) {
      form.setValue("seriesId", seriesId);
      form.setValue("title", selectedSeries.title);
      form.setValue("description", selectedSeries.description);
      form.setValue("imageUrl", selectedSeries.coverImageUrl);
    }
  };

  // 提交处理
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (isEdit && carousel) {
        return updateShortHomepage({
          carouselId: carousel.carouselId,
          seriesId: data.seriesId,
          position: data.position,
          isActive: data.isActive,
          description: data.description,
          title: data.title,
          imageUrl: data.imageUrl,
          displayStartTime: data.displayStartTime,
          displayEndTime: data.displayEndTime,
        });
      } else {
        return createShortHomepage({
          seriesId: data.seriesId,
          position: data.position,
          isActive: data.isActive,
          description: data.description,
          title: data.title,
          imageUrl: data.imageUrl,
          displayStartTime: data.displayStartTime,
          displayEndTime: data.displayEndTime,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel-list"] });
      toast(`${isEdit ? "更新" : "创建"}成功`);
      onSuccess?.();
    },
    onError: () => {
      toast(`${isEdit ? "更新" : "创建"}失败`);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
        {/* 预览区域 - 改为更紧凑的设计 */}
        <div className="flex gap-6">
          {/* 左侧预览 */}
          <Card className="flex-1">
            <CardContent className="p-4">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                {form.watch("imageUrl") ? (
                  <>
                    <img
                      src={form.watch("imageUrl")}
                      alt="轮播图预览"
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-lg font-semibold mb-1">{form.watch("title")}</h3>
                      <p className="text-white/80 text-sm line-clamp-2">{form.watch("description")}</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">选择系列后显示预览</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 右侧预览信息 */}
          <Card className="w-[280px]">
            <CardContent className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">展示位置</h4>
                <p className="text-lg font-semibold">第 {form.watch("position")} 位</p>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">展示状态</h4>
                <div className="flex items-center">
                  {form.watch("isActive") ? (
                    <Badge variant="default" className="gap-1">
                      <Eye className="h-3 w-3" />
                      展示中
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <EyeOff className="h-3 w-3" />
                      已隐藏
                    </Badge>
                  )}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">展示时间</h4>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(form.watch("displayStartTime")), 'yyyy-MM-dd HH:mm')}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarOff className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(form.watch("displayEndTime")), 'yyyy-MM-dd HH:mm')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 表单内容 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 左侧：基本信息 */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                基本信息
              </h3>
              <Separator />
              
              {/* 系列选择 */}
              <FormField
                control={form.control}
                name="seriesId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>关联系列</FormLabel>
                    <div className="space-y-2">
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="搜索系列..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <Select
                        value={field.value}
                        onValueChange={handleSeriesSelect}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择系列" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoading ? (
                            <SelectItem value="loading">
                              <div className="flex items-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                加载中...
                              </div>
                            </SelectItem>
                          ) : seriesList.length > 0 ? (
                            seriesList.map((series) => (
                              <SelectItem 
                                key={series.seriesId} 
                                value={series.seriesId}
                              >
                                <div className="flex items-center">
                                  <div className="w-8 h-8 relative rounded overflow-hidden mr-2">
                                    <img
                                      src={series.coverImageUrl}
                                      alt={series.title}
                                      className="object-cover"
                                    />
                                  </div>
                                  <span>{series.title}</span>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-data" disabled>
                              暂无系列数据
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 展示位置 */}
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>展示位置</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ArrowDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(Number(e.target.value))}
                          placeholder="数字越小越靠前" 
                          className="pl-9"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 右侧：展示设置 */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                展示设置
              </h3>
              <Separator />

              {/* 展示状态 */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">展示状态</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        控制轮播图是否在首页展示
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* 展示时间 */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="displayStartTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>开始时间</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="datetime-local"
                            {...field}
                            className="pl-9 w-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="displayEndTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>结束时间</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="datetime-local"
                            {...field}
                            className="pl-9 w-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess?.()}
          >
            取消
          </Button>
          <Button 
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "更新中..." : "创建中..."}
              </>
            ) : (
              isEdit ? "更新轮播图" : "创建轮播图"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};


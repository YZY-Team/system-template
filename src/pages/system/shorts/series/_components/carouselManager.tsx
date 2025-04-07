

import { getShortHomepageList, deleteShortHomepage } from "@/api/short-homepage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShortHomepage } from "@/types/short-homepage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateAndEditHomePage } from "./createAndEditHomePage";
// 移除 next/image 导入
// import Image from "next/image";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { 
  Edit, 
  Trash2, 
  Plus,
  Eye,
  EyeOff,
  Calendar
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const CarouselManager = () => {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCarousel, setSelectedCarousel] = useState<ShortHomepage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // 获取轮播图列表
  const { data: carouselList } = useQuery({
    queryKey: ["carousel-list"],
    queryFn: () =>
      getShortHomepageList({
        pageNum: 1,
        pageSize: 100,
      }),
  });

  // 删除轮播图
  const deleteMutation = useMutation({
    mutationFn: deleteShortHomepage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel-list"] });
      toast("删除成功");
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast("删除失败");
    },
  });

  // 处理删除确认
  const handleDeleteConfirm = () => {
    if (selectedCarousel) {
      deleteMutation.mutate(selectedCarousel.carouselId);
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">轮播图管理</h2>
          <p className="text-muted-foreground">
            管理首页轮播图的展示内容和顺序
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加轮播图
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>创建轮播图</DialogTitle>
            </DialogHeader>
            <CreateAndEditHomePage
              isEdit={false}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["carousel-list"] });
                setIsCreateDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* 轮播图列表 - 改用网格布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carouselList?.data.records.map((carousel) => (
          <Card key={carousel.carouselId} className="group relative overflow-hidden">
            {/* 轮播图预览 */}
            <div className="aspect-[21/9] relative">
              <img
                src={carousel.imageUrl}
                alt={carousel.title}
                className="object-cover absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* 位置标签 */}
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-black/50 hover:bg-black/60">
                  位置 {carousel.position}
                </Badge>
              </div>

              {/* 状态标签 */}
              <div className="absolute top-4 right-4">
                <Badge 
                  variant={carousel.isActive ? "default" : "secondary"}
                  className={cn(
                    "bg-black/50 hover:bg-black/60",
                    carousel.isActive && "bg-green-500/50 hover:bg-green-500/60"
                  )}
                >
                  {carousel.isActive ? (
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      展示中
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <EyeOff className="h-3 w-3" />
                      已隐藏
                    </div>
                  )}
                </Badge>
              </div>

              {/* 标题和描述 */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold mb-1 line-clamp-1">{carousel.title}</h3>
                <p className="text-white/80 text-sm line-clamp-2">{carousel.description}</p>
              </div>
            </div>

            {/* 展示时间和操作 */}
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* 展示时间 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>展示时间</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      </div>
                      <span>
                        开始：{format(new Date(carousel.displayStartTime), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      </div>
                      <span>
                        结束：{format(new Date(carousel.displayEndTime), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCarousel(carousel);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    编辑
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedCarousel(carousel);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    删除
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑轮播图</DialogTitle>
          </DialogHeader>
          {selectedCarousel && (
            <CreateAndEditHomePage
              carousel={selectedCarousel}
              isEdit={true}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["carousel-list"] });
                setIsEditDialogOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个轮播图吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
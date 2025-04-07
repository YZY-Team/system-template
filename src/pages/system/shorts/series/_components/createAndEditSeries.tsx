

import { FileSourceEnum, minioUploadFile } from "@/api/file";
import { createShortSerie, updateShortSerie } from "@/api/short-series";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SheetClose } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CreateShortSerie, ShortSerieInfo } from "@/types/short-series";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
// 移除 next/image 导入
// import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateAndEditSeriesProps {
  isEdit?: boolean;
  series?: ShortSerieInfo;
  onSuccess?: () => void;
}

type FormData = Omit<CreateShortSerie, "releaseDate"> & {
  releaseDate: Date;
};

// 添加错误类型定义
interface ErrorWithMessage {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const CreateAndEditSeries = ({
  isEdit,
  series,
  onSuccess,
}: CreateAndEditSeriesProps) => {
  console.log({series});
  
  const queryClient = useQueryClient();
  const fileRef = useRef<File | null>(null);
  const previewUrlRef = useRef<string>("");

  const { register, handleSubmit, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      title: series?.title || "",
      description: series?.description || "",
      genre: series?.genre || "",
      language: series?.language || "",
      coverImageUrl: series?.coverImageUrl || "",
      isActive: series?.isActive || false,
      isFree: series?.isFree || false,
      releaseDate: series?.releaseDate
        ? new Date(series.releaseDate)
        : new Date(),
      price: series?.price || 0,
      ageRestriction: series?.ageRestriction || 0,
      tags: series?.tags || "",
      releaseStatus: series?.releaseStatus || "DRAFT",
      subtitleLanguages: series?.subtitleLanguages || "",
      director: series?.director || "",
      mainCast: series?.mainCast || "",
      region: series?.region || "",
      duration: series?.duration || 0,
      country: series?.country || "",
      accessLevel: series?.accessLevel || "PUBLIC",
    },
  });

  const cleanupPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }
  };

  const handleImageUpload = async (seriesId: string) => {
    if (!fileRef.current) return null;

    try {
      const response = await minioUploadFile({
        source: FileSourceEnum.SERIES_COVER,
        relatedId: seriesId,
        file: fileRef.current,
      });

      if (response.data?.url) {
        cleanupPreview();
        return response.data.url;
      }
      return null;
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("图片上传失败");
      return null;
    }
  };

  const formatDateToLocalDate = (date: Date): string => {
    return format(date, "yyyy-MM-dd");
  };

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const seriesResponse = await createShortSerie({
        ...data,
        coverImageUrl: "",
        releaseDate: formatDateToLocalDate(data.releaseDate),
        price: data.price || 0,
        ageRestriction: data.ageRestriction || 0,
        tags: data.tags || "",
        releaseStatus: data.releaseStatus || "DRAFT",
        subtitleLanguages: data.subtitleLanguages || "",
        director: data.director || "",
        mainCast: data.mainCast || "",
        region: data.region || "",
        duration: data.duration || 0,
        country: data.country || "",
        accessLevel: data.accessLevel || "PUBLIC",
      });

      if (fileRef.current && seriesResponse.data) {
        const imageUrl = await handleImageUpload(seriesResponse.data.seriesId);
        if (imageUrl) {
          await updateShortSerie({
            seriesId: seriesResponse.data.seriesId,
            data: {
              ...data,
              coverImageUrl: imageUrl,
              releaseDate: formatDateToLocalDate(data.releaseDate),
            },
          });
        }
      }

      return seriesResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortSeries"] });
      toast.success("创建成功");
      fileRef.current = null;
      cleanupPreview();
      onSuccess?.();
    },
    onError: (error: ErrorWithMessage) => {
      const errorMessage =
        error.response?.data?.message || error.message || "创建失败";
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!series) throw new Error("No series to update");

      let finalImageUrl = data.coverImageUrl;

      if (fileRef.current) {
        const imageUrl = await handleImageUpload(series.seriesId);
        if (imageUrl) {
          finalImageUrl = imageUrl;
        }
      }

      return updateShortSerie({
        seriesId: series.seriesId,
        data: {
          ...data,
          coverImageUrl: finalImageUrl,
          releaseDate: formatDateToLocalDate(data.releaseDate),
          price: data.price || 0,
          ageRestriction: data.ageRestriction || 0,
          tags: data.tags || "",
          releaseStatus: data.releaseStatus || "DRAFT",
          subtitleLanguages: data.subtitleLanguages || "",
          director: data.director || "",
          mainCast: data.mainCast || "",
          region: data.region || "",
          duration: data.duration || 0,
          country: data.country || "",
          accessLevel: data.accessLevel || "PUBLIC",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortSeries"] });
      toast.success("更新成功");
      fileRef.current = null;
      cleanupPreview();
      onSuccess?.();
    },
    onError: (error: ErrorWithMessage) => {
      const errorMessage =
        error.response?.data?.message || error.message || "更新失败";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (isEdit && series?.coverImageUrl) {
      setValue("coverImageUrl", series.coverImageUrl);
      // 清除之前的预览
      cleanupPreview();
    }
  }, [isEdit, series, setValue]);

  // 使用 useCallback 包装 resetForm 函数
  const resetForm = useCallback(() => {
    if (series) {
      reset({
        title: series.title,
        description: series.description,
        genre: series.genre,
        language: series.language,
        coverImageUrl: series.coverImageUrl,
        isActive: series.isActive,
        isFree: series.isFree,
        releaseDate: series.releaseDate
          ? new Date(series.releaseDate)
          : new Date(),
        price: series.price,
        ageRestriction: series.ageRestriction,
        tags: series.tags,
        releaseStatus: series.releaseStatus,
        subtitleLanguages: series.subtitleLanguages,
        director: series.director,
        mainCast: series.mainCast,
        region: series.region,
        duration: series.duration,
        country: series.country,
        accessLevel: series.accessLevel,
      });
    }
  }, [series, reset]); // 添加依赖项

  // 在组件挂载和 series 变化时重置表单
  useEffect(() => {
    resetForm();
    return () => {
      cleanupPreview();
    };
  }, [resetForm]); // 添加 resetForm 到依赖数组

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "操作失败";
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="coverImage">封面图片</Label>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  fileRef.current = file;
                  cleanupPreview();
                  const previewUrl = URL.createObjectURL(file);
                  previewUrlRef.current = previewUrl;
                  setValue("coverImageUrl", previewUrl, {
                    shouldValidate: false,
                  });
                }
              }}
            />
            {watch("coverImageUrl") && (
              <div className="relative w-[100px] h-[100px]">
                <img
                  src={watch("coverImageUrl")}
                  alt="面预览"
                  className="object-cover rounded border"
                  onError={() => {
                    setValue("coverImageUrl", "");
                    fileRef.current = null;
                    cleanupPreview();
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">系列标题</Label>
          <Input
            id="title"
            placeholder="请输入系列标题"
            {...register("title", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">系列描述</Label>
          <Textarea
            id="description"
            placeholder="请输入系列描述"
            {...register("description", { required: true })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="genre">类型</Label>
            <Select
              value={watch("genre")}
              onValueChange={(value) => setValue("genre", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="动画">动画</SelectItem>
                <SelectItem value="剧情">剧情</SelectItem>
                <SelectItem value="喜剧">喜剧</SelectItem>
                <SelectItem value="其他">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">语言</Label>
            <Select
              value={watch("language")}
              onValueChange={(value) => setValue("language", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择语言" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="中文">中文</SelectItem>
                <SelectItem value="英文">英文</SelectItem>
                <SelectItem value="其他">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="releaseStatus">发布状态</Label>
            <Select
              value={watch("releaseStatus")}
              onValueChange={(value) => setValue("releaseStatus", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">草稿</SelectItem>
                <SelectItem value="PUBLISHED">已发布</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">价格</Label>
            <Input
              type="number"
              id="price"
              {...register("price", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">状态</Label>
              <div className="text-sm text-muted-foreground">
                控制系列是否对外展示
              </div>
            </div>
            <Switch
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isFree">定价</Label>
              <div className="text-sm text-muted-foreground">
                控制系列是否免费观看
              </div>
            </div>
            <Switch
              checked={watch("isFree")}
              onCheckedChange={(checked) => setValue("isFree", checked)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="director">导演</Label>
            <Input id="director" {...register("director")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainCast">主演</Label>
            <Input
              id="mainCast"
              {...register("mainCast")}
              placeholder="请输入主演，多个用逗号分隔"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">国家/地区</Label>
              <Input id="country" {...register("country")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessLevel">访问级别</Label>
              <Select
                value={watch("accessLevel")}
                onValueChange={(value) => setValue("accessLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择访问级别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">公开</SelectItem>
                  <SelectItem value="PRIVATE">私有</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {isEdit ? (
          <SheetClose asChild>
            <Button type="button" variant="outline">
              取消
            </Button>
          </SheetClose>
        ) : (
          <DialogClose asChild>
            <Button type="button" variant="outline">
              取消
            </Button>
          </DialogClose>
        )}
        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending
            ? "提交中..."
            : isEdit
            ? "更新"
            : "创建"}
        </Button>
      </div>
    </form>
  );
};


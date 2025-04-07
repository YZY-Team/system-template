

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "@/components/upload";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Upload as UploadIcon, Trash2, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  createShortEpisode,
  getShortEpisodeBySerieId,
  deleteEpisode,
  uploadVideo,
  getVideoUrl,
} from "@/api/short-episode";
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
import { AxiosProgressEvent } from "axios";

interface Episode {
  episodeId: string;
  title: string;
  description: string;
  episodeNumber: number;
  hasVideo: boolean;
  videoUrl?: string;
  duration?: string;
  playCount: number;
  releaseStatus: string;
  createTime: string;
  updateTime: string;
}

interface ConfigureEpisodesProps {
  seriesId: string;
}

interface CreateEpisodeData {
  seriesId: string;
  title: string;
  episodeNumber: number;
  description: string;
}

export const ConfigureEpisodes = ({ seriesId }: ConfigureEpisodesProps) => {
  console.log('ConfigureEpisodes rendered with seriesId:', seriesId);
  const [isAddingEpisode, setIsAddingEpisode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [episodeToDelete, setEpisodeToDelete] = useState<Episode | null>(null);
  const [uploadingEpisodeId, setUploadingEpisodeId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // 获取剧集列表并排序
  const { data: episodeList, isLoading } = useQuery({
    queryKey: ["episodes", seriesId],
    queryFn: async () => {
      console.log('Fetching episodes for seriesId:', seriesId);
      const response = await getShortEpisodeBySerieId({
        seriesId,
        pageNum: 1,
        pageSize: 50
      });
      
      console.log('Episodes response:', response);
      
      // 对数据进行排序：按照剧集编号升序排序
      if (response?.data?.records) {
        response.data.records.sort((a, b) => a.episodeNumber - b.episodeNumber);
      }
      
      return response;
    },
  });

  // 创建剧集
  const { mutate: createEpisode } = useMutation({
    mutationFn: (data: CreateEpisodeData) => {
      return createShortEpisode({
        seriesId: String(seriesId),
        title: data.title,
        episodeNumber: data.episodeNumber
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["episodes", seriesId]
      });
      toast("创建剧集成功");
      setIsAddingEpisode(false);
      form.reset();
    },
    onError: () => {
      toast("创建剧集失败");
    },
  });

  // 删除剧集
  const { mutate: deleteEpisodeMutation } = useMutation({
    mutationFn: (episodeId: string) => deleteEpisode(episodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["episodes", seriesId]
      });
      toast("删除剧集成功");
    },
  });

  // 上传视频
  const handleVideoUpload = async (episodeId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('episodeId', episodeId);

    try {
      setUploadProgress(0);
      setUploadingEpisodeId(episodeId);
      
      const response = await uploadVideo(formData, (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.lengthComputable) {
          // @ts-expect-error 这里是 AxiosProgressEvent
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(Math.round(progress));
        }
      });

      if (response?.code === 200) {
        toast("上传成功");
        
        queryClient.invalidateQueries({
          queryKey: ["episodes", seriesId]
        });
      } else {
        throw new Error(response?.message || "上传失败");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "上传失败";
      toast(errorMessage);
    } finally {
      setUploadProgress(0);
      setUploadingEpisodeId(null);
    }
  };

  // 计算下一个剧集编号
  const getNextEpisodeNumber = () => {
    const episodes = episodeList?.data?.records || [];
    if (episodes.length === 0) return 1;
    
    const maxEpisodeNumber = Math.max(...episodes.map(ep => ep.episodeNumber));
    return maxEpisodeNumber + 1;
  };

  // 创建剧集的表单
  const form = useForm<CreateEpisodeData>({
    defaultValues: {
      seriesId,
      title: "",
      episodeNumber: getNextEpisodeNumber(),
      description: "",
    },
  });

  // 当打开添加剧集对话框时，重置表单并设置新的编号
  const handleAddEpisodeClick = () => {
    const nextNumber = getNextEpisodeNumber();
    form.reset({
      seriesId,
      title: "",
      episodeNumber: nextNumber,
      description: "",
    });
    setIsAddingEpisode(true);
  };

  const onSubmit = (data: CreateEpisodeData) => {
    createEpisode(data);
  };

  // 处理视频预览
  const handlePreview = async (episodeId: string) => {
    try {
      console.log('开始获取视频URL, episodeId:', episodeId);
      const response = await getVideoUrl(episodeId);
      console.log('获取视频URL响应:', response);
      
      if (response?.code === 200 && response.data) {
        console.log('设置预览URL:', response.data);
        // @ts-expect-error 一定有data
        setPreviewUrl(response.data);
        setIsPreviewOpen(true);
      } else {
        throw new Error(response?.message || "无法获取视频预览地址");
      }
    } catch (error: unknown) {
      console.error('获取视频URL失败:', error);
      const errorMessage = error instanceof Error ? error.message : "获取视频失败";
      toast(errorMessage);
    }
  };

  const handleDeleteClick = (episode: Episode) => {
    setEpisodeToDelete(episode);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (episodeToDelete) {
      deleteEpisodeMutation(episodeToDelete.episodeId);
      setIsDeleteDialogOpen(false);
      setEpisodeToDelete(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">加载中...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">剧集列表</h3>
        <Button 
          onClick={handleAddEpisodeClick} 
          className="bg-black hover:bg-gray-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          添加剧集
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>序号</TableHead>
              <TableHead>标题</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>播放次数</TableHead>
              <TableHead>视频</TableHead>
              <TableHead>作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {episodeList?.data?.records?.length ? (
              episodeList.data.records.map((episode: Episode) => (
                <TableRow key={episode.episodeId}>
                  <TableCell>{episode.episodeNumber}</TableCell>
                  <TableCell>{episode.title}</TableCell>
                  <TableCell>{episode.description}</TableCell>
                  <TableCell>{episode.releaseStatus}</TableCell>
                  <TableCell>{episode.playCount}</TableCell>
                  <TableCell>
                    {episode.hasVideo ? (
                      <div className="flex items-center gap-2">
                        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(episode.episodeId)}
                            >
                              <Play className="w-4 h-4 mr-1" />
                              预览
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[400px]">
                            <DialogHeader>
                              <DialogTitle>视频预览 - {episode.title}</DialogTitle>
                            </DialogHeader>
                            <div className="aspect-[9/16] bg-black">
                              {previewUrl && (
                                <video
                                  key={previewUrl}
                                  controls
                                  playsInline
                                  autoPlay
                                  className="w-full h-full object-contain"
                                  src={previewUrl}
                                  onError={(e) => {
                                    console.error('视频加载错误:', e);
                                    toast("视频加载失败");
                                  }}
                                  onEnded={() => setIsPreviewOpen(false)}
                                >
                                  您的浏览器不支持视频播放
                                </video>
                              )}
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Button 
                                variant="outline" 
                                onClick={() => setIsPreviewOpen(false)}
                              >
                                关闭
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ) : (
                      <div className="space-y-2 w-full">
                        <Upload
                          onChange={(file: File) => handleVideoUpload(episode.episodeId, file)}
                          accept="video/*"
                        >
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={uploadingEpisodeId === episode.episodeId}
                            className="w-full"
                          >
                            <UploadIcon className="w-4 h-4 mr-1" />
                            {uploadingEpisodeId === episode.episodeId ? '上传中...' : '上传视频'}
                          </Button>
                        </Upload>
                        {uploadingEpisodeId === episode.episodeId && uploadProgress > 0 && (
                          <div className="w-full">
                            <div className="flex mb-1 items-center justify-between">
                              <span className="text-xs font-semibold text-blue-600">
                                {uploadProgress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(episode)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  暂无剧集数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 添加剧集的对话框 */}
      <Dialog open={isAddingEpisode} onOpenChange={setIsAddingEpisode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加新剧集</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>剧集标题</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="请输入剧集题" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="episodeNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>剧集编号</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        disabled  // 禁用输入，使用自动计算的值
                        value={getNextEpisodeNumber()}  // 始终使用计算的下一个编号
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>描述</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="请输入剧集描述" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">创建剧集</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除剧集 &quot;{episodeToDelete?.title}&quot; 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEpisodeToDelete(null)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};


import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTags, addTagToSeries, removeTagFromSeries, getTagsForSeries } from "@/api/tag";
import { getShortSeries } from "@/api/short-series";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import debounce from 'lodash/debounce';

interface ErrorResponse {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}



interface TagMapping {
  seriesId: string;
  title: string;
  tagId: string;
  tagName: string;
  tagDescription: string;
  color: string;
  priority: number;
  isSystem: boolean;
  isActive: boolean;
}

export function SeriesTagsManagement() {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [tagToRemove, setTagToRemove] = useState<{ seriesId: string; tagId: string } | null>(null);
  const [selectedTags, setSelectedTags] = useState<Map<string, string>>(new Map());

  // 使用 useCallback 创建防抖函数
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchText(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  // 处理输入变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  // 获取所有短剧列表
  const { data: seriesList, isLoading: isLoadingSeries } = useQuery({
    queryKey: ["shortSeries", currentPage, searchText],
    queryFn: () => getShortSeries({
      pageNum: currentPage,
      pageSize: pageSize,
      title: searchText || undefined,
      sortField: "createTime",
      sortMode: false,
    }),
  });

  // 获取所有标签
  const { data: allTags, isLoading: isLoadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  // 获取标签关联信息
  const { data: tagMappings, isLoading: isLoadingMappings } = useQuery({
    queryKey: ["tagMappings"],
    queryFn: getTagsForSeries,
  });

  // 获取所有关联信息，按短剧分组
  const seriesWithTags = useMemo(() => {
    if (!tagMappings?.data) return new Map<string, TagMapping[]>();

    const groupedBySeriesId = new Map<string, TagMapping[]>();
    tagMappings.data.forEach(mapping => {
      const existingMappings = groupedBySeriesId.get(mapping.seriesId) || [];
      groupedBySeriesId.set(mapping.seriesId, [...existingMappings, mapping]);
    });
    return groupedBySeriesId;
  }, [tagMappings?.data]);

  // 添加标签到短剧
  const addTagMutation = useMutation({
    mutationFn: (data: { seriesId: string; tagId: string }) => {
      console.log('Adding tag with data:', data);
      return addTagToSeries({
        seriesId: data.seriesId,
        tagId: data.tagId,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tagMappings"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["shortSeries"] });
      toast.success("标签添加成功");
      // 清除对应短剧的选中标签
      setSelectedTags(prev => {
        const next = new Map(prev);
        next.delete(variables.seriesId);
        return next;
      });
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.message || "添加失败");
    },
  });

  // 从短剧移除标签
  const removeTagMutation = useMutation({
    mutationFn: (data: { seriesId: string; tagId: string }) => {
      console.log('Removing tag with data:', data);
      return removeTagFromSeries({
        seriesId: data.seriesId,
        tagId: data.tagId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tagMappings"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["shortSeries"] });
      toast.success("标签移除成功");
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.message || "移除失败");
    },
  });

  // 添加标签处理函数
  const handleAddTag = (seriesId: string) => {
    const tagId = selectedTags.get(seriesId);
    if (!tagId) {
      toast.error("请选择标签");
      return;
    }

    addTagMutation.mutate({
      seriesId,
      tagId,
    });
  };

  // 移除标签处理函数
  const handleRemoveTag = (seriesId: string, tagId: string) => {
    setTagToRemove({ seriesId, tagId });
  };

  const confirmRemoveTag = () => {
    if (!tagToRemove) return;

    removeTagMutation.mutate({
      seriesId: tagToRemove.seriesId,
      tagId: tagToRemove.tagId,
    });
    setTagToRemove(null);
  };

  // 添加分页处理
  const totalPages = Math.ceil((seriesList?.data?.total || 0) / pageSize);

  // 添加清除搜索的功能
  const handleClearSearch = useCallback(() => {
    setInputValue("");
    setSearchText("");
    setCurrentPage(1);
    queryClient.invalidateQueries({ queryKey: ["shortSeries"] });
  }, [queryClient]);

  if (isLoadingSeries || isLoadingTags || isLoadingMappings) {
    return <div>加载中...</div>;
  }

  if (!seriesList?.data || !allTags?.data || !tagMappings?.data) {
    return <div>数据加载失败</div>;
  }

  return (
    <div className="space-y-6">
      <AlertDialog open={!!tagToRemove} onOpenChange={(open) => !open && setTagToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认移除标签</AlertDialogTitle>
            <AlertDialogDescription>
              确定要移除这个标签吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveTag}>
              确认移除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle>短剧标签配置</CardTitle>
          <CardDescription>为短剧添加或移除标签</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 修改搜索框部分 */}
            <div className="flex gap-2">
              <div className="relative flex-1 max-w-sm">
                <Input
                  placeholder="搜索短剧名称..."
                  value={inputValue}
                  onChange={handleSearchChange}
                  className="pr-8"
                />
                {inputValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 p-0"
                    onClick={handleClearSearch}
                  >
                    ×
                  </Button>
                )}
              </div>
              {isLoadingSeries && (
                <div className="text-sm text-muted-foreground">
                  搜索中...
                </div>
              )}
            </div>

            {/* 短剧列表 */}
            <div className="space-y-4">
              {seriesList?.data?.records?.map((series) => (
                <Card key={series.seriesId}>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="font-medium">{series.title}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {series.seriesId}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={selectedTags.get(series.seriesId) || ""}
                          onValueChange={(value) => {
                            setSelectedTags(prev => new Map(prev).set(series.seriesId, value));
                          }}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="选择标签" />
                          </SelectTrigger>
                          <SelectContent>
                            {allTags?.data?.map((tag) => (
                              <SelectItem
                                key={tag.tagId}
                                value={tag.tagId}
                              >
                                {tag.tagName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={() => handleAddTag(series.seriesId)}
                          disabled={!selectedTags.get(series.seriesId)}
                        >
                          添加标签
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {(seriesWithTags.get(series.seriesId) || []).map((mapping) => (
                        <Badge
                          key={mapping.tagId}
                          variant="secondary"
                          className="flex items-center gap-2"
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: mapping.color }}
                          />
                          {mapping.tagName}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleRemoveTag(series.seriesId, mapping.tagId)}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                      {!seriesWithTags.get(series.seriesId)?.length && (
                        <span className="text-muted-foreground text-sm">
                          暂无关联标签
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 分页控制 */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                共 {seriesList?.data?.total || 0} 条记录
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm">第 {currentPage} 页</span>
                  <span className="text-sm text-muted-foreground">
                    共 {totalPages} 页
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
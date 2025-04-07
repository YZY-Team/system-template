

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTags, createTag, updateTag, deleteTag } from "@/api/tag";
import { Tag, CreateTagRequest } from "@/types/tag";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface ErrorResponse {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function TagsManagement() {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTag, setNewTag] = useState<CreateTagRequest>({
    tagName: "",
    description: "",
    color: "#000000",
    priority: 0,
    isSystem: false,
    isActive: true,
    isDisplayedOnHome: false,
    displayOrder: 0,
    displaySection: "",
  });

  // 获取标签列表
  const { data: tags, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  // 创建标签
  const createMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("标签创建成功");
      setIsCreateDialogOpen(false);
      setNewTag({
        tagName: "",
        description: "",
        color: "#000000",
        priority: 0,
        isSystem: false,
        isActive: true,
        isDisplayedOnHome: false,
        displayOrder: 0,
        displaySection: "",
      });
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.message || "创建失败");
    },
  });

  // 更新标签
  const updateMutation = useMutation({
    mutationFn: ({ tagId, data }: { tagId: string; data: CreateTagRequest }) =>
      updateTag(tagId, { ...data, tagId: String(tagId) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("标签更新成功");
      setEditingTag(null);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.message || "更新失败");
    },
  });

  // 删除标签
  const deleteMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("标签删除成功");
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.message || "删除失败");
    },
  });

  const handleCreateTag = () => {
    createMutation.mutate(newTag);
  };

  const handleUpdateTag = (tag: Tag) => {
    if (!tag.tagId) return;
    updateMutation.mutate({
      tagId: tag.tagId,
      data: {
        tagName: tag.tagName,
        description: tag.description || "",
        color: tag.color || "#000000",
        priority: tag.priority || 0,
        isSystem: tag.isSystem || false,
        isActive: tag.isActive || true,
        isDisplayedOnHome: tag.isDisplayedOnHome || false,
        displayOrder: tag.displayOrder || 0,
        displaySection: tag.displaySection || "",
      },
    });
  };

  const handleDeleteTag = (tagId: string) => {
    if (window.confirm("确定要删除这个标签吗？")) {
      deleteMutation.mutate(tagId);
    }
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">标签列表</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>创建标签</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建新标签</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tagName">标签名称</Label>
                <Input
                  id="tagName"
                  value={newTag.tagName}
                  onChange={(e) =>
                    setNewTag({ ...newTag, tagName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Input
                  id="description"
                  value={newTag.description}
                  onChange={(e) =>
                    setNewTag({ ...newTag, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">颜色</Label>
                <Input
                  id="color"
                  type="color"
                  value={newTag.color}
                  onChange={(e) =>
                    setNewTag({ ...newTag, color: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">是否启用</Label>
                <Switch
                  id="isActive"
                  checked={newTag.isActive}
                  onCheckedChange={(checked) =>
                    setNewTag({ ...newTag, isActive: checked })
                  }
                />
              </div>
              <Button onClick={handleCreateTag}>创建</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>标签名称</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>颜色</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags?.data?.map((tag) => (
            <TableRow key={tag.tagId}>
              <TableCell>{tag.tagName}</TableCell>
              <TableCell>{tag.description}</TableCell>
              <TableCell>
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: tag.color }}
                />
              </TableCell>
              <TableCell>
                {tag.isActive ? (
                  <span className="text-green-600">启用</span>
                ) : (
                  <span className="text-red-600">禁用</span>
                )}
              </TableCell>
              <TableCell>
                {tag.createTime &&
                  format(new Date(tag.createTime), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTag(tag)}
                  >
                    编辑
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => tag.tagId && handleDeleteTag(tag.tagId)}
                  >
                    删除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 编辑标签对话框 */}
      <Dialog open={!!editingTag} onOpenChange={() => setEditingTag(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑标签</DialogTitle>
          </DialogHeader>
          {editingTag && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tagName">标签名称</Label>
                <Input
                  id="edit-tagName"
                  value={editingTag.tagName}
                  onChange={(e) =>
                    setEditingTag({ ...editingTag, tagName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">描述</Label>
                <Input
                  id="edit-description"
                  value={editingTag.description}
                  onChange={(e) =>
                    setEditingTag({ ...editingTag, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-color">颜色</Label>
                <Input
                  id="edit-color"
                  type="color"
                  value={editingTag.color}
                  onChange={(e) =>
                    setEditingTag({ ...editingTag, color: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-isActive">是否启用</Label>
                <Switch
                  id="edit-isActive"
                  checked={editingTag.isActive}
                  onCheckedChange={(checked) =>
                    setEditingTag({ ...editingTag, isActive: checked })
                  }
                />
              </div>
              <Button onClick={() => handleUpdateTag(editingTag)}>保存</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 
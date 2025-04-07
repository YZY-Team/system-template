import { menuApi } from "@/api/menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuTree, UpdateMenuParams } from "@/types/menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditMenuDialogProps {
  menu: MenuTree;
  menuList?: MenuTree[];
}

export const EditMenuDialog = ({ menu, menuList }: EditMenuDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<UpdateMenuParams>({
    menuId: menu.menuId,
    menuName: menu.menuName,
    parentId: menu.parentId,
    pathUrl: menu.pathUrl,
    icon: menu.icon,
    isExternal: menu.isExternal,
  });

  const queryClient = useQueryClient();

  const { mutate: updateMenuMutate } = useMutation({
    mutationFn: menuApi.updateMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuList"] });
      queryClient.invalidateQueries({ queryKey: ["userPermissionlist"] });
      setOpen(false);
      toast.success("菜单更新成功");
    },
    onError: (error) => {
      console.log(error);
      toast.error("菜单更新失败");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMenuMutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑菜单</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="menuName">菜单名称</Label>
            <Input
              id="menuName"
              value={formData.menuName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, menuName: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parentId">上级菜单</Label>
            <Select
              value={formData.parentId.toString()}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  parentId: parseInt(value),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择上级菜单" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">顶级菜单</SelectItem>
                {menuList?.map((menuItem) => (
                  menuItem.menuId !== menu.menuId && (
                    <SelectItem key={menuItem.menuId} value={menuItem.menuId.toString()}>
                      {menuItem.menuName}
                    </SelectItem>
                  )
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pathUrl">路径</Label>
            <Input
              id="pathUrl"
              value={formData.pathUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, pathUrl: e.target.value }))
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">确定</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
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
import { AddMenuParams, MenuTree } from "@/types/menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

interface AddMenuDialogProps {
  menuList?: MenuTree[];
}

export const AddMenuDialog = ({ menuList }: AddMenuDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<AddMenuParams>({
    menuName: "",
    parentId: 0,
    pathUrl: "",
  });

  const queryClient = useQueryClient();

  const { mutate: addMenuMutate } = useMutation({
    mutationFn: menuApi.addMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuList"] });
      setOpen(false);
      setFormData({ menuName: "", parentId: 0, pathUrl: "" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMenuMutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增菜单
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增菜单</DialogTitle>
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
                {menuList?.map((menu) => (
                  <SelectItem key={menu.menuId} value={menu.menuId.toString()}>
                    {menu.menuName}
                  </SelectItem>
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
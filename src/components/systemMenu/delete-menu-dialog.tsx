import { menuApi } from "@/api/menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MenuTree } from "@/types/menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteMenuDialogProps {
  menu: MenuTree;
}

export const DeleteMenuDialog = ({ menu }: DeleteMenuDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteMenuMutate } = useMutation({
    mutationFn: menuApi.deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuList"] });
      queryClient.invalidateQueries({ queryKey: ["userPermissionlist"] });
      setOpen(false);
      toast.success("菜单删除成功");
    },
    onError: (error) => {
      console.log(error);
      toast.error("菜单删除失败");
    },
  });

  const handleDelete = () => {
    deleteMenuMutate(menu.menuId.toString());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive">
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>删除菜单</DialogTitle>
          <DialogDescription>
            确定要删除菜单 `&quot;`{menu.menuName}`&quot;` 吗？
            {menu.children?.length ? (
              <span className="text-destructive">
                该菜单包含 {menu.children.length} 个子菜单，删除后将一并删除！
              </span>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            确定删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
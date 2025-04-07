import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Role } from "@/types/role";
import { Shield } from "lucide-react";
import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { permissionApi } from "@/api/permission";
import { Permission } from "@/types/permission";

interface AssignPermissionsDialogProps {
  role: Role;
}

export function AssignPermissionsDialog({
  role,
}: AssignPermissionsDialogProps) {
  const [open, setOpen] = useState(false);
  const [readOnly, setReadOnly] = useState(true);

  // 获取所有权限列表
  const { data: permissionList } = useQuery({
    queryKey: ["permissionList"],
    queryFn: permissionApi.getAllPermissionList,
  });

  // 对权限进行分组
  const groupedPermissions = useMemo(() => {
    if (!permissionList) return [];

    const groups = new Map<string, Permission[]>();

    permissionList.forEach((permission) => {
      // 获取模块路径，例如 "system:role"
      const groupPath = permission.permissionCode
        .split(":")
        .slice(0, 2)
        .join(":");

      if (!groups.has(groupPath)) {
        groups.set(groupPath, []);
      }
      groups.get(groupPath)!.push(permission);
    });

    return Array.from(groups.entries()).map(([groupPath, permissions]) => ({
      groupName: groupPath,
      permissions: permissions,
    }));
  }, [permissionList]);

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
    role.permissions.map((p) => p.permissionId)
  );

  const handlePermissionChange = (permissionId: number) => {
    setSelectedPermissions((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId]
    );
  };

  // 添加保存处理函数
  const handleSave = async () => {
    try {
      await permissionApi.roleAssignPermission(
        role.roleId.toString(),
        selectedPermissions.map(String)
      );
      setOpen(false);
    } catch (error) {
      console.error("Failed to assign permissions:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Shield className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>分配权限 - {role.roleName}</DialogTitle>
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="edit-mode"
              checked={!readOnly}
              onCheckedChange={(checked) => setReadOnly(!checked)}
            />
            <Label htmlFor="edit-mode">
              {readOnly ? "查看模式" : "编辑模式"}
            </Label>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          {groupedPermissions.map((group) => (
            <div key={group.groupName} className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">
                {group.groupName}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {group.permissions.map((permission) => (
                  <div
                    key={permission.permissionId}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`permission-${permission.permissionId}`}
                      checked={selectedPermissions.includes(
                        permission.permissionId
                      )}
                      onCheckedChange={() =>
                        handlePermissionChange(permission.permissionId)
                      }
                      disabled={readOnly}
                    />
                    <label
                      htmlFor={`permission-${permission.permissionId}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.permissionName}
                      <p className="text-xs text-muted-foreground">
                        {permission.description}
                      </p>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={readOnly}>
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

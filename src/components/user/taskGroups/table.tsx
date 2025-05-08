import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskGroup } from "@/types/taskGroupType";
import { Edit, Trash2 } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";

interface TaskGroupTableProps {
  data: TaskGroup[];
}

export const TaskGroupTable = forwardRef<{ handleCreate: () => void }, TaskGroupTableProps>(
  ({ data }, ref) => {
    const [, setSelectedGroup] = useState<TaskGroup | null>(null);

    useImperativeHandle(ref, () => ({
      handleCreate: () => {
        setSelectedGroup(null);
        // TODO: 打开创建弹窗
      },
    }));

    const handleEdit = (group: TaskGroup) => {
      setSelectedGroup(group);
      // TODO: 打开编辑弹窗
    };

    const handleDelete = async (id: number) => {
      // TODO: 实现删除功能
      console.log('删除分组:', id);
    };

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>分组名称</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((group) => (
              <TableRow key={group.groupId}>
                <TableCell>{group.groupId}</TableCell>
                <TableCell>{group.groupName}</TableCell>
                <TableCell>{group.description}</TableCell>
                <TableCell>{new Date(group.createTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(group.updateTime).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(group)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(group.groupId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
);

TaskGroupTable.displayName = "TaskGroupTable";
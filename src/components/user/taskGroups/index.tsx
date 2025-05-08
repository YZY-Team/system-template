import { useTaskGroupList } from '@/api/taskGroup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { TaskGroupTable } from './table';
import { TaskGroupDrawer } from './TaskGroupDrawer';

export function TaskGroups() {
  const tableRef = useRef<{ handleCreate: () => void }>(null);
  const { data, isLoading, error } = useTaskGroupList();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">任务分组</h2>
          <p className="text-muted-foreground">
            管理任务分组类型
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          添加分组
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="flex gap-4 items-center p-4">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="搜索分组名称..."
              // TODO: 实现搜索功能
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
        </div>
        {isLoading ? (
          <p className="p-4">加载中...</p>
        ) : error ? (
          <p className="p-4">加载失败，请重试</p>
        ) : (
          <TaskGroupTable ref={tableRef} data={data?.data?.records || []} />
        )}
      </div>

      <TaskGroupDrawer open={open} onOpenChange={setOpen} selectedTaskId={null} />
    </div>
  );
}

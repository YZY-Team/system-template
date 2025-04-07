import  { JSX, useRef } from 'react';
import { getRewardTypeList } from '@/api/reward';
import { useQuery } from '@tanstack/react-query';
import { RewardTable } from './table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

/**
 * 任务奖励组件
 * @returns {JSX.Element} 任务奖励的 JSX
 */
export const TaskRewards = (): JSX.Element => {
  const tableRef = useRef<{ handleCreate: () => void }>(null);
  const { data: rewardTypes, isLoading, error } = useQuery({
    queryKey: ['rewardTypes'],
    queryFn: () => getRewardTypeList(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">任务奖励</h2>
          <p className="text-muted-foreground">
            管理任务奖励类型
          </p>
        </div>
        <Button onClick={() => tableRef.current?.handleCreate()}>
          <Plus className="mr-2 h-4 w-4" />
          添加奖励类型
        </Button>
      </div>
      {isLoading ? (
        <p>加载中...</p>
      ) : error ? (
        <p>加载失败，请重试</p>
      ) : (
        <RewardTable ref={tableRef} data={rewardTypes?.data.records || []} />
      )}
    </div>
  );
};
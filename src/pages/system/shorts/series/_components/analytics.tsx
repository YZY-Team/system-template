

export const Analytics = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">数据分析</h2>
        <p className="text-gray-500 mt-1">查看短视频系列的数据统计和分析</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 总观看次数 */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">总观看次数</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            较上月增长 0%
          </p>
        </div>

        {/* 活跃系列数 */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">活跃系列数</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            较上月增长 0%
          </p>
        </div>

        {/* 总收入 */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">总收入</h3>
          </div>
          <div className="text-2xl font-bold">¥0.00</div>
          <p className="text-xs text-muted-foreground">
            较上月增长 0%
          </p>
        </div>
      </div>

      {/* 图表占位 */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium mb-4">观看趋势</h3>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            图表开发中...
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium mb-4">收入趋势</h3>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            图表开发中...
          </div>
        </div>
      </div>
    </div>
  );
}; 
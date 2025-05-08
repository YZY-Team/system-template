import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Mock from "mockjs";
Mock.setup({
  timeout: '200-400' // 随机1-2秒的延迟
});
// 模拟数据生成
const mockData = (page: number, pageSize: number) => {
  return Mock.mock({
    [`list|${pageSize}`]: [
      {
        "id|+1": (page - 1) * pageSize + 1,
        name: "@cname",
        "age|18-60": 1,
        address: "@county(true)",
        email: "@email",
        phone: /1[3-9]\d{9}/,
        "status|1": ["active", "inactive", "pending"],
        createdAt: "@datetime",
      },
    ],
  });
};

// 获取数据函数
const fetchUsers = async ({ pageParam = 1 }) => {
  const pageSize = 10;
  console.log(`正在请求第 ${pageParam} 页数据，每页 ${pageSize} 条`);
  const data = mockData(pageParam, pageSize);
  console.log(`第 ${pageParam} 页数据：`, data.list);
  return {
    data: data.list,
    nextPage: pageParam + 1,
    hasMore: pageParam < 10,
  };
};

const AdminUserPage = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["users"],
      queryFn: fetchUsers,
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>{
        console.log(lastPage);
        return lastPage.hasMore
          ? lastPage.nextPage
          : undefined;
      },
    });

  // 修改观察目标实现
  const [lastItems, setLastItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    // 获取最后3个元素
    if (data?.pages) {
      const allItems = data.pages.flatMap(page => page.data);
      setLastItems(allItems.slice(-3));
    }
  }, [data]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log("触发加载");
          fetchNextPage();
        }
      },
      { threshold: 0.8 }
    );

    // 观察所有倒数第三个元素
    const targets = document.querySelectorAll('.observer-target');
    targets.forEach(target => observer.observe(target));

    return () => {
      targets.forEach(target => observer.unobserve(target));
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, lastItems]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">用户列表</h1>
      <div className="relative h-screen perspective-1000">
        {/* 地板 */}
        <div 
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-200"
          style={{
            transform: 'rotateX(75deg)',
            transformOrigin: 'bottom',
            boxShadow: '0 -10px 20px rgba(0, 0, 0, 0.3)'
          }}
        ></div>
        
        {/* 墙壁 */}
        <div 
          className="absolute inset-x-0 top-0 h-1/2 bg-gray-300"
          style={{
            transform: 'rotateX(15deg)',
            transformOrigin: 'top',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)'
          }}
        ></div>
      </div>
    </div>
  );
};

export default AdminUserPage;

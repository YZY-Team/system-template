

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShortSeries } from "./_components/shortSeries";
import { CarouselManager } from "./_components/carouselManager";
import { Analytics } from "./_components/analytics";

export default function SeriesPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <Tabs defaultValue="series" className="h-full space-y-6">
          <div className="border-b">
            <div className="container py-4">
              <TabsList>
                <TabsTrigger value="carousel">轮播图管理</TabsTrigger>
                <TabsTrigger value="series">短剧系列</TabsTrigger>
                <TabsTrigger value="analytics">数据分析</TabsTrigger>
              </TabsList>
            </div>
          </div>
          <div className="container h-full">
            <TabsContent value="carousel" className="h-full">
              <CarouselManager />
            </TabsContent>
            <TabsContent value="series" className="h-full">
              <ShortSeries />
            </TabsContent>
            <TabsContent value="analytics" className="h-full">
              <Analytics />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TagsManagement } from "./_components/tagsManagement";
import { SeriesTagsManagement } from "./_components/seriesTagsManagement";

export default function TagsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">标签管理</h2>
      </div>
      <Tabs defaultValue="tags" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tags">标签管理</TabsTrigger>
          <TabsTrigger value="series-tags">短剧标签管理</TabsTrigger>
        </TabsList>
        <TabsContent value="tags" className="space-y-4">
          <TagsManagement />
        </TabsContent>
        <TabsContent value="series-tags" className="space-y-4">
          <SeriesTagsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
} 
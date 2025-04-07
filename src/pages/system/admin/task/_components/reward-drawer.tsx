import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RewardDrawerContent } from "./taskRewards/reward-drawer-content";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface RewardDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTaskId: number | null;
}

export function RewardDrawer({
  open,
  onOpenChange,
  selectedTaskId,
}: RewardDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className={cn(
          "flex w-full flex-col sm:max-w-[600px]",
          "p-0",
          "gap-0"
        )}
      >
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-lg font-semibold">奖励配置</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            配置任务的奖励类型和数量
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="px-6">
            {selectedTaskId && (
              <RewardDrawerContent taskId={selectedTaskId} />
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

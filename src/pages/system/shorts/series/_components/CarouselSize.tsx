

import { getShortHomepageList } from "@/api/short-homepage";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShortHomepage } from "@/types/short-homepage";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Settings } from "lucide-react";
// 移除 next/image 导入
// import Image from "next/image";
import { CreateAndEditHomePage } from "./createAndEditHomePage";

export const CarouselSize = () => {
  const [] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
    },
    [Autoplay({ playOnInit: true, delay: 3000 })]
  );

  const { data: shortHomepageList } = useQuery({
    queryKey: ["carousel"],
    queryFn: () => getShortHomepageList({ pageNum: 1, pageSize: 10 }),
  });
  const carouselList: ShortHomepage[] = shortHomepageList?.data?.records || [];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/placeholder.jpg";
    e.currentTarget.onerror = null;
  };

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {carouselList.map((carousel) => (
          <CarouselItem
            key={carousel.carouselId}
            className="md:basis-1/2 lg:basis-1/5"
          >
            <div className="p-1">
              <Card>
                // 在 CardContent 组件内部
                <CardContent className="flex aspect-square items-center justify-center p-6 relative bg-gray-100">
                  <img
                    src={carousel.imageUrl || "/placeholder.jpg"}
                    alt={carousel.title || "轮播图片"}
                    className="object-cover absolute inset-0 w-full h-full"
                    onError={handleImageError}
                    loading="lazy"
                  />
                </CardContent>
                <hr />
                <CardContent className="flex h-10 items-center justify-center p-0 relative">
                  <div className="text-xs">
                    <h3 className="text-sm">{carousel.title}</h3>
                  </div>
                </CardContent>
                <hr />
                <CardFooter className="flex justify-center items-center p-2">
                  <Dialog>
                    <DialogTrigger>
                      <Settings />
                    </DialogTrigger>
                    <DialogContent className="opacity-80">
                      <DialogHeader>
                        <DialogTitle>编辑轮播图</DialogTitle>
                        <DialogDescription>
                          您可以在这里修改轮播图的相关信息
                        </DialogDescription>
                      </DialogHeader>
                      <DialogContent>
                        <CreateAndEditHomePage
                          carousel={carousel}
                          isEdit={true}
                        />
                      </DialogContent>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious aria-label="查看上一张" />
      <CarouselNext aria-label="查看下一张" />
    </Carousel>
  );
};

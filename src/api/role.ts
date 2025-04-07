import { Pagination, request } from "@/lib/request";
import { Role } from "@/types/role";

export const getRuleList = async () => {
  return request<{
    records: Role[];
    pagination: Pagination;
  }>("/api/system/role/page", {
    method: "POST",
    data: {
      pageNum: 1,
      pageSize: 10,
    },
  });
};

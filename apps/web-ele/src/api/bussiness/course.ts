import { requestClient } from '#/api/request';

// 定义课程数据接口
export interface Course {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
  description: string;
  instructor: string;
}

type GetCourseApiResponse = {
  items: Course[];
  total: number;
};

// 修改 getCourseApi 方法的返回类型
export async function getCourseApi({ page = 1, pageSize = 10 }) {
  return requestClient.get<GetCourseApiResponse>(
    `/course/list?page=${page}&pageSize=${pageSize}`,
  );
}

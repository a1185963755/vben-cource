import { faker } from '@faker-js/faker';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse } from '~/utils/response';

function generateMockDataList(count: number) {
  const dataList = [];

  // 生物医学相关课程名称数组
  const courseNames = [
    '生物化学基础',
    '分子生物学导论',
    '解剖学原理',
    '药理学研究',
    '病理学分析',
    '医学影像技术',
    '临床诊断学',
    '免疫学进展',
    '遗传学与基因组学',
    '神经科学探索',
  ];

  // 对应的课程描述和讲师名称
  const courseDetails = [
    {
      description: '介绍生物化学的基本概念及其在生命科学中的应用',
      instructor: '李华教授',
    },
    {
      description: '讲解分子生物学的核心理论和技术方法',
      instructor: '张明博士',
    },
    { description: '系统学习人体解剖结构与功能的关系', instructor: '王强教授' },
    { description: '研究药物作用机制及新药开发流程', instructor: '刘芳博士' },
    { description: '分析疾病发生发展的病理学基础', instructor: '陈东教授' },
    { description: '探讨现代医学影像技术的原理与实践', instructor: '赵敏博士' },
    { description: '学习临床诊断的基本技能与思维方法', instructor: '孙伟教授' },
    { description: '深入研究免疫系统的组成与功能', instructor: '周丽博士' },
    {
      description: '探索遗传学与基因组学的最新研究成果',
      instructor: '吴军教授',
    },
    { description: '揭示神经系统的工作机制与相关疾病', instructor: '郑涛博士' },
  ];

  for (let i = 0; i < count; i++) {
    const dataItem = {
      id: faker.string.uuid(),
      name: courseNames[Math.floor(Math.random() * courseNames.length)], // 使用生物医学相关课程名称
      status: faker.helpers.arrayElement(['进行中', '已结束']), // 课程状态
      createdAt: faker.date.past(), // 创建时间
      description:
        courseDetails[Math.floor(Math.random() * courseDetails.length)]
          .description, // 固定课程描述
      instructor:
        courseDetails[Math.floor(Math.random() * courseDetails.length)]
          .instructor, // 固定讲师名称
    };

    dataList.push(dataItem);
  }

  return dataList;
}

const mockData = generateMockDataList(100);

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  await sleep(600);

  const { page, pageSize, sortBy, sortOrder } = getQuery(event);
  const listData = structuredClone(mockData);
  if (sortBy && Reflect.has(listData[0], sortBy as string)) {
    listData.sort((a, b) => {
      if (sortOrder === 'asc') {
        if (sortBy === 'weight') {
          return (
            Number.parseFloat(a[sortBy as string]) -
            Number.parseFloat(b[sortBy as string])
          );
        } else {
          return a[sortBy as string] > b[sortBy as string] ? 1 : -1;
        }
      } else {
        if (sortBy === 'weight') {
          return (
            Number.parseFloat(b[sortBy as string]) -
            Number.parseFloat(a[sortBy as string])
          );
        } else {
          return a[sortBy as string] < b[sortBy as string] ? 1 : -1;
        }
      }
    });
  }

  return usePageResponseSuccess(page as string, pageSize as string, listData);
});

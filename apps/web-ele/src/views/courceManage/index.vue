<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { ElButton, ElMessageBox } from 'element-plus';

interface CourseRow {
  id: string;
  name: string;
  status: string;
  createTime: string;
  remark: string;
}

// Mock数据
const mockCourses: CourseRow[] = [
  {
    id: '1',
    name: '前端开发基础',
    status: '已启用',
    createTime: '2024-03-18 10:41:21',
    remark: 'HTML、CSS和JavaScript基础课程',
  },
  {
    id: '2',
    name: 'Vue.js进阶实战',
    status: '已启用',
    createTime: '2024-03-19 14:30:00',
    remark: 'Vue3组件开发与状态管理',
  },
  {
    id: '3',
    name: 'React开发实践',
    status: '已禁用',
    createTime: '2024-03-20 09:15:30',
    remark: 'React Hooks与Redux应用开发',
  },
  {
    id: '4',
    name: 'Node.js后端开发',
    status: '已启用',
    createTime: '2024-03-21 16:20:45',
    remark: 'Express框架与数据库集成',
  },
];

// 表格配置
const gridOptions: VxeGridProps<CourseRow> = {
  columns: [
    { type: 'seq', title: '序号', width: 60 },
    { field: 'name', title: '课程名称', minWidth: 120 },
    {
      field: 'status',
      title: '状态',
      width: 100,
      slots: { default: 'status' },
    },
    { field: 'createTime', title: '创建时间', width: 180 },
    { field: 'remark', title: '备注', minWidth: 200 },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ],
  toolbarConfig: {
    custom: true,
    refresh: true,
    zoom: true,
  },
  pagerConfig: {
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
  },
  proxyConfig: {
    ajax: {
      // 模拟远程加载数据
      query: async ({ page }) => {
        // 模拟延迟
        await new Promise((resolve) => setTimeout(resolve, 300));

        const startIndex = (page.currentPage - 1) * page.pageSize;
        const endIndex = startIndex + page.pageSize;
        const pageData = mockCourses.slice(startIndex, endIndex);

        return {
          items: pageData,
          total: mockCourses.length,
        };
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

// 新增课程
const handleAdd = () => {
  // 实现新增逻辑
  const newCourse: CourseRow = {
    id: String(mockCourses.length + 1),
    name: '新课程',
    status: '已启用',
    createTime: new Date().toLocaleString(),
    remark: '',
  };
  mockCourses.unshift(newCourse);
  gridApi.reload();
};

// 编辑课程
const handleEdit = (row: CourseRow) => {
  // 实现编辑逻辑
  console.log('编辑课程:', row);
};

// 删除课程
const handleDelete = (row: CourseRow) => {
  ElMessageBox.confirm('确定要删除该课程吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const index = mockCourses.findIndex((item) => item.id === row.id);
    if (index > -1) {
      mockCourses.splice(index, 1);
      gridApi.reload();
    }
  });
};
</script>

<template>
  <div class="p-4">
    <Grid>
      <!-- 工具栏 -->
      <template #toolbar-tools>
        <el-button type="primary" @click="handleAdd">新增课程</el-button>
      </template>

      <!-- 状态列 -->
      <template #status="{ row }">
        <vxe-tag :status="row.status === '已禁用' ? 'danger' : 'success'">
          {{ row.status }}
        </vxe-tag>
      </template>

      <!-- 操作列 -->
      <template #action="{ row }">
        <el-button link type="primary" @click="handleEdit(row)">修改</el-button>
        <el-button link type="danger" @click="handleDelete(row)"
          >删除</el-button
        >
      </template>
    </Grid>
  </div>
</template>

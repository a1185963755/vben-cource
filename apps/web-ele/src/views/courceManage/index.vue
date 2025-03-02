<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCourseApi, type Course } from '#/api';
import { dayjs, ElButton, ElMessage, ElMessageBox, ElTag } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useAccess } from '@vben/access';
const { hasAccessByRoles } = useAccess();

const courseData = ref<Course[]>([]);
const total = ref(0);

onMounted(async () => {
  const res = await getCourseApi({
    page: 1,
    pageSize: 10,
  });
  courseData.value = res.items;
  total.value = res.total;
});

// 表格配置
const gridOptions: VxeGridProps<Course> = {
  columns: [
    { type: 'seq', title: '序号', width: 60 },
    { field: 'name', title: '课程名称', minWidth: 120 },
    {
      field: 'status',
      title: '状态',
      width: 100,
      slots: { default: 'status' },
    },
    {
      field: 'createdAt',
      title: '创建时间',
      width: 180,
      formatter: ({ cellValue }) => {
        return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');
      },
    }, // 修改字段名称为 createdAt
    { field: 'description', title: '课程描述', minWidth: 200 }, // 新增 description 列
    { field: 'instructor', title: '讲师', minWidth: 120 }, // 新增 instructor 列
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
      // 调整为从API获取数据
      query: async ({ page }) => {
        const res = await getCourseApi({
          page: page.currentPage,
          pageSize: page.pageSize,
        });
        return {
          items: res.items,
          total: res.total,
        };
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

const [Form, FormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入课程名称',
      },
      fieldName: 'name',
      label: '课程名称',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '进行中', value: '进行中' },
          { label: '已结束', value: '已结束' },
        ],
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: '状态',
      rules: 'selectRequired',
    },
    {
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
      },
      fieldName: 'createdAt',
      label: '创建时间',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入课程描述',
      },
      fieldName: 'description',
      label: '课程描述',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入讲师名称',
      },
      fieldName: 'instructor',
      label: '讲师',
      rules: 'required',
    },
  ],
  wrapperClass: 'grid-cols-1',
  resetButtonOptions: {
    show: false,
  },
  submitButtonOptions: {
    show: false,
  },
});
const [Modal, modalApi] = useVbenModal({
  title: '新增课程',
  draggable: true,
  onConfirm() {
    FormApi.validateAndSubmitForm();
  },
});

const handleEdit = (row: Course) => {
  FormApi.setValues(row);
  modalApi.setState({ title: '编辑课程' }).open();
};

function onSubmit() {
  ElMessage.success('编辑课程成功');
  modalApi.close();
  gridApi.reload();
}

// 新增课程
const handleAdd = () => {
  modalApi.open();
};

// 删除课程
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该课程吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('删除课程成功');
    gridApi.reload();
  });
};

//申请课程
const handleApply = (row: Course) => {
  ElMessageBox.confirm(`确定要申请 ${row.name} 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    ElMessage.success('申请成功');
    gridApi.reload();
  });
};
</script>

<template>
  <div class="p-4">
    <Grid>
      <!-- 工具栏 -->
      <template #toolbar-tools>
        <el-button
          type="primary"
          @click="handleAdd"
          v-if="hasAccessByRoles(['super', 'admin'])"
          >新增课程</el-button
        >
      </template>

      <!-- 状态列 -->
      <template #status="{ row }">
        <el-tag :type="row.status === '已结束' ? 'danger' : 'success'">
          {{ row.status }}
        </el-tag>
      </template>

      <!-- 操作列 -->
      <template #action="{ row }">
        <el-button
          link
          type="primary"
          @click="handleApply(row)"
          v-if="hasAccessByRoles(['user'])"
          >申请</el-button
        >
        <el-button
          link
          type="primary"
          @click="handleEdit(row)"
          v-if="hasAccessByRoles(['super', 'admin'])"
          >修改</el-button
        >
        <el-button
          link
          type="danger"
          @click="handleDelete"
          v-if="hasAccessByRoles(['super', 'admin'])"
          >删除</el-button
        >
      </template>
    </Grid>
    <Modal>
      <Form></Form>
    </Modal>
  </div>
</template>

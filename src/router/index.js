import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    // 首页路径
    path: '/',
    redirect: '/home',
  },
  {
    // 登陆页
    path: '/login',
    component: () => import('@/views/user/Login'),
  },
  {
    // 注册页面
    path: '/user/register',
    component: () => import('@/views/user/Register'),
  },
  {
    // 容器布局组件
    path: '/home',
    redirect: '/index',
    component: () => import('@/views/Home'),
    // 定义子路由
    children: [
      // 首页
      {
        path: '/index',
        component: () => import('@/views/index/Index'),
      },
      // 角色页面
      {
        path: '/role',
        component: () => import('@/views/role/Role'),
      },
      // 菜单页面
      {
        path: '/menu',
        component: () => import('@/views/menu/Menu'),
      },
      // 学院页面
      {
        path: '/department',
        component: () => import('@/views/department/Department'),
      },
      // 专业页面
      {
        path: '/major',
        component: () => import('@/views/major/Major'),
      },
      // 试卷类型页面
      {
        path: '/testPaperType',
        component: () => import('@/views/testPaperType/TestPaperType'),
      },
      // 操作页面
      {
        path: '/operation',
        component: () => import('@/views/operation/Operation'),
      },
      // 班级页面
      {
        path: '/classes',
        component: () => import('@/views/classes/Classes'),
      },
      // 教学计划页面
      {
        path: '/teachingPlan',
        component: () => import('@/views/teachingPlan/TeachingPlan'),
      },
      // 课程页面
      {
        path: '/course',
        component: () => import('@/views/course/Course'),
      },
      // 试题类型页面
      {
        path: '/questionType',
        component: () => import('@/views/questionType/QuestionType'),
      },
      // 用户列表页面
      {
        path: '/user',
        component: () => import('@/views/user/User'),
      },
      // 个人信息页面
      {
        path: '/personalInformation',
        component: () => import('@/views/user/PersonalInformation'),
      },
      // 选课页面
      {
        path: '/courseSelection',
        component: () => import('@/views/courseSelection/CourseSelection'),
      },
      // 试题页面
      {
        path: '/testQuestions/:courseGroupId',
        component: () => import('@/views/testQuestions/TestQuestions'),
      },
      // 试题首页 课程组选择
      {
        path: '/testQuestions/index',
        component: () => import('@/views/testQuestions/Index'),
      },
      // 课程组页面
      {
        path: '/courseGroup',
        component: () => import('@/views/courseGroup/CourseGroup'),
      },
      // 课程试题页面
      {
        path: '/courseTestQuestions',
        component: () => import('@/views/courseTestQuestions/CourseTestQuestions'),
      },
      // 试卷管理页面
      {
        path: '/testPaper',
        component: () => import('@/views/testPaper/TestPaper'),
      },
      // 待设置试卷页面
      {
        path: '/setTestPaper',
        component: () => import('@/views/testPaper/setTestPaper'),
      },
      // 已设置试卷页面
      {
        path: '/completeSetupTestPaper',
        component: () => import('@/views/testPaper/CompleteSetupTestPaper'),
      },
      // 数据导入页面
      {
        path: '/excelImport',
        component: () => import('@/views/dataImport/ExcelImport'),
      },
    ],
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});
// 路由守卫 前置拦截
router.beforeEach((to, from, next) => {
  // 判断是否是登陆或者注册页 如果是 则放行
  // eslint-disable-next-line eqeqeq
  if (to.path == '/login' || to.path == '/user/register') {
    next();
    return;
  }
  // 在localStorage中获取token 判断是否存在 如果存在则放行
  const token = localStorage.getItem('token');
  // eslint-disable-next-line eqeqeq
  if (token != null && token != '') {
    next();
    return;
  }
  // 不存在则跳转到登陆页
  next('/login');
});
export default router;

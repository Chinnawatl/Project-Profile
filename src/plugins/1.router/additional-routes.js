export const redirects = [
  // ℹ️ We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: '/',
    name: 'index',
    redirect: to => {
      // TODO: Get type from backend
      const userData = useCookie('userData')
      const userRole = userData.value?.role
      
      
      if (userRole){
        return { name: 'dashboard' }
      }
        
      // if (userRole === 'client')
      //   return { name: 'access-control' }
      
      return { name: 'login', query: to.query }

    },
  },
  {
    path: '/login',
    redirect: to => {
      // TODO: Get type from backend
      const userData = useCookie('userData')
      const userRole = userData.value?.role
      if (userRole === 'user'){
        return { name: 'dashboard' }
      }
        
      // if (userRole === 'client')
      //   return { name: 'access-control' }
      
      return { name: 'login', query: to.query }

    },
  },
]
export const routes = [
    
    
    // Email filter
    {
      path: '/apps/email/filter/:filter',
      name: 'apps-email-filter',
    },
    
    {
      path: "/EEC-NETs",
      name: "eecnets-eec-nets",
      component: () => import("@/pages/EEC-NETs/eecNets.vue"),
      meta: {
        restriction: ["super admin","admin","user",'dev']
      },
    },
    {
      path: "/EEC-NETs/Form-Add",
      name: "eecnets-eec-nets-form-add",
      component: () => import("@/pages/EEC-NETs/eecNetsFormAdd.vue"),
      meta: {
        restriction: ["super admin","admin","user",'dev']
      },
    },
    {
      path: "/EEC-NETs/EecNetsData-Edit/:id",
      name: "eecnets-edit-eec-nets-data",
      component: () => import("@/pages/EEC-NETs/editEecNetsData.vue"),
      meta: {
        restriction: ["super admin","admin","user",'dev']
      },
    },    
    { 
      path: "/TypeA/Gradute/:id",
      name: "type-agradute",
      component: () => import("@/pages/TypeA/Gradute.vue"),
      meta: {
        restriction: ["super admin","admin",'dev']
      },
    },
    {
      path: "/TypeA/curriculum",
      name: "type-acurriculum-type-a",
      component: () => import("@/pages/TypeA/curriculumTypeA.vue"),
      meta: {
        restriction: ["super admin","admin","user","External",'dev']
      },
    },
    {
      path: "/TypeA/addGraduate/:id",
      name: "type-aadd-graduate",
      component: () => import("@/pages/TypeA/addGraduate.vue"),
      meta: {
        restriction: ["super admin","admin","user",'dev']
      },
    },
    {
      path: "/accountlist", 
      name: "manage-account-account-list",
      component: () => import("@/pages/ManageAccount/accountList.vue"),
      meta: {
        restriction: ["super admin",'dev']
      },
    },
    {
      path: "/Account-Add",
      name: "/manage-account-add-account",
      component: () => import("@/pages/ManageAccount/addAccount.vue"),
      meta: {
        restriction: ["super admin",'dev']
      },
    },
    {
      path: "/TypeA/Curriculum-Add",
      name: "type-aadd-curriculum",
      component: () => import("@/pages/TypeA/addCurriculum.vue"),
      meta: {
        restriction: ["super admin","admin","user",'dev']
      },
    }, 
    {
      path: '/matching/Position-Edit/:id',
      name: 'matching-edit-deman',
      component: () => import('@/pages/matching/editDeman.vue'),
      meta: {
        restriction: ["super admin","admin","user",'dev']
      },
    },
    {
      path: '/matching/Manage-Position',
      name: 'matching-manage-deman',
      component: () => import('@/pages/matching/manageDeman.vue'),
      meta: {
        restriction: ["super admin","admin","user",'dev']
      },
    },
    {
      path: '/matching/Position-Add',
      name: 'matching-add-deman',
      component: () => import('@/pages/matching/addDeman.vue'),
      meta: {
        restriction: ["super admin","admin","user",'dev']
      },
    },
    {
      path: '/matching/positionMatch/:id',
      name: 'matching-supply-match',
      component: () => import('@/pages/matching/supplyMatch.vue'),
      meta: {
        restriction: ["super admin","admin","user","External",'dev']
      },
    },
    {
      path: '/matching/courseMatch/:id',
      name: 'matching-deman-match',
      component: () => import('@/pages/matching/demanMatch.vue'),
      meta: {
        restriction: ["super admin","admin","user","External",'dev']
      },
    },
    {
      path: '/matching/position',
      name: 'matching-deman',
      component: () => import('@/pages/matching/deman.vue'),
      meta: {
        restriction: ["super admin","admin","user","External",'dev']
      },
    },
    {
      path: '/matching/course',              
      name: 'matching-supply',
      component: () => import('@/pages/matching/supply.vue'),
      meta: {
        restriction: ["super admin","admin","user","External",'dev']
      },
    },
    {
      path: '/TypeA/editCurriculum/:id',
      name: 'type-aedit-curriculum',
      component: () => import('@/pages/TypeA/editCurriculum.vue'),
      meta: {
        restriction: ["admin",'dev']
      },
    },
    {
      path: '/profile/editProfile/:id',
      name: 'profile-edit-profile',
      component: () => import('@/pages/profile/editProfile.vue'),
      meta: {
        restriction: ["super admin","admin","user","External",'dev']
      },
    },
    //type B
    {
      path: "/typeB/formEB01/:type?/:data?",
      name: "type-bform-eb01",
      component: () => import("@/pages/typeB/formEB01.vue"),
      meta: {
        restriction: ["super admin","admin","user",'dev']
      },
    },
    {
      path: "/typeB/formEB02/:type?/:data?",
      name: "type-bform-eb02",
      component: () => import("@/pages/typeB/formEB02.vue"),
      meta: {
        restriction: ["user",'dev']
      },
    },

    {
      path: "/typeB/formEB03/:id?",
      name: "type-bform-eb03",
      component: () => import("@/pages/typeB/formEB03.vue"),
      meta: {
        restriction: ["user",'dev']
      },
    },

    {
      path: "/typeB/formEB04/:id?",
      name: "type-bform-eb04",
      component: () => import("@/pages/typeB/formEB04.vue"),
      meta: {
        restriction: ["user",'dev']
      },
    },

    {
      path: "/typeB/management-Course",
      name: "type-bmanagement-course",
      component: () => import("@/pages/typeB/managementCourse.vue"),
      meta: {
        restriction: ["super admin","admin","user",'dev']
      },
    },
    {
      path: "/typeB/Management-Training",
      name: "type-bmanagement-training",
      component: () => import("@/pages/typeB/managementTraining.vue"),
      meta: {
        restriction: ["user",'dev']
      },
    },

    {
      path: "/typeB/management-CourseApprovals",
      name: "type-bmanagement-course-approvals",
      component: () => import("@/pages/typeB/managementCourseApprovals.vue"),
      meta: {
        restriction: ["super admin",'dev']
      },
    },
    {
      path: "/typeB/Management-TrainingApprovals",
      name: "type-bmanagement-training-approvals",
      component: () => import("@/pages/typeB/managementTrainingApprovals.vue"),
      meta: {
        restriction: ["super admin","admin",'dev']
      },
    },
    {
    //end type B
      path: '/ManageAccount/viewaccount/:id',
      name: 'manage-account-viewaccount',
      component: () => import('@/pages/ManageAccount/viewaccount.vue'),
      meta: {
        restriction: ["super admin",'dev']
      },
    },
    {
      path: '/ManageAccount/editAccount/:id',
      name: 'manage-account-edit-account',
      component: () => import('@/pages/ManageAccount/editAccount.vue'),
      meta: {
        restriction: ["super admin",'dev']
      },
    },
       {
        path: '/My-Course',
        name: 'profile-my-course',
        component: () => import('@/pages/profile/MyCourse.vue'),
        meta: {
          restriction: ["super admin","admin","user","External",'dev']
        },
       },
       {
        path: '/Manage/Profile',
        name: 'profile-manage-profile',
        component: () => import('@/pages/profile/manageProfile.vue'),
        meta: {
          restriction: ["super admin","admin","user","External",'dev']
        },
       },
       {
        path: '/Register',
        name: '/register',
        component: () => import('@/pages/register.vue'),
        meta: {
          restriction: ["super admin","admin","user","External",'dev']
        },
       },
]

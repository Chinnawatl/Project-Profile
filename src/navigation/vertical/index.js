export default [
  {
    title: 'sidebar.dashboard',
    to: { name: 'dashboard' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'PRsidebar',
    children: [
      {title: 'PR.home.sidebar', to: 'public-relation-home', icon: {icon: 'tabler-home-2'},
        role: ['user','admin','super admin','dev']
      },{
        title: 'PR.course.sidebar', to: 'public-relation-course', icon: {icon: 'tabler-book-2'},
        role: ['user','admin','super admin','dev']
      },{
        title: 'PR.jobV.sidebar', to: 'public-relation-job-vacancies', icon: {icon: 'tabler-briefcase'},
        role: ['user','admin','super admin','dev']
      },{
        title: 'PR.eecNets.sidebar', to: 'public-relation-eec-nets', icon: {icon: 'tabler-world-up'},
        role: ['user','admin','super admin','dev']
      },{
        title: 'PR.general.sidebar', to: 'public-relation-public-relation', icon: {icon: 'tabler-brand-open-source'},
        role: ['user','admin','super admin','dev']
      },{
        title: 'จัดการประชาสัมพันธ์', to: 'public-relation-manage-public-relation', icon: {icon: 'tabler-settings'},
        role: ['admin','super admin','dev']
      },
    ],
    icon: {icon: 'tabler-speakerphone'},
  },
  {
    title: 'sidebar.myCourse',
    to: { name: 'profile-my-course' },
    icon: { icon: 'tabler-book' },
    roles: ['user','admin','super admin','External','dev'], // กำหนดโรลที่สามารถเข้าถึงได้
  },
  {
    title: 'sidebar.matching',
    children: [
      { title: 'sidebar.subMatch.match', to: 'matching-deman',icon: { icon: 'tabler-lock' } },
      { title: 'sidebar.subMatch.managePosition', to: 'matching-manage-deman',icon: { icon: 'tabler-lock' },roles:['user','super admin','dev'] },
    ],
    icon: { icon: 'tabler-layers-difference' },
    roles: ['user','admin','super admin','External','dev'],
  },
  {
    title: 'sidebar.typeA',
    children: [
      { title: 'sidebar.subA.course', to: 'type-acurriculum-type-a',icon: { icon: 'tabler-certificate' } },
      
    ],
    icon: { icon: 'tabler-certificate' },
    roles: ['user','admin','super admin','dev'],
  },
  
  {
    title: 'sidebar.typeB',
    children: [
      {title: 'sidebar.subB.manageCourse', to: 'type-bmanagement-course', icon: { icon: 'tabler-book'},
      roles: ['user','admin','super admin','dev']},
      {title: 'sidebar.subB.approveAcceptCourse', to: 'type-bmanagement-course-approvals', icon: { icon: 'tabler-book'},
      roles: ['super admin','dev']},
      {title: 'sidebar.subB.manageTraining', to: 'type-bmanagement-training', icon: { icon: 'tabler-book'},
      roles: ['user','dev']},
      {title: 'sidebar.subB.approveAcceptTraining', to: 'type-bmanagement-training-approvals', icon: { icon: 'tabler-book'},
      roles: ['admin','dev']},

      // ใช้ดูเดียวลบออก
      // {title: 'EB01', to: 'type-bform-eb01', icon: { icon: 'tabler-book'}},
      // {title: 'EB02', to: 'type-bform-eb02', icon: { icon: 'tabler-book'}},
      // {title: 'EB03', to: 'type-bform-eb03', icon: { icon: 'tabler-book'}},
      // {title: 'EB04', to: 'type-bform-eb04', icon: { icon: 'tabler-book'}},

    ],
    icon: { icon: 'tabler-certificate' },
    roles: ['user','admin','super admin','dev'],
  },
  {
    title: 'sidebar.eecNets',
    to: { name: 'eecnets-eec-nets' },
    icon: { icon: 'tabler-world' },
    roles: ['user','admin','super admin','dev'],
  },
  {
    title: 'sidebar.manageAccount',
    to: { name: 'manage-account-account-list' },
    icon: { icon: 'tabler-certificate' },
    roles: ['user','admin','super admin','dev'],
  },
]

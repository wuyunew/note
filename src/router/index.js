import { createRouter, createWebHistory } from 'vue-router'
const router=createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            redirect:'/doc'
        },
        {
            path:'/doc',
            component:()=>import('../views/doc.vue')
        }
    ]
})

export default router

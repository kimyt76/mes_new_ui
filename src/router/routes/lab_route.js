/** 연구 관리 */
export default [
      {
        path:'ingredient',
        name:'Ingredient',
        component: () => import('@/views/lab/ingredient/IngredientList.vue')
      },
      {
        path:'material',
        name:'MaterialList',
        component: () => import('@/views/lab/material/MaterialList.vue')
      },
      {
        path:'recipe',
        name:'RecipeList',
        component: () => import('@/views/lab/recipe/RecipeList.vue')
      },
      {
        path:'newMaterail',
        name:'NewMaterialList',
        component: () => import('@/views/lab/newmaterial/NewMaterialList.vue')
      },
      {
        path:'newMaterialDetail/:id?',
        name:'NewMaterialDetail',
        component: () => import('@/views/lab/newmaterial/NewMaterialDetailPop.vue'),
        props: true,
      },
      {
        path:'sample',
        name:'SampleList',
        component: () => import('@/views/lab/sample/SampleList.vue')
      },
      {
          path:'sampleDetail/:id?',
          name:'SampleDetail',
          component: () => import('@/views/lab/sample/SampleDetailPop.vue'),
          props: true,
        },
        {
          path:'bom',
          name:'BomList',
          component: () => import('@/views/lab/bom/BomList.vue')
        },
        {
          path:'bomHist',
          name:'BomHist',
          component: () => import('@/views/lab/bom/BomHistList.vue')
        },
        {
          path:'matBom',
          name:'MatBomList',
          component: () => import('@/views/lab/bomMat/BomMatList.vue')
        },

    ]

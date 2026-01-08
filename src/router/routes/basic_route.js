/** 기본관리 */
export default [

      {
        path: 'itemList',
        name: 'ItemList',
        component: () => import('@/views/basic/item/ItemList.vue')
      },
    //   {
    //     path: 'itemSubCd',
    //     name: 'ItemSubCd',
    //     component: () => import('@/views/basic/item/ItemSubCd.vue'),
    //   },
      {
        path: 'itemThird',
        name: 'ItemThird',
        component: () => import('@/views/basic/item/ItemThird.vue'),
      },
      {
        path: 'itemInfoList',
        name: 'ItemInfoList',
        component: () => import('@/views/basic/item/ItemInfoList.vue')
      },
      {
        path: 'customerList',
        name: 'CustomerList',
        component: () => import('@/views/basic/customer/CustomerList.vue')
      },
      {
        path: 'storageList',
        name: 'StorageList',
        component: () => import('@/views/system/storage/StorageList.vue')
      },
    ]


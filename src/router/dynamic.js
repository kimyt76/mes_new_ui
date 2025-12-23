import router from './index'

// 메뉴 JSON → router record 변환
function createRouteFromMenu(item) {
  if (!item.to) return null

  return {
    path: item.to,
    component: () => import(`@/views${item.to}.vue`)
  }
}

export function addDynamicRoutes(menuList) {
  const routeList = []

  function scanMenu(list) {
    list.forEach(item => {
      if (item.items) {
        scanMenu(item.items)
      } else {
        const r = createRouteFromMenu(item)
        if (r) routeList.push(r)
      }
    })
  }

  scanMenu(menuList)

  // 실제 router에 추가
  routeList.forEach(r => {
    router.addRoute('layout', r)
  })
}

<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: '기본 관리',
        items: [
            {
                label: '기본정보',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '품목관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/basic/itemlist'
                    },
                    {
                        label: '품목정보관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/basic/itemInfoList'
                    },
                    {
                        label: '거래처관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/basic/customerList'
                    },
                ]
            },
            {
                label: '기타관리',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '생산실적',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/order/contractList'
                    },
                    {
                        label: '생산수욜',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/order/shipmentList'
                    },
                    {
                        label: '생산일보',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/order/ingredient'
                    },
                    {
                        label: '업무별생산량',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/order/ingredient'
                    }
                ]
            },
        ]
    },
    {
        label: '연구 및 BOM 관리',
        items: [
            {
                label: '연구관리',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '성분정보',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/lab/ingredient'
                    },
                    {
                        label: '원료관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/lab/material'
                    },
                    {
                        label: '처방리스트',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/lab/recipe'
                    },
                    {
                        label: '신원료정보',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/lab/newMaterail'
                    },
                    {
                        label: '샘플송부관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/lab/sample'
                    },
                ]
            },
            {
                label: 'BOM관리',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '반제품BOM',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/lab/bom'
                    },
                    {
                        label: 'BOM이력관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/lab/bomHist'
                    },
                    {
                        label: '공정별BOM',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/lab/matBom'
                    }
                ]
            },
        ]
    } ,
    {
        label: '영업 및 영업관리',
        items: [
            {
                label: '영업관리',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '고객사관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/order/clientList'
                    },
                    {
                        label: '사양서검토',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/order/draftList'
                    },
                    {
                        label: '주문서관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/order/contractList'
                    },
                    {
                        label: '출하관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/order/shipmentList'
                    },
                    {
                        label: '판매관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/order/saleList'
                    },
                    {
                        label: '진행관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/order/progressList'
                    },
                ]
            },
            {
                label: '영업부',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '영업부 관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/order/business'
                    },
                ]
            },

        ]
    } ,
    {
        label: '발주 및 구매관리',
        items: [
            {
                label: '발주관리',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '발주등록(생산)',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/purchase/matOrderM'
                    },
                    {
                        label: '발주등록(구매)',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/purchase/matOrderP'
                    },
                ]
            },
            {
                label: '구매관리',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '구매(생산)',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/purchase/purchaseTranM'
                    },
                    {
                        label: '구매(구매)',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/purchase/purchaseTranP'
                    },
                    {
                        label: '구매현황',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/purchase/tranCurrent'
                    },
                ]
            },
        ]
    },
    {
        label: '제조 계획 및 생산관리',
        items: [
            {
                label: '제조계획관리',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '예상제조계획',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/mat/matPlan'
                    },
                    {
                        label: '소요량계산',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/mat/equirementCalculation'
                    },
                    {
                        label: '원재료별 소요품목',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/mat/itemM1Equirment'
                    },
                ]
            },
            {
                label: '작업지시',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '작업지시',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/prod/workOrderList'
                    },
                    {
                        label: '작업지시현황',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/prod/workOrderProgressList'
                    },
                    {
                        label: '작업자관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/prod/workOrderUserList'
                    },
                ]
            },
            {
                label: '칭량공정',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '작업지시',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/weigh'
                    },
                    {
                        label: '공정검사',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/weigh/procTest'
                    },
                    {
                        label: '제조출고',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/weigh/matOut'
                    },
                    {
                        label: '자재불출',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/weigh/itemOUt'
                    },
                    {
                        label: '일일마감',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/weigh/dayDeadline'
                    },
                    {
                        label: '월간마감',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/weigh/monDeadline'
                    },
                    {
                        label: '폐기조정',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/weigh/disposalAdjustment'
                    },
                ]
            },
            {
                label: '제조공정',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '작업지시',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/mat/mat'
                    },
                    {
                        label: '공정검사',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/procmat/processTest'
                    },
                    {
                        label: '제조출고',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/matOut'
                    },
                ]
            },
            {
                label: '코팅공정',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '작업지시',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/coating/coating'
                    },
                    {
                        label: '공정검사',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/coating/coatingProcessTest'
                    },
                    {
                        label: '제조출고',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/coating/coatingMatOut'
                    },
                ]
            },
            {
                label: '충전공정',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '작업지시',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/charge/charge'
                    },
                    {
                        label: '공정검사',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/charge/chargeProcessTest'
                    },
                    {
                        label: '제조출고',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/charge/chargeMatOut'
                    },
                ]
            },
            {
                label: '포장공정',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '작업지시',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/packing/packing'
                    },
                    {
                        label: '공정검사',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/packing/packingProcessTest'
                    },
                    {
                        label: '제조출고',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/proc/packing/packingMatOut'
                    },
                ]
            },
        ]
    },



    {
        label: '재고관리 및 조사',
        items: [
            {
                label: '재고관리',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '재고조회',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/stock/stock'
                    },
                    {
                        label: '원재료수불부',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/stock/rawMat'
                    },
                    {
                        label: '품목별사용량',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/stock/itemUse'
                    },
                    {
                        label: '시험번호별 사용현황',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/stock/testUse'
                    },
                    {
                        label: '사용기한',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/stock/useBy'
                    },
                ]
            },
            {
                label: '재고조사',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '재고조사',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/stock/inventory'
                    },
                    {
                        label: '실사재고',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/stock/actualInventory'
                    },
                ]
            },
        ]
    },
    {
        label: '시스템 관리',
        items: [
            {
                label: '시스템 관리',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    {
                        label: '사용자관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/system/userMgmt'
                    },
                    {
                        label: '공통코드관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/system/commonMgmt'
                    },
                    {
                        label: '권한관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/system/auth'
                    },
                    {
                        label: '창고관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/system/storage'
                    },
                    {
                        label: '메뉴관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/system/menu'
                    },
                ]
            },
            {
                label: '장비 관리',
                icon: 'pi pi-fw pi-check-square',
                items:[
                    // {
                    //     label: '중량측정이력',
                    //     icon: 'pi pi-fw pi-id-card',
                    //     to: '/equipment/shipmentList'
                    // },
                    {
                        label: '저울관리',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/system/scale'
                    },
                ]
            },
        ]
    },


]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item
                v-if="!item.separator"
                :item="item" :index="i">
            </app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>

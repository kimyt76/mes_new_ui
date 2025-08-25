<template>
<v-breadcrumbs
    :items="['MES', '영업관리', '진행현황']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="srhProgressList">
        <v-col class="d-flex flex-row ga-3">
          <v-text-field
          v-model="form.itemName"
          density="compact"
          label="품목명"
          variant="underlined"
          placeholder="품목명을 입력해주세요"
          style="width: 180px;"
          />
        <v-text-field
          v-model="form.managerName"
          density="compact"
          label="담당자"
          placeholder="담당자를 입력해주세요"
          variant="underlined"
          style="width: 150px;"
          />
        <v-text-field
          v-model="form.customerName"
          density="compact"
          label="거래처명"
          placeholder="거래처명을 입력해주세요"
          variant="underlined"
          style="width: 180px;"
          />
          <v-btn
            text="조회"
            color="brown-lighten-4"
            type="submit"
            />
          <v-btn
            text="초기화"
            @click="srhForm.reset()"
            />
        </v-col>
      </v-form>
    </v-row>
    </v-card-text>
  </v-card>
  <v-spacer></v-spacer>
  <v-row>
    <v-col class="d-flex justify-end align-center mr-2" style="gap: 10px; margin-top: 10px;">
      <v-btn
        class="excel-btn"
        text="엑셀"
        prepend-icon="mdi-microsoft-excel"
        @click="excel"
        />
    </v-col>
  </v-row>
  <v-row>
    <v-col class="pa-0">
      <div class="table-container">
      <v-data-table
        :headers="headers"
        :items="progressList"
        :loading="loading"
        :items-per-page="15"
        no-data-text="데이터가 없습니다."
        loading-text="조회중입니다 잠시만 기다려주세요"
        density="compact"
        height="690px"
        >

        <!-- <template v-slot:item.firstColumn="{ columns }"> -->
        <template v-slot:headers="{ columns }">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              style="height: 40px;"
              :style="{textAlign: 'center', width: column.width || 'auto'} "
              >
              {{ column.title }}
            </th>
          </tr>
        </template>

        <template #item.contractDateSeq="{ item, index }">
            {{ item.contractDateSeq }}
        </template>
        <template #item.itemName="{ item, index }">
            {{ item.itemName }}
        </template>
        <template #item.totQty ="{ item }">
          {{ formatComma(item.totQty) }}
        </template>
        <template #item.qty ="{ item }">
          {{ formatComma(item.qty) }}
        </template>
        <template #item.unitPrice ="{ item }">
          {{ formatComma(item.unitPrice) }}
        </template>
        <template #item.supplyPrice ="{ item }">
          {{ formatComma(item.supplyPrice)}}
        </template>
        <template #item.vatPrice ="{ item }">
          {{ formatComma(item.vatPrice)}}
        </template>
        <template #item.totPrice ="{ item }">
          {{ formatComma(item.totPrice)}}
        </template>
        <template #item.statusType="{ item, index }">
            {{ item.statusType === 'ING' ?  '진행중' : '종료'}}
        </template>
        <template #item.printYn="{ item, index }">
           <p style="padding: 4px;
              text-align: center;
              cursor: pointer;"
              :style="{backgroundColor: item.printYn === 'Y' ? '#FFAB91' : 'transparent'}"
              @click="onPrint"
            >인쇄
          </p>
        </template>
      </v-data-table>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { useAuthStore } from '@/stores/auth';
import { onMounted, reactive, ref } from 'vue';
import { isEmpty, formatComma, todayKST, formatDate } from '@/util/common';

const { userId } = useAuthStore()

const progressList = ref([])
const loading = ref(false)
const srhForm = ref('')
const form = reactive({
  itemName: '',
  managerName: '',
  customerName: '',

  userId: userId,
})

const headers = ref([
  { title: '품목코드',  key: 'itemCd',        align: 'center', width: '110px'   },
  { title: '품목명',    key: 'itemName',      align: 'start',   width: '500px'  },
  { title: '고객사',    key: 'customerName',  align: 'start',   width: '300px' },
  { title: '수주일',    key: 'contractDate',  align: 'center', width: '120px'  },
  { title: '판매일',    key: 'saleDate',      align: 'center', width: '120px'  },
  { title: '출하일',    key: 'shipmentDate',  align: 'center', width: '120px'  },
  { title: '총수량',    key: 'totQty',        align: 'end',   width: '120px'     },
  { title: '담당자',    key: 'managerName',   align: 'center', width: '100px'},
  { title: '수량',      key: 'qty',           align: 'end',   width: '120px'     },
  { title: '단가',      key: 'unitPrice',     align: 'end',   width: '120px'    },
  { title: '공급가액',  key: 'supplyPrice',   align: 'end',   width: '120px'    },
  { title: '부가세',    key: 'vatPrice',      align: 'end',   width: '120px'    },
  { title: '합계금액',  key: 'totPrice',      align: 'end',   width: '120px'    },
  { title: '거래방법',  key: 'tradingMethod', align: 'center', width: '180px'    },
])

/**
 * 리스트 조회
 */
const srhProgressList = async () =>{
  try{
    loading.value = true
    const params = {
      ...form
    }
    progressList.value = await ApiOrder.getProgressList(params)
  }catch(err){

  }finally{
    loading.value =false
  }
}

/**
 * 초기화
 */
onMounted( async () =>{
  srhProgressList()
})

/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, progressList.value, '수주진행현황_목록')
}

</script>

<style>
@import '@/assets/css/main.css';
.table-container {
  overflow: auto; /* 가로 + 세로 스크롤 둘 다 허용 */
}

.table-container table {
  min-width: 2000px;   /* header width 합보다 크게 */
  border-collapse: collapse;
  table-layout: auto;
}

/* 헤더를 위에 고정*/
.table-container thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #BCAAA4;
  text-align: center;
}

/*
.table-container td {
  white-space: nowrap;
} */
 .table-container th:nth-child(1){
    position: sticky;
  left: 0;
  z-index: 3;
  background: #BCAAA4;
 }
.table-container td:nth-child(1) {
  position: sticky;
  left: 0;
  z-index: 3;
  background: #fff;
}

/* 두 번째 컬럼 (품목명) 고정 */
.table-container th:nth-child(2){
  position: sticky;
  left: 100px; /* 첫 번째 컬럼 width만큼 밀어줘야 겹치지 않음 */
  z-index: 3;
  background: #BCAAA4;
}


.table-container td:nth-child(2) {
  position: sticky;
  left: 120px; /* 첫 번째 컬럼 width만큼 밀어줘야 겹치지 않음 */
  z-index: 3;
  background: #fff;
}
</style>

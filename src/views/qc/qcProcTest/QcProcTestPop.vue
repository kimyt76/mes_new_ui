<template>
<div class="w-full mt-3">
    <table cellspacing="0" width="100%">
        <tbody>
            <tr>
                <th class="cellBorder cellHeader">품목코드</th>
                <td class="cellBorder">{{ form.itemCd }}</td>
                <th class="cellBorder cellHeader">품목명</th>
                <td class="cellBorder">{{ form.itemName }}</td>
                <th class="cellBorder cellHeader">고객사</th>
                <td class="cellBorder" colspan="3">{{ form.clientName }}</td>
            </tr>
            <tr>
                <th class="cellBorder cellHeader">제조일자</th>
                <td class="cellBorder">{{ form.procOrderDate }}</td>
                <th class="cellBorder cellHeader">제조번호</th>
                <td class="cellBorder">{{ form.makeNo }}</td>
                <th class="cellBorder cellHeader">표시량</th>
                <td class="cellBorder">{{ form.spec }}</td>
                <th class="cellBorder cellHeader">점검자</th>
                <td class="cellBorder">{{ form.testerName }}</td>
            </tr>
            <tr>
                <th class="cellBorder cellHeader">로트인쇄</th>
                <td class="cellBorder">{{ form.lotNo }} / {{ form.lotNo2 }} </td>
                <th class="cellBorder cellHeader">비고</th>
                <td class="cellBorder" colspan="5">
                    <Textarea v-model="form.etc" rows="1" class="w-full mt-1" style="resize: none;" />
                </td>
            </tr>
        </tbody>
    </table>
</div>

<div>

<div class="mt-3">
    <Tabs value="0">
        <TabList>
            <Tab value="0">검체채취</Tab>
            <Tab v-if="qcType != 'A'" value="1">코팅작업</Tab>
            <Tab value="2">충전작업</Tab>
            <Tab value="3">포장작업</Tab>
            <Tab v-if="qcType == 'B' || qcType == 'C'" value="4">중량검사</Tab>
            <Tab v-if="qcType == 'D'" value="5">중량검사</Tab>
            <Tab v-if="qcType == 'A'" value="6">중량검사</Tab>
            <Tab v-if="qcType == 'B' || qcType == 'C'" value="7">겔수량검사</Tab>
            <Tab v-if="qcType == 'C'" value="8">캡핑세기(완제품)</Tab>
            <Tab v-if="qcType == 'C'" value="9">중량검사(에센스)</Tab>
        </TabList>
        <TabPanels style="height: 500px; overflow-y: auto;">
            <TabPanel value="0">
                <table>
                    <tbody>
                        <tr>
                            <th class="cellBorder cellHeader">채취시기</th>
                            <th class="cellBorder cellHeader">채취일자</th>
                            <td class="cellBorder"></td>
                        </tr>
                        <tr>
                            <th rowspan="8" class="cellBorder cellHeader">작업중간</th>
                            <th class="cellBorder cellHeader">PH</th>
                            <td class="cellBorder">0</td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">안정성</th>
                            <td  class="cellBorder">0</td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">기능성</th>
                            <td class="cellBorder">0</td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">장기보존시험</th>
                            <td class="cellBorder">0</td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">누액</th>
                            <td class="cellBorder">0</td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">보관품</th>
                            <td class="cellBorder">0</td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">외관/이물/내용량</th>
                            <td class="cellBorder">0</td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">기타</th>
                            <td class="cellBorder">0</td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">작업중간(일별)</th>
                            <th class="cellBorder cellHeader">미생물</th>
                            <td class="cellBorder">0</td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader" colspan="2">총 채취량</th>
                            <td class="cellBorder">0</td>
                        </tr>
                    </tbody>
                </table>
            </TabPanel>
            <TabPanel value="1">
                <p class="m-0">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                    ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                </p>
            </TabPanel>
            <TabPanel value="2">
                <p class="m-0">
                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
                    qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                </p>
            </TabPanel>
        </TabPanels>
    </Tabs>
</div>

</div>

<div class="flex items-center gap-2">
    <div>
      <Button label="작성완료"/>
      <Button label="공정검사서"/>
  </div>
  <div>
    <Button label="작성완료"/>
  </div>
</div>





</template>

<script setup>
import { inject, onMounted, reactive, ref } from 'vue';



const dialogRef = inject('dialogRef')
const qcType = ref(null)
const form = reactive({
    itemCd: '',
    itemName: '',
    procOrderDate: '',
    makeNo: '',
    lotNo:'',
    lotNo2: '',
    spec: '',
    testerName: '',
    clientName: '',
    etc:''
})

onMounted( async () =>{
    qcType.value = dialogRef.value.data.type
    form.workBatchId = dialogRef.value.data.id
})

</script>

<style scoped>
.cellBorder {
  border-top: 0.5px solid #ccc;
  border-bottom: 0.5px solid #ccc;
  border-left: 0.5px solid #ccc;
  border-right: 0.5px solid #ccc;
  text-align: center;
  vertical-align: middle;
  width: 400px;
}
.cellHeader {
  background-color: #f0f0f0;
  font-weight: bold;
  width: 150px;
  height: 30px;
}
td .custom-cell {
  background-color: rgb(245 245 245);
}
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.tab-active {
  background: #2f6fff; /* 원하는 색 */
  color: white;
}
</style>

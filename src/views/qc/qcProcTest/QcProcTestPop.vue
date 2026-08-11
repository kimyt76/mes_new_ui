<template>
    <div class="w-full mt-3">
        <table cellspacing="0" width="100%">
            <tbody>
                <tr>
                    <th class="cellBorder cellHeader">품목코드</th>
                    <td class="cellBorder">{{ form.itemCd }}</td>
                    <th class="cellBorder cellHeader">품목명</th>
                    <td class="cellBorder" colspan="3">{{ form.itemName }}</td>
                    <th class="cellBorder cellHeader">고객사</th>
                    <td class="cellBorder">{{ form.clientName }}</td>
                </tr>
                <tr>
                    <th class="cellBorder cellHeader">제조일자</th>
                    <td class="cellBorder">{{ form.prodDate }}</td>
                    <th class="cellBorder cellHeader">제조번호</th>
                    <td class="cellBorder">{{ form.makeNo }}</td>
                    <th class="cellBorder cellHeader">표시량</th>
                    <td class="cellBorder">{{ form.displayCapacity }}</td>
                    <th class="cellBorder cellHeader">점검자</th>
                    <td class="cellBorder">{{ form.testerId }}</td>
                </tr>
                <tr>
                    <th class="cellBorder cellHeader">로트인쇄</th>
                    <td class="cellBorder">{{ form.lotNo }}</td>
                    <th class="cellBorder cellHeader">비고</th>
                    <td class="cellBorder" colspan="5">
                        <Textarea
                            v-model="form.etc"
                            rows="1"
                            class="w-full mt-1"
                            style="resize: none;"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div>
        <div class="mt-3">
            <Tabs v-model:value="activeTab">
                <!-- ============================== -->
                <!-- 탭 목록 -->
                <!-- ============================== -->
                <TabList>
                    <Tab value="S">검체채취</Tab>
                    <Tab v-if="qcType !== 'A'" value="QRC003" >코팅작업</Tab>
                    <Tab value="QRC004">충전작업</Tab>
                    <Tab value="QRC005">포장작업</Tab>
                    <!-- 중량검사 1X15 -->
                    <Tab v-if="qcType === 'B' || qcType === 'C'"value="WE115" >중량검사</Tab>
                    <!-- 중량검사 6X13 -->
                    <Tab v-if="qcType === 'D'"value="WE613">중량검사</Tab>
                    <!-- 중량검사 6X16 -->
                    <Tab v-if="qcType === 'A'" value="WE616">중량검사</Tab>
                    <!-- 겔수량검사 -->
                    <Tab v-if="qcType === 'B' || qcType === 'C'" value="GA115" >겔수량검사</Tab>
                    <!-- 캡핑세기 -->
                    <Tab v-if="qcType === 'C'" value="CA515" >캡핑세기(완제품)</Tab>
                    <!-- 중량검사 에센스 -->
                    <Tab v-if="qcType === 'C'" value="ES515">중량검사(에센스)</Tab>
                </TabList>

                <TabPanels style="height: 500px; overflow-y: auto;" >
                    <!-- ================================================= -->
                    <!-- 검체채취 -->
                    <!-- ================================================= -->
                    <TabPanel value="S">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-red-500">
                                * 항목 기입 후, 반드시 저장을 누르세요
                            </span>
                            <Button
                                label="검체채취 저장"
                                icon="pi pi-save"
                                class="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                                @click="saveInfo"
                            />
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <th class="cellBorder cellHeader">채취시기</th>
                                    <th class="cellBorder cellHeader">채취일자</th>
                                    <td class="cellBorder">
                                        <DatePicker
                                            v-model="sampleInfo.sampleDate"
                                            format="YYYY-MM-DD"
                                            placeholder="연도-월-일"
                                            class="w-full"
                                            showIcon
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th rowspan="8" class="cellBorder cellHeader">작업중간</th>
                                    <th class="cellBorder cellHeader">PH</th>
                                    <td class="cellBorder">
                                        <InputNumber v-model="sampleInfo.qty1" class="w-full" />
                                    </td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">안정성</th>
                                    <td class="cellBorder">
                                        <InputNumber v-model="sampleInfo.qty2" class="w-full" />
                                    </td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">기능성</th>
                                    <td class="cellBorder">
                                        <InputNumber v-model="sampleInfo.qty3" class="w-full" />
                                    </td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">장기보존시험</th>
                                    <td class="cellBorder">
                                        <InputNumber v-model="sampleInfo.qty4" class="w-full" />
                                    </td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">누액</th>
                                    <td class="cellBorder">
                                        <InputNumber v-model="sampleInfo.qty5" class="w-full"/>
                                    </td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">보관품</th>
                                    <td class="cellBorder">
                                        <InputNumber v-model="sampleInfo.qty6" class="w-full"/>
                                    </td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">외관/이물/내용량</th>
                                    <td class="cellBorder">
                                        <InputNumber v-model="sampleInfo.qty7" class="w-full" />
                                    </td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">기타</th>
                                    <td class="cellBorder">
                                        <InputNumber v-model="sampleInfo.qty8" class="w-full" />
                                    </td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">작업중간(일별)</th>
                                    <th class="cellBorder cellHeader">미생물</th>
                                    <td class="cellBorder">
                                        <InputNumber v-model="sampleInfo.qty9" class="w-full" />
                                    </td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader" colspan="2" >총 채취량</th>
                                    <td class="cellBorder">{{ totQty }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </TabPanel>
                    <!-- ================================================= -->
                    <!-- 코팅작업 -->
                    <!-- ================================================= -->
                    <TabPanel value="QRC003">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-red-500">* 항목 기입 후, 반드시 저장을 누르세요</span>
                            <Button
                                label="코팅작업 저장"
                                icon="pi pi-save"
                                class="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                                @click="saveInfo"
                            />
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <th class="cellBorder cellHeader">검사방법</th>
                                    <th class="cellBorder cellHeader">점검내용</th>
                                    <th class="cellBorder cellHeader">점검결과</th>
                                    <th class="cellBorder cellHeader">점검자</th>
                                </tr>
                                <tr
                                    v-for="(item, index) in methodTestList"
                                    :key="item.qcProcTestDtlId || index"
                                >
                                    <td class="cellBorder">{{ item.testMethod }}</td>
                                    <td class="cellBorder">{{ item.testItem }}</td>
                                    <td class="cellBorder">
                                        <div class="flex justify-center gap-4">
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.testResult"
                                                    :inputId="`charge-good-${index}`"
                                                    :name="`charge-result-${index}`"
                                                    value="Y"
                                                />
                                                <label :for="`charge-good-${index}`">양호</label>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.testResult"
                                                    :inputId="`charge-bad-${index}`"
                                                    :name="`charge-result-${index}`"
                                                    value="N"
                                                />
                                                <label :for="`charge-bad-${index}`">양호하지 않음</label>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="cellBorder">
                                         {{ item.testerId || form.testerId }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </TabPanel>
                    <!-- ================================================= -->
                    <!-- 충전작업 -->
                    <!-- ================================================= -->
                    <TabPanel value="QRC004">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-red-500">* 항목 기입 후, 반드시 저장을 누르세요</span>
                            <Button
                                label="충전작업 저장"
                                icon="pi pi-save"
                                class="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                                @click="saveInfo"
                            />
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <th class="cellBorder cellHeader">검사방법</th>
                                    <th class="cellBorder cellHeader">점검내용</th>
                                    <th class="cellBorder cellHeader">점검결과</th>
                                    <th class="cellBorder cellHeader">점검자</th>
                                </tr>
                                <tr
                                    v-for="(item, index) in methodTestList"
                                    :key="item.qcProcTestDtlId || index"
                                >
                                    <td class="cellBorder">{{ item.testMethod }}</td>
                                    <td class="cellBorder">{{ item.testItem }}</td>
                                    <td class="cellBorder">
                                        <div class="flex justify-center gap-4">
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.testResult"
                                                    :inputId="`charge-good-${index}`"
                                                    :name="`charge-result-${index}`"
                                                    value="Y"
                                                />
                                                <label :for="`charge-good-${index}`">양호</label>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.testResult"
                                                    :inputId="`charge-bad-${index}`"
                                                    :name="`charge-result-${index}`"
                                                    value="N"
                                                />
                                                <label :for="`charge-bad-${index}`">양호하지 않음</label>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="cellBorder">
                                         {{ item.testerId || form.testerId }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </TabPanel>
                    <!-- ================================================= -->
                    <!-- 포장작업 -->
                    <!-- ================================================= -->
                    <TabPanel value="QRC005">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-red-500">* 항목 기입 후, 반드시 저장을 누르세요</span>
                            <Button
                                label="포장작업 저장"
                                icon="pi pi-save"
                                class="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                                @click="saveInfo"
                            />
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <th class="cellBorder cellHeader">검사방법</th>
                                    <th class="cellBorder cellHeader">점검내용</th>
                                    <th class="cellBorder cellHeader">점검결과</th>
                                    <th class="cellBorder cellHeader">점검자</th>
                                </tr>
                                <tr
                                    v-for="(item, index) in methodTestList" :key="item.orderDist">
                                    <td class="cellBorder">{{ item.testMethod }}</td>
                                    <td class="cellBorder">{{ item.testItem }}</td>
                                    <td class="cellBorder">
                                        <div class="flex justify-center gap-4">
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.testResult"
                                                    :inputId="`packing-good-${index}`"
                                                    :name="`packing-result-${index}`"
                                                    value="Y"
                                                />
                                                <label :for="`packing-good-${index}`">양호</label>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <RadioButton v-model="item.testResult" :inputId="`packing-bad-${index}`" :name="`packing-result-${index}`" value="N" />
                                                <label :for="`packing-bad-${index}`" >양호하지 않음 </label>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="cellBorder">
                                        {{ item.testerId || form.testerId }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </TabPanel>
                    <!-- ================================================= -->
                    <!-- WE115 -->
                    <!-- ================================================= -->
                    <TabPanel value="WE115">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-red-500">* 항목 기입 후, 반드시 저장을 누르세요</span>
                            <Button
                                label="중량검사 저장"
                                icon="pi pi-save"
                                class="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                                @click="saveInfo"
                            />
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <th class="cellBorder cellHeader">검사시간</th>
                                    <th class="cellBorder cellHeader">중량</th>
                                    <th class="cellBorder cellHeader">점검결과</th>
                                </tr>
                                <tr
                                    v-for="(item, index) in detailList" :key="item.orderDist"
                                >
                                    <td class="cellBorder">
                                        <input type="time" v-model="item.testTime" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line1" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <div class="flex justify-center gap-4">
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.passYn"
                                                    :inputId="`we115-good-${index}`"
                                                    :name="`we115-result-${index}`"
                                                    value="Y"
                                                />
                                                <label :for="`we115-good-${index}`">적합</label>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.passYn"
                                                    :inputId="`we115-bad-${index}`"
                                                    :name="`we115-result-${index}`"
                                                    value="N"
                                                />
                                                <label :for="`we115-bad-${index}`" >부적합</label>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </TabPanel>
                    <!-- ================================================= -->
                    <!-- WE613 -->
                    <!-- ================================================= -->
                    <TabPanel value="WE613">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-red-500">* 항목 기입 후, 반드시 저장을 누르세요</span>
                            <Button
                                label="중량검사 저장"
                                icon="pi pi-save"
                                class="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                                @click="saveInfo"
                            />
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <th class="cellBorder cellHeader">검사시간</th>
                                    <th class="cellBorder cellHeader">중량</th>
                                    <th class="cellBorder cellHeader">점검결과</th>
                                </tr>
                                <tr
                                    v-for="(item, index) in detailList" :key="item.orderDist" >
                                    <td class="cellBorder">
                                        <input type="time" v-model="item.testTime" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line1" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <div class="flex justify-center gap-4">
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.passYn"
                                                    :inputId="`we613-good-${index}`"
                                                    :name="`we613-result-${index}`"
                                                    value="Y"
                                                />
                                                <label :for="`we613-good-${index}`">적합</label>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.passYn"
                                                    :inputId="`we613-bad-${index}`"
                                                    :name="`we613-result-${index}`"
                                                    value="N"
                                                />
                                                <label :for="`we613-bad-${index}`">부적합</label>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </TabPanel>
                    <!-- ================================================= -->
                    <!-- WE616 -->
                    <!-- ================================================= -->
                    <TabPanel value="WE616">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-red-500">* 항목 기입 후, 반드시 저장을 누르세요</span>
                            <Button
                                label="라인설정"
                                icon="pi pi-save"
                                class="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                                @click="linePop"
                            />
                            <Button
                                label="중량검사 저장"
                                icon="pi pi-save"
                                class="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                                @click="saveInfo"
                            />
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <th class="cellBorder cellHeader">검사시간</th>
                                    <th v-for="orderDist in 5" :key="orderDist" class="cellBorder cellHeader">
                                        {{ getLineName(orderDist) }}
                                    </th>
                                    <th class="cellBorder cellHeader">점검결과</th>
                                </tr>
                                <tr v-for="(item, index) in detailList" :key="item.orderDist">
                                    <td class="cellBorder">
                                        <input type="time" v-model="item.testTime" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line1" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line2" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line3" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line4" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line5" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <div class="flex justify-center gap-4">
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.passYn"
                                                    :inputId="`we613-good-${index}`"
                                                    :name="`we613-result-${index}`"
                                                    value="Y"
                                                />
                                                <label :for="`we613-good-${index}`">적합</label>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.passYn"
                                                    :inputId="`we613-bad-${index}`"
                                                    :name="`we613-result-${index}`"
                                                    value="N"
                                                />
                                                <label :for="`we613-bad-${index}`">부적합</label>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </TabPanel>
                    <!-- ================================================= -->
                    <!-- GA115 -->
                    <!-- ================================================= -->
                    <TabPanel value="GA115">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-red-500">* 항목 기입 후, 반드시 저장을 누르세요</span>
                            <Button
                                label="겔수량검사 저장"
                                icon="pi pi-save"
                                class="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                                @click="saveInfo"
                            />
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <th class="cellBorder cellHeader">검사시간</th>
                                    <th class="cellBorder cellHeader">수량(매)</th>
                                    <th class="cellBorder cellHeader">점검결과</th>
                                </tr>
                                <tr
                                    v-for="(item, index) in detailList" :key="item.orderDist" >
                                    <td class="cellBorder">
                                        <input type="time" v-model="item.testTime" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line1" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <div class="flex justify-center gap-4">
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.passYn"
                                                    :inputId="`ga115-good-${index}`"
                                                    :name="`ga115-result-${index}`"
                                                    value="Y"
                                                />
                                                <label :for="`ga115-good-${index}`">적합</label>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.passYn"
                                                    :inputId="`ga115-bad-${index}`"
                                                    :name="`ga115-result-${index}`"
                                                    value="N"
                                                />
                                                <label :for="`ga115-bad-${index}`">부적합</label>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </TabPanel>
                    <!-- ================================================= -->
                    <!-- CA515 -->
                    <!-- ================================================= -->
                    <TabPanel value="CA515">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-red-500">* 항목 기입 후, 반드시 저장을 누르세요</span>
                            <Button
                                label="라인설정"
                                icon="pi pi-save"
                                class="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                                @click="linePop"
                            />
                            <Button
                                label="캡핑세기 저장"
                                icon="pi pi-save"
                                class="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                                @click="saveInfo"
                            />
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <th class="cellBorder cellHeader">검사시간</th>
                                    <th v-for="orderDist in 5" :key="orderDist" class="cellBorder cellHeader">
                                        {{ getLineName(orderDist) }}
                                    </th>
                                    <th class="cellBorder cellHeader">점검결과</th>
                                </tr>
                                <tr
                                    v-for="(item, index) in detailList" :key="item.orderDist" >
                                    <td class="cellBorder">
                                        <input type="time" v-model="item.testTime" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line1" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line2" class="w-full"/>
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line3" class="w-full"/>
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line4" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line5" lass="w-full"/>
                                    </td>
                                    <td class="cellBorder">
                                        <div class="flex justify-center gap-4">
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.passYn"
                                                    :inputId="`ca515-good-${index}`"
                                                    :name="`ca515-result-${index}`"
                                                    value="Y"
                                                />
                                                <label :for="`ca515-good-${index}`">적합</label>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.passYn"
                                                    :inputId="`ca515-bad-${index}`"
                                                    :name="`ca515-result-${index}`"
                                                    value="N"
                                                />
                                                <label :for="`ca515-bad-${index}`" >부적합</label>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </TabPanel>
                    <!-- ================================================= -->
                    <!-- ES515 -->
                    <!-- ================================================= -->
                    <TabPanel value="ES515">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-red-500">* 항목 기입 후, 반드시 저장을 누르세요</span>
                            <Button
                                label="라인설정"
                                icon="pi pi-save"
                                class="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                                @click="linePop"
                            />
                            <Button
                                label="중량검사(에센스) 저장"
                                icon="pi pi-save"
                                class="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                                @click="saveInfo"
                            />
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <th class="cellBorder cellHeader">검사시간</th>
                                    <th v-for="orderDist in 5" :key="orderDist" class="cellBorder cellHeader">
                                        {{ getLineName(orderDist) }}
                                    </th>
                                    <th class="cellBorder cellHeader">점검결과</th>
                                </tr>
                                <tr
                                    v-for="(item, index) in detailList" :key="item.orderDist" >
                                    <td class="cellBorder">
                                        <input type="time" v-model="item.testTime" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line1" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line2" class="w-full"/>
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line3" class="w-full"/>
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line4" class="w-full" />
                                    </td>
                                    <td class="cellBorder">
                                        <InputNumber v-model="item.line5" lass="w-full"/>
                                    </td>
                                    <td class="cellBorder">
                                        <div class="flex justify-center gap-4">
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.passYn"
                                                    :inputId="`es515-good-${index}`"
                                                    :name="`es515-result-${index}`"
                                                    value="Y"
                                                />
                                                <label :for="`es515-good-${index}`">적합</label>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <RadioButton
                                                    v-model="item.passYn"
                                                    :inputId="`es515-bad-${index}`"
                                                    :name="`es515-result-${index}`"
                                                    value="N"
                                                />
                                                <label :for="`es515-bad-${index}`">부적합</label>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </TabPanel>

                </TabPanels>

            </Tabs>
        </div>
    </div>

    <div class="flex justify-end gap-2 mt-4">
        <Button label="작성완료" />
        <Button label="공정검사서(QC)" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
    </div>

</template>


<script setup>
import { ApiQc } from '@/api/apiQc'
import { useAlertStore } from '@/stores/alert'
import { useDialog } from 'primevue'
import { computed, inject, nextTick, onMounted, reactive, ref, watch } from 'vue'
import QcProcTesteLinePop from './QcProcTesteLinePop.vue'

const { vSuccess, vError, vInfo, vWarning} = useAlertStore()
const dialog = useDialog()
const linePop = () =>{
    dialog.open(QcProcTesteLinePop, {
        props:{
            header: '라인설정',
            madal: true,
            draggable: false,
        },
        data: {
            qcProcTestMstId : form.qcProcTestMstId,
            testType : activeTab.value
        },
        onClose: (event) => {
            if (event) {

            }
        }
    })
}

/* =========================================================
 * 기본 정보
 * ========================================================= */
const dialogRef = inject('dialogRef')
const activeTab = ref('S')
const qcType = ref(null)
const testState = ref(null)
/* =========================================================
 * Master
 * ========================================================= */
const form = reactive({
    itemCd: '',
    itemName: '',
    prodDate: '',
    procOrderDate: '',
    makeNo: '',
    lotNo: '',
    lotNo2: '',
    displayCapacity: '',
    spec: '',
    testerId: '',
    testerName: '',
    clientName: '',
    etc: '',

    testType: '',
    workBatchId: '',
    batchStatus: '',
    qcProcTestMstId: ''
})

/* =========================================================
 * 탭 타입 구분
 * ========================================================= */
const qrcTypes = [
    'QRC003',
    'QRC004',
    'QRC005'
]
const detailTypes = [
    'WE115',
    'WE613',
    'WE616',
    'GA115',
    'CA515',
    'ES515'
]
/* =========================================================
 * QRC 리스트
 *
 * QRC003 : 코팅
 * QRC004 : 충전
 * QRC005 : 포장
 * ========================================================= */
const methodTestList = ref([])
/* =========================================================
 * Detail 리스트 기본값 생성
 * ========================================================= */
const createDefaultDetailList = () => {
    return Array.from({ length: 15 },
        (_, index) => ({
            qcProcTestDetailId: null,
            testType: '',
            testTime: '',
            line1: 0,
            line2: 0,
            line3: 0,
            line4: 0,
            line5: 0,
            line6: 0,
            line7: 0,
            line8: 0,
            line9: 0,
            line10: 0,

            passYn: '',

            orderDist: index + 1
        })
    )
}
/* =========================================================
 * Detail 공통 리스트
 *
 * WE115
 * WE613
 * WE616
 * GA115
 * CA515
 * ES515
 * ========================================================= */
const detailList = ref(
    createDefaultDetailList()
)

const lineList = ref([])
const getLineName = (orderDist) => {
    const line = lineList.value.find(
        item => Number(item.orderDist) === Number(orderDist)
    )

    return line?.lineName || '()라인'
}

/* =========================================================
 * 검체채취
 * ========================================================= */
const createDefaultSampleInfo = () => ({
    sampleDate: '',
    qty1: 0,
    qty2: 0,
    qty3: 0,
    qty4: 0,
    qty5: 0,
    qty6: 0,
    qty7: 0,
    qty8: 0,
    qty9: 0
})

const sampleInfo = reactive(
    createDefaultSampleInfo()
)
/* =========================================================
 * 검체채취 초기화
 * ========================================================= */
const resetSampleInfo = () => {
    Object.assign(sampleInfo, createDefaultSampleInfo())
}
/* =========================================================
 * 총 채취량
 * ========================================================= */
const totQty = computed(() => {
    return (
        (sampleInfo.qty1 || 0) +
        (sampleInfo.qty2 || 0) +
        (sampleInfo.qty3 || 0) +
        (sampleInfo.qty4 || 0) +
        (sampleInfo.qty5 || 0) +
        (sampleInfo.qty6 || 0) +
        (sampleInfo.qty7 || 0) +
        (sampleInfo.qty8 || 0) +
        (sampleInfo.qty9 || 0)
    ).toFixed(1)
})

/* =========================================================
 * 저장
 * ========================================================= */
const saveInfo = async () => {
    try {
        const params = {
            qcProcTestMst: {
                qcProcTestMstId: form.qcProcTestMstId,
                testType: activeTab.value,
                workBatchId: form.workBatchId,
                batchStatus: form.batchStatus,
                etc: form.etc
            },
            qcProcSample: null,
            methodList: [],
            detailList: [],
            lineList: []
        }
        /* =============================================
         * 검체채취
         * ============================================= */
        if (activeTab.value === 'S') {
            params.qcProcSample = {
                ...sampleInfo,
                qcProcTestMstId: form.qcProcTestMstId
            }
        }
        /* =============================================
         * QRC
         * QRC003 / QRC004 / QRC005
         * ============================================= */
        else if (qrcTypes.includes(activeTab.value)) {
            params.methodList = methodTestList.value.map(item => ({
                ...item,

                qcProcTestMstId: form.qcProcTestMstId,
                testType: activeTab.value,

                testerId: item.testerId || form.testerId
            }))
        }
        /* =============================================
         * Detail
         * WE115 / WE613 / WE616 / GA115 / CA515 / ES515
         * ============================================= */
        else if (detailTypes.includes(activeTab.value)) {
            params.detailList = detailList.value
                    .map(item => ({
                        ...item,
                        qcProcTestMstId: form.qcProcTestMstId,
                        testType: activeTab.value
            }))
        }

        console.log('save params:',JSON.parse(JSON.stringify(params)))
        const res = await ApiQc.saveQcProcTestTabInfo(params)

        vSuccess('저장되었습니다.')
        /* =============================================
         * 저장 후 재조회
         * ============================================= */
        await loadTabData(
            form.qcProcTestMstId,
            activeTab.value
        )
    } catch (error) {
        vWarning('저장 중 오류가 발생했습니다.')
    }
}

/* =========================================================
 * 탭 변경
 * ========================================================= */
watch(activeTab, async (newValue) => {
        if (!form.qcProcTestMstId) {
            return
        }
        await loadTabData(
            form.qcProcTestMstId,
            newValue
        )
    }
)
/* =========================================================
 * 탭 데이터 조회
 * ========================================================= */
const loadTabData = async (qcProcTestMstId, testType) => {
    try {
        const params = {
            qcProcTestMstId: qcProcTestMstId,
            testType: testType,
            batchStatus: form.batchStatus,
            workBatchId: form.workBatchId
        }

        const res = await ApiQc.getQcProcTestTabInfo(params)
        console.log('Tab data loaded:',res)
        /* =============================================
         * Master
         * ============================================= */
        if (res?.qcProcTestMst) {
            Object.assign(form, res.qcProcTestMst)
        }
        /* =============================================
         * 검체채취
         * ============================================= */
        if (testType === 'S') {
            resetSampleInfo()
            if (res?.qcProcSample) {
                Object.assign(sampleInfo, res.qcProcSample)
            }
            return
        }
        /* =============================================
         * QRC
         * 데이터 있으면 서버 데이터
         * 없으면 빈 배열
         * ============================================= */
        if (qrcTypes.includes(testType)) {
            methodTestList.value =
                res?.methodList?.length
                    ? res.methodList
                    : []
            return
        }
        /* =============================================
         * Detail
         * 데이터 있으면 서버 데이터
         * 없으면 기본 15줄
         * ============================================= */
        if (detailTypes.includes(testType)) {
            // 항상 기본 15개 생성
            const defaultList = createDefaultDetailList()
            const savedList = res?.detailList || []
            detailList.value = defaultList.map(defaultItem => {
                // orderDist 기준으로 저장 데이터 찾기
                const savedItem = savedList.find(
                    item =>
                        Number(item.orderDist) ===Number(defaultItem.orderDist)
                )
                // 저장된 데이터가 없으면 기본값 그대로
                if (!savedItem) {
                    return {
                        ...defaultItem,
                        testType
                    }
                }
                // 저장 데이터가 있으면 기본값 위에 덮어쓰기
                return {
                    ...defaultItem,
                    ...savedItem,
                    qcProcTestDetailId: savedItem.qcProcTestDetailId ?? null,

                    testType: savedItem.testType ?? testType,

                    testTime: savedItem.testTime ?? '',
                    line1: savedItem.line1 ?? 0,
                    line2: savedItem.line2 ?? 0,
                    line3: savedItem.line3 ?? 0,
                    line4: savedItem.line4 ?? 0,
                    line5: savedItem.line5 ?? 0,
                    passYn: savedItem.passYn ?? '',
                    orderDist: savedItem.orderDist ?? defaultItem.orderDist
                }
            })

            /* =============================================
            * line
            * ============================================= */
            lineList.value = res.lineList


            return
        }

    } catch (error) {
        console.error('Error loading tab data:', error )
        /*
         * 조회 실패 시에도
         * 이전 탭 값이 남지 않게 초기화
         */
        if (qrcTypes.includes(testType)) {
            methodTestList.value = []
        }
        if (detailTypes.includes(testType)) {
            detailList.value = createDefaultDetailList()
        }
    }
}
/* =========================================================
 * 최초 진입
 * ========================================================= */
onMounted(async () => {
        qcType.value =dialogRef.value.data.qcType
        form.qcProcTestMstId =dialogRef.value.data.qcProcTestMstId
        form.batchStatus =dialogRef.value.data.batchStatus
        form.workBatchId =dialogRef.value.data.workBatchId
        testState.value =dialogRef.value.data.testState

        await loadTabData(form.qcProcTestMstId, 'S' )
        await nextTick()
    }
)

const downloadExcel =async () =>{
  try {
    const blob = await ApiQc.downloadQcProcTest(form.qcProcTestMstId)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `공정검사_${form.prodName}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch {
    vError('엑셀 다운로드 실패')
  }
}
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
    background: #2f6fff;
    color: white;
}
</style>

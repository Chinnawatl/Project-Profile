<template>
  <div>
    <VCard class="mb-6" :title="$t('EB02.formEB02.headerForm')">
      <hr />

      <VCard>
        <VCardText>
          <!-- 👉 Stepper -->
          <AppStepper v-model:current-step="currentStep" :items="numberedSteps" />
        </VCardText>
        <VDivider />
        <VCardText>
          <!-- 👉 stepper content -->
          <VWindow v-model="currentStep" class="disable-tab-transition">
            <VWindowItem>
              <VForm ref="refFormEB02Page1" @submit.prevent="validateFormEB02Page1">
                <VRow>
                  <VCol cols="12" md="6">
                    <!-- <label>รหัสหลักสูตร</label> -->
                    <AppAutocomplete :disabled="typeForm == 'approve'" @update:model-value="handleUpdate"
                      v-model="trainingDetailForm.tra_id_course" item-text="title" :rules="[requiredValidator]"
                      :label="$t('EB02.formEB02.step1EB02.courseCode')" placeholder="กรุณาเลือกรหัสหลักสูตร"
                      :items="dataForSelect">
                    </AppAutocomplete>
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField disabled v-model="trainingDetailForm.typb_name_course" placeholder=""
                      :label="$t('EB02.formEB02.step1EB02.courseName')" />
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField disabled v-model="trainingDetailForm.typb_academy" placeholder=""
                      :label="$t('EB02.formEB02.step1EB02.ownerEducationCouse')" />
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField disabled v-model="trainingDetailForm.typb_coordinator" placeholder=""
                      :label="$t('EB02.formEB02.step1EB02.ownerCouse')" />
                  </VCol>
                  <VCol cols="12" md="3">
                    <AppTextField disabled v-model="trainingDetailForm.typb_contact" placeholder=""
                      :label="$t('EB02.formEB02.step1EB02.contaxt')" prepend-inner-icon="tabler-phone" />
                  </VCol>
                  <VCol cols="12" md="3">
                    <AppTextField disabled v-model="trainingDetailForm.typb_email" placeholder=""
                      :label="$t('EB02.formEB02.step1EB02.email')" prepend-inner-icon="tabler-mail" />
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField :disabled="typeForm == 'approve'" v-model="trainingDetailForm.tra_registeation_fee"
                      placeholder="" :rules="[requiredValidator]" :label="$t('EB02.formEB02.step1EB02.registerFee')" />
                  </VCol>
                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn color="secondary" @click="backMainPage">
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                        {{ $t("EB02.formEB02.btnEB02.back") }}
                      </VBtn>

                      <VBtn type="submit">
                        {{ $t("EB02.formEB02.btnEB02.next") }}
                        <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VWindowItem>

            <VWindowItem>
              <VForm ref="refFormEB02Page2" @submit.prevent="validateFormEB02Page2">
                <VRow>
                  <VCol cols="12">
                    {{ $t("EB02.formEB02.step2EB02.detailTraining") }}
                    <VDataTable :headers="tableHeadersDetailTraining" :items="trainingDetailForm.tra_detail_training"
                      :items-per-page="trainingDetailForm.tra_detail_training.length">
                      <template v-slot:bottom v-if="true">
                        <hr>
                      </template>
                      <template #item.index="{ item, index }">
                        {{ index + 1 }}
                      </template>
                      <template #item.company="{ item, index }">
                        <AppTextField :disabled="typeForm == 'approve'" v-model="item.company" placeholder=""
                          :rules="[requiredValidator]" />
                      </template>
                      <template #item.type_company="{ item, index }">
                        <AppTextField :disabled="typeForm == 'approve'" v-model="item.type_company" placeholder=""
                          :rules="[requiredValidator]" />
                      </template>

                      <template #item.duration_days="{ item, index }">
                        <AppTextField :disabled="typeForm == 'approve'" v-model="item.duration_days" placeholder=""
                          :rules="[requiredValidator]" />
                      </template>
                      <template #item.duration_hours="{ item, index }">
                        <AppTextField :disabled="typeForm == 'approve'" v-model="item.duration_hours" placeholder=""
                          :rules="[requiredValidator]" />
                      </template>
                      <template #item.date_training="{ item, index }">
                        <AppTextField :disabled="typeForm == 'approve'" v-model="item.date_training" placeholder=""
                          :rules="[requiredValidator]" />
                      </template>
                      <template #item.mount="{ item, index }">
                        <AppTextField :disabled="typeForm == 'approve'" v-model="item.mount" placeholder=""
                          :rules="[requiredValidator]" />
                      </template>


                      <template #item.action="{ item, index }">
                        <div v-if="typeForm != 'approve'" class="d-flex">
                          <!-- {{ index }} -->
                          <IconBtn @click="deleteItem(index)">
                            <VIcon icon="tabler-trash" />
                          </IconBtn>
                        </div>
                      </template>
                    </VDataTable>
                  </VCol>

                  <VCol class="text-right" md="12">
                    <VBtn v-if="typeForm != 'approve'" @click="addItem"> {{ $t("EB02.formEB02.btnEB02.add") }} </VBtn>
                  </VCol>
                  <VCol cols="12" md="6" class="text-end">
                    {{ $t("EB02.formEB02.step2EB02.tableStep2.totalNumberPerson") }}
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField :disabled="typeForm == 'approve'" v-model="trainingDetailForm.tra_num_people"
                      placeholder="" :rules="[requiredValidator]" label="" />
                  </VCol>
                  <VCol cols=" 12" md="6" class="text-end">
                    {{ $t("EB02.formEB02.step2EB02.tableStep2.totalPeriodDay") }}
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField :disabled="typeForm == 'approve'" v-model="trainingDetailForm.tra_total_duration_day"
                      placeholder="" :rules="[requiredValidator]" label="" />
                  </VCol>
                  <VCol cols="12" md="6" class="text-end">
                    {{ $t("EB02.formEB02.step2EB02.tableStep2.totalPeriodHour") }}
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField :disabled="typeForm == 'approve'" v-model="trainingDetailForm.tra_total_duration_hour"
                      placeholder="" :rules="[requiredValidator]" label="" />
                  </VCol>
                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn color="secondary"
                        @click="currentStep--, isCurrentStepValid = true, isCurrentStepValid = true">
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                        {{ $t("EB02.formEB02.btnEB02.back") }}
                      </VBtn>

                      <VBtn type="submit">
                        {{ $t("EB02.formEB02.btnEB02.next") }}
                        <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VWindowItem>

            <VWindowItem>
              <VForm ref="refFormEB02Page3" @submit.prevent="validateFormEB02Page3">
                <VRow>
                  <VCol cols="12" md="7">
                    <AppTextField :disabled="typeForm == 'approve'" v-model="trainingDetailForm.tra_project_budget"
                      placeholder="" :rules="[requiredValidator]"
                      :label="$t('EB02.formEB02.step3EB02.projectBudget')" />
                  </VCol>
                  <VCol cols="12">
                    <VTable class="text-no-wrap">
                      <thead>
                        <tr>
                          <th>
                            {{ $t("EB02.formEB02.step3EB02.tableStep3.orderNo") }}
                          </th>
                          <th>
                            {{ $t("EB02.formEB02.step3EB02.tableStep3.expenseCategory") }}
                          </th>
                          <th>
                            {{ $t("EB02.formEB02.step3EB02.tableStep3.multiplierDetails") }}
                          </th>
                          <th>
                            {{ $t("EB02.formEB02.step3EB02.tableStep3.sum") }}
                          </th>
                        </tr>
                      </thead>

                      <tbody>

                        <tr v-for="(    item, index    ) in trainingDetailForm.tra_project_budget_details    "
                          :key="item.typeBudget" :value="index">
                          <td v-if="index < 9">
                            {{ index + 1 }}
                          </td>
                          <td v-else-if="index > 9">
                            {{ index }}
                          </td>
                          <td v-else>

                          </td>

                          <td v-if="index != 9">
                            {{ item.typeBudget }}
                          </td>
                          <td v-else>
                          </td>
                          <td v-if="index != 9">
                            <AppTextField :disabled="typeForm == 'approve'" v-model="item.detailBudget" placeholder=""
                              :rules="[requiredValidator]" label="" />
                          </td>
                          <td v-else>

                            <h3 class="text-right"> {{ item.detailBudget }}</h3>
                          </td>
                          <td v-if="index < 9">
                            <AppTextField :disabled="typeForm == 'approve'" v-model="item.totalBudget" placeholder=""
                              :rules="[requiredValidator]" label="" />
                            <!-- {{ item.totalBudget }} -->
                          </td>

                        </tr>
                      </tbody>

                    </VTable>
                    <hr>

                  </VCol>
                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn color="secondary" @click="currentStep--, isCurrentStepValid = true">
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                        {{ $t("EB02.formEB02.btnEB02.back") }}
                      </VBtn>
                      <VBtn v-if="typeForm != 'approve'" @click="handleFormSubmit" color="success"> {{
                        $t("EB02.formEB02.btnEB02.save") }} </VBtn>
                      <VBtn v-else-if="typeForm == 'approve'" type="submit">
                        {{ $t("EB02.formEB02.btnEB02.next") }}
                        <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VWindowItem>
            <VWindowItem v-if="typeForm == 'approve'">
              <VForm ref="refFormEB02Page5">
                <VRow>
                  <VCol cols="12" md="7">
                    <VRadioGroup v-model="trainingDetailForm.tra_status_approve">
                      <VRadio color="success" label="อนุมัติอบรม" value="อนุมัติแล้ว">
                      </VRadio>
                      <VRadio color="error" label="ไม่อนุมัติอบรม" value="ไม่อนุมัติ">
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="12" md="7">
                    <AppTextarea v-model="trainingDetailForm.tra_comment_approve" auto-grow label="หมายเหตุ"
                      placeholder="Placeholder Text" rows="3" row-height="30" :rules="[requiredValidator]" />
                  </VCol>
                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn color="secondary" @click="currentStep--, isCurrentStepValid = true">
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                        {{ $t("EB02.formEB02.btnEB02.back") }}
                      </VBtn>
                      <VBtn @click="handleFormSubmit" color="success">{{ $t("EB02.formEB02.btnEB02.save") }}</VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VWindowItem>

          </VWindow>
        </VCardText>
      </VCard>
    </VCard>
  </div>
</template>

<script setup>
import { router } from "@/plugins/1.router";
import axios from "axios";
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { VForm } from "vuetify/components/VForm";
import sweetalertService from '../../../service/sweetalertService';
const { t } = useI18n();
const route = useRoute();
const accessTokenCookie = useCookie('accessToken')
const userData = useCookie('userData')
console.log(userData.value.id);
const headers = {
  "Authorization": "Bearer " + accessTokenCookie.value
}
const selectedRadioApprove = ref('')
const typeForm = route.params.type
const trainingID = route.params.data
const dataForSelect = ref([])
const dataForSelectTmp = ref([])
const numberedSteps = computed(() => [
  {
    title: t("EB02.formEB02.step1EB02.detailCourse"),
  },
  {
    title: t("EB02.formEB02.step2EB02.requestApproval"),
  },
  {
    title: t("EB02.formEB02.step3EB02.budget"),
  },
]);

if (typeForm == "approve") {
  numberedSteps.push({ title: "พิจารณาอนุมัติ" })
}
const tableHeadersDetailTraining = computed(() => [
  { title: t("EB02.formEB02.step2EB02.tableStep2.gen"), sortable: false, key: "index" },
  { title: t("EB02.formEB02.step2EB02.tableStep2.establishment"), sortable: false, key: "company" },
  { title: t("EB02.formEB02.step2EB02.tableStep2.amount"), key: "mount" },
  { title: t("EB02.formEB02.step2EB02.tableStep2.typeIndustry"), key: "type_company" },
  { title: t("EB02.formEB02.step2EB02.tableStep2.dayPeriod"), key: "duration_days" },
  { title: t("EB02.formEB02.step2EB02.tableStep2.trainHour"), key: "duration_hours" },
  { title: t("EB02.formEB02.step2EB02.tableStep2.trainingDate"), key: "date_training" },

  { title: t("EB02.formEB02.step2EB02.tableStep2.action"), key: "action" },

]);

if (typeForm == "approve") {
  tableHeadersDetailTraining.splice(tableHeadersDetailTraining.length - 1, 1);
}
const currentStep = ref(0);
const isCurrentStepValid = ref(true);
const refFormEB02Page1 = ref();
const refFormEB02Page2 = ref();
const refFormEB02Page3 = ref();


const trainingDetailForm = ref({
  tra_id_course: null,
  typb_name_course: "",
  typb_academy: "",
  typb_contact: "",
  typb_email: "",
  typb_coordinator: "",
  tra_registeation_fee: "",
  tra_num_people: "",
  tra_total_duration_day: "",
  tra_total_duration_hour: "",
  tra_project_budget: "",
  tra_status_approve: "",
  tra_comment_approve: "",
  tra_created_by: "",
  tra_detail_training: ref([{
    company: "test",
    mount: "test",
    type_company: "test",
    duration_days: "test",
    duration_hours: "test",
    date_training: "test",
  }, {
    company: "test2",
    mount: "test2",
    type_company: "test2",
    duration_days: "test2",
    duration_hours: "test2",
    date_training: "test2",
  },]),
  tra_project_budget_details: ref([
    {
      typeBudget: "ค่าตอบแทนวิทยากร - วิทยากรหลัก",
      detailBudget: "1,000",
      totalBudget: "",
    },
    {
      typeBudget: "ค่าตอบแทนวิทยากร - ผู้ช่วยวิทยากร",
      detailBudget: "2,000",
      totalBudget: "",
    },
    {
      typeBudget: "ค่าเดินทาง (วิทยากร)",
      detailBudget: "3,000",
      totalBudget: "",
    },
    {
      typeBudget: "ค่าที่พัก (วิทยากร)",
      detailBudget: "4,000",
      totalBudget: "",
    },
    {
      typeBudget: "ค่าวัสดุ/ธรรมเนียม (เช่น ค่า License)",
      detailBudget: "4,000",
      totalBudget: "",
    },
    {
      typeBudget: "ค่าอาหารและเครื่องดื่ม)",
      detailBudget: "4,000",
      totalBudget: "",
    },
    {
      typeBudget: "ค่าสถานที่และสาธารณูปโภค",
      detailBudget: "4,000",
      totalBudget: "",
    },
    {
      typeBudget: "ค่าตอบแทนการบริการโครงการ",
      detailBudget: "4,000",
      totalBudget: "",
    },
    {
      typeBudget: "ค่าธรรมเนียมตามระเบียบของสถานศึกษา",
      detailBudget: "4,000",
      totalBudget: "",
    },
    {
      typeBudget: "",
      detailBudget: t('EB02.formEB02.step3EB02.tableStep3.total'),
      totalBudget: "",
    },
    {
      typeBudget: "วงเงินที่ขอรับการสนับสนุนจาก EEC-HDC (ไม่เกินร้อยละ 50 ของค่าใช้จ่ายจริง)",
      detailBudget: "",
      totalBudget: "",
    },
    {
      typeBudget: "คิดเป็นวงเงินค่าใช้จ่ายต่อหัวที่ EEC-HDC สนันสนุน (ไม่เกินร้อยละ 50 ของค่าใช้จ่าย)",
      detailBudget: "",
      totalBudget: "",
    },
  ])
});
onMounted(async () => {
  route.params.type || null
  route.params.data || null
  if (route.params.type == "approve" || route.params.type == "edit") {
    getData()
  }
  getCourseData()
})
async function getData() {
  try {
    const data = {
      populate: ["tra_id_course"],
      // where: {
      //   _id: route.params.data
      // }
    }
    await axios.post(
      `${import.meta.env.VITE_API_HOST}/mongoose/getOne/eec_trainings/${trainingID} `, data, { headers }
    ).then((result) => {

      trainingDetailForm.value.tra_id_course = result.data.tra_id_course._id
      trainingDetailForm.value.typb_name_course = result.data.tra_id_course.typb_name_course
      trainingDetailForm.value.typb_academy = result.data.tra_id_course.typb_academy
      trainingDetailForm.value.typb_contact = result.data.tra_id_course.typb_contact
      trainingDetailForm.value.typb_email = result.data.tra_id_course.typb_email
      trainingDetailForm.value.typb_coordinator = result.data.tra_id_course.typb_coordinator
      trainingDetailForm.value.tra_registeation_fee = result.data.tra_registeation_fee
      trainingDetailForm.value.tra_num_people = result.data.tra_num_people
      trainingDetailForm.value.tra_total_duration_day = result.data.tra_total_duration_day
      trainingDetailForm.value.tra_total_duration_hour = result.data.tra_total_duration_hour
      trainingDetailForm.value.tra_project_budget = result.data.tra_project_budget
      trainingDetailForm.value.tra_status_approve = result.data.tra_status_approve
      trainingDetailForm.value.tra_comment_approve = result.data.tra_comment_approve
      trainingDetailForm.value.tra_created_by = result.data.tra_created_by
      trainingDetailForm.value.tra_detail_training = result.data.tra_detail_training

      trainingDetailForm.value.tra_project_budget_details = result.data.tra_project_budget_details

      // trainingDetailForm.value = result.data
      // console.log(result)
    })
      .catch((err) => {
        console.log(err)
      })
  } catch (error) {

  }
}

const deleteItem = (index) => {
  trainingDetailForm.value.tra_detail_training.splice(index, 1);
};
const addItem = () => {
  trainingDetailForm.value.tra_detail_training.push({
  });
};

async function getCourseData() {
  console.log("test")
  try {
    const data = {
      // populate: [" hcs_training_tra_id", "hcs_user"],
      where: {
        typb_status_approve: "อนุมัติแล้ว"
      }
    }
    await axios.post(
      `${import.meta.env.VITE_API_HOST}/mongoose/get/eec_type_b`, data, { headers }
    ).then((result) => {
      console.log(result.data)
      dataForSelect.value = result.data
      dataForSelectTmp.value = result.data
      // let dataTmp = [{ "title": "กรุณาเลือกหลักสูตร", "value": "" }]
      let dataTmp = []
      result.data.forEach(element => {
        dataTmp.push({ "title": `${element.typb_code_course} (${element.typb_name_course})`, "value": element._id })
      });
      console.log("dataForSelect");
      dataForSelect.value = dataTmp
      // dataForSelect.value = Array.from(dataForSelect.value)
      console.log(dataTmp);
    })
      .catch((err) => {
        console.log(err)
      })
  } catch (error) {

  }

}
const validateFormEB02Page1 = () => {
  refFormEB02Page1.value?.validate().then((valid) => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};

const validateFormEB02Page3 = () => {
  refFormEB02Page3.value?.validate().then((valid) => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};

const validateFormEB02Page2 = () => {
  refFormEB02Page2.value?.validate().then((valid) => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};
const backMainPage = () => {
  if (typeForm == "approve") {
    router.replace({
      name: 'type-bmanagement-training-approvals'
    })
  } else {
    router.replace({
      name: 'type-bmanagement-training'
    })
  }
};

const handleFormSubmit = async () => {
  let isValid = true
  await refFormEB02Page1.value?.validate().then((valid) => {
    if (!valid.valid) {
      isCurrentStepValid.value = false;
      isValid = false;
    }
  });
  await refFormEB02Page2.value?.validate().then((valid) => {
    if (!valid.valid) {
      isCurrentStepValid.value = false;
      isValid = false;
    }
  });
  await refFormEB02Page3.value?.validate().then((valid) => {
    if (!valid.valid) {
      isCurrentStepValid.value = false;
      isValid = false;
    }
  });
  console.log(isValid)
  saveTraining(isValid);
};
const saveTraining = async (valid) => {
  if (valid) {
    try {
      const result = await sweetalertService.showAlert(
        t("sweetAdd.doYouWantToIncreaseData"),
        t("sweetAdd.pleaseSelectTheActionYouWant"),
        "warning",
        t("button.confirm"),
        t("button.cancel"),
      );
      if (result.isConfirmed) {
        await save();
        await sweetalertService.showSuccessTimeOut(
          t("sweetAdd.complete"),
          t("sweetAdd.yourDataHasBeenSuccessfullyIncreased")
        );
        backMainPage()
        // router.replace({ name: 'backMainPage' });
      } else {
        sweetalertService.showAlertTimeOut(
          t("sweetAdd.cancel"),
          t("sweetAdd.successfullyCanceledDataIncrease"),
          "error"
        );
      }
    } catch (error) {
      sweetalertService.showErrorTimeOut("Error", "An error occurred.");
    }
  } else {
    sweetalertService.showAlertTimeOut(
      t('EB02.formEB02.validateInput.plsInput'),
      "",
      "error"
    );
  }
}
function handleUpdate(value) {
  console.log('Selected value:', dataForSelect.value);
  trainingDetailForm.value.tra_id_course = value;
  console.log('Reactive value:', trainingDetailForm.value.tra_id_course);
  const tmp = dataForSelectTmp.value.filter((item) => item._id == trainingDetailForm.value.tra_id_course);
  // console.log(tmp[0]._id)
  // const trainingDetailForm 
  // tra_id_course: "",
  if (tmp[0]) {
    trainingDetailForm.value.tra_id_course = tmp[0]._id
    trainingDetailForm.value.typb_name_course = tmp[0].typb_name_course
    trainingDetailForm.value.typb_academy = tmp[0].typb_academy
    trainingDetailForm.value.typb_contact = tmp[0].typb_contact
    trainingDetailForm.value.typb_email = tmp[0].typb_email
    trainingDetailForm.value.typb_coordinator = tmp[0].typb_coordinator
  }

}
async function save() {
  try {
    if (typeForm == "edit") {
      await axios.put(
        `${import.meta.env.VITE_API_HOST}/mongoose/update/eec_trainings/${trainingID}`, { data: trainingDetailForm.value }, { headers }
      )
      const dataSet = {
        hcs_date: new Date().toISOString(),
        hcs_stasus_change: "updated",
        hcs_training_tra_id: trainingID,
        // "hcs_training_tra_id": null,
        hcs_user: userData.value.id
      }
      await axios.post(
        `${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_history_change_status`, { data: dataSet }, { headers }
      )
    }
    if (typeForm == "add") {

      trainingDetailForm.value.tra_created_by = userData.value.id
      trainingDetailForm.value.tra_status_approve = "รออนุมัติ"
      trainingDetailForm.value.tra_comment_approve = ""
      const data = await axios.post(
        `${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_trainings`, { data: trainingDetailForm.value }, { headers }
      )
      const dataSet = {
        hcs_date: new Date().toISOString(),
        hcs_stasus_change: "created",
        hcs_training_tra_id: data.data._id,
        // "hcs_training_tra_id": null,
        hcs_user: userData.value.id
      }

      await axios.post(
        `${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_history_change_status`, { data: dataSet }, { headers }
      )
      console.log(data.data._id);
    }
    if (typeForm == "approve") {
      await axios.put(
        `${import.meta.env.VITE_API_HOST}/mongoose/update/eec_trainings/${trainingID}`, { data: trainingDetailForm.value }, { headers }
      )
      const dataSet = {
        hcs_date: new Date().toISOString(),
        hcs_stasus_change: "approve",
        hcs_training_tra_id: trainingID,
        // "hcs_training_tra_id": null,
        hcs_user: userData.value.id
      }
      await axios.post(
        `${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_history_change_status`, { data: dataSet }, { headers }
      )
    }
  } catch (error) {

  }
}
</script>
<style lang="scss">
hr {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>

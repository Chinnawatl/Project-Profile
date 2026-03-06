<template>
  <div>
    <VCard class="mb-6" :title="$t('formEB03.formName')">
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
              <VForm ref="refFormEB03Page1" @submit.prevent="validateFormEB03Page1">
                <VRow>
                  <VCol cols="12" md="6">
                    <AppTextField v-model="inputValue" @input="onInput" placeholder="กรอกข้อมูล..." />
                    <div v-if="showDropdown">
                      <ul>
                        <li v-for="option in filteredOptions" :key="option" @click="selectOption(option)">
                          {{ option }}
                        </li>
                        <li v-if="filteredOptions.length === 0" @click="addNewOption">
                          "{{ inputValue }}" ไม่พบข้อมูล เพิ่มข้อมูล
                        </li>
                      </ul>
                    </div>

                    <!-- Alert to show selected or newly added item -->

                    <!-- <AppAutocomplete disabled v-model="typb_id" item-text="title" :rules="[requiredValidator]"
                      label="รหัสหลักสูตร" placeholder="กรุณาเลือกรหัสหลักสูตร" :items="dataForSelect">
                    </AppAutocomplete> -->
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField disabled v-model="typb_name_course" placeholder=""
                      :label="$t('formEB03.page1.courseName')" />
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField disabled v-model="typb_academy" placeholder=""
                      :label="$t('formEB03.page1.academy')" />
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField disabled v-model="typb_coordinator" placeholder=""
                      :label="$t('formEB03.page1.responsiblePerson')" />
                  </VCol>
                  <VCol cols="12" md="3">
                    <AppTextField disabled v-model="typb_contact" placeholder="" :label="$t('formEB03.page1.contact')"
                      prepend-inner-icon="tabler-phone" />
                  </VCol>
                  <VCol cols="12" md="3">
                    <AppTextField disabled v-model="typb_email" placeholder="" :label="$t('formEB03.page1.mail')"
                      prepend-inner-icon="tabler-mail" />
                  </VCol>
                  {{ '==== ' + selectedItem + ' ====' }}
                  <div v-if="selectedItem" class="alert alert-success mt-3">
                    You have selected or added: {{ selectedItem }}
                  </div>
                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn color="secondary" @click="backMainPage">
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                        {{ $t('button.previous') }}
                      </VBtn>

                      <VBtn type="submit">
                        {{ $t('button.next') }}
                        <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VWindowItem>

            <VWindowItem>
              <VForm ref="refFormEB03Page2" @submit.prevent="validateFormEB03Page2">
                <VRow>
                  <VCol cols="12">
                    <h4>{{ $t('formEB03.page2.trainingDetail') }}</h4>
                    <VDataTable :headers="tableHeadersDetailTraining" :items="summaryTrainingForm.srt_detail_training"
                      :items-per-page="summaryTrainingForm.srt_detail_training.length">
                      <template v-slot:bottom v-if="true">
                        <hr>
                      </template>

                      <!-- no: "test",
      company: "test",
      mount: "test",
      budget: "test",
      duration_days: "test",
      duration_hours: "test",
      date_training: "test",
      detail_coordinator: "test" -->
                      <template #item.no="{ item, index }">
                        <AppTextField v-if="index < summaryTrainingForm.srt_detail_training.length - 1"
                          v-model="item.no" placeholder="" :rules="[requiredValidator]" />
                      </template>
                      <template #item.company="{ item, index }">
                        <AppTextField v-if="index < summaryTrainingForm.srt_detail_training.length - 1"
                          v-model="item.company" placeholder="" :rules="[requiredValidator]" />
                        <div v-else> {{ item.company }}</div>
                      </template>
                      <template #item.mount="{ item, index }">
                        <AppTextField v-model="item.mount" placeholder="" :rules="[requiredValidator]" />
                      </template>
                      <template #item.budget="{ item, index }">
                        <AppTextField v-model="item.budget" placeholder="" :rules="[requiredValidator]" />
                      </template>
                      <template #item.duration_days="{ item, index }">
                        <AppTextField v-model="item.duration_days" placeholder="" :rules="[requiredValidator]" />
                      </template>
                      <template #item.duration_hours="{ item, index }">
                        <AppTextField v-model="item.duration_hours" placeholder="" :rules="[requiredValidator]" />
                      </template>
                      <template #item.date_training="{ item, index }">
                        <AppTextField v-model="item.date_training" placeholder="" :rules="[requiredValidator]" />
                      </template>
                      <template #item.detail_coordinator="{ item, index }">
                        <AppTextField v-model="item.detail_coordinator" placeholder="" :rules="[requiredValidator]" />
                      </template>

                      <template #item.action="{ item, index }">
                        <div v-if="index + 1 != summaryTrainingForm.srt_detail_training.length" class="d-flex">
                          <!-- {{ index }} -->
                          <IconBtn @click="deleteItem(index)">
                            <VIcon icon="tabler-trash" />
                          </IconBtn>
                        </div>
                      </template>
                    </VDataTable>
                  </VCol>

                  <VCol class="text-right" md="12">
                    <VBtn @click="addItem">{{ $t('formEB03.page2.addNew') }}</VBtn>
                  </VCol>
                </VRow>

                <VRow>
                  <VCol cols="12" md="6" class="text-end">
                    {{ $t('formEB03.page2.amountTrainee') }}
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField v-model="summaryTrainingForm.srt_total_trainee" placeholder=""
                      :rules="[requiredValidator]" label="" />
                  </VCol>
                </VRow>
                <VRow>
                  <VCol cols=" 12" md="6" class="text-end">
                    {{ $t('formEB03.page2.sumLecturer') }}
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField v-model="summaryTrainingForm.srt_total_lecturer" placeholder=""
                      :rules="[requiredValidator]" label="" />
                  </VCol>
                </VRow>
                <VRow v-for="(item, index) in summaryTrainingForm.srt_name_lecturers">
                  <VCol cols="12" md="6" class="text-end">
                    {{ $t('formEB03.page2.lecturerList') }}
                  </VCol>
                  <VCol cols="12" md="5">
                    <AppTextField v-model="item.value" placeholder="" :rules="[requiredValidator]" label="" />
                  </VCol>
                  <VCol v-if="index != 0" cols="12" md="1">
                    <IconBtn @click="deleteitemsLecturer(index)">
                      <VIcon icon="tabler-trash" />
                    </IconBtn>
                  </VCol>
                </VRow>
                <VRow>
                  <VCol class="text-right" md="12">
                    <VBtn @click="addLecturer">{{ $t('formEB03.page2.addNew') }}</VBtn>
                  </VCol>
                </VRow>
                <VRow>
                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn color="secondary"
                        @click="currentStep--, isCurrentStepValid = true, isCurrentStepValid = true">
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                        {{ $t('button.previous') }}
                      </VBtn>

                      <VBtn type="submit">
                        {{ $t('button.next') }}
                        <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VWindowItem>
            <VWindowItem>
              <VForm ref="refFormEB03Page3" @submit.prevent="validateFormEB03Page3">
                <VRow>
                  <VCol cols="12" md="12">
                    <h4>{{ $t('formEB03.page3.expenseCategory') }}</h4>
                  </VCol>
                  <VCol cols="12" md="1"></VCol>
                  <VCol cols="12" md="6">
                    <AppTextField type="number" v-model="summaryTrainingForm.srt_total_real_budget" placeholder=""
                      :rules="[requiredValidator]" :label="$t('formEB03.page3.actualExpenses')"
                      :suffix="$t('formEB03.page3.baht')" />
                  </VCol>
                  <VCol cols="12" md="5">
                    <AppTextField disabled type="number" v-model="summaryTrainingForm.srt_total_real_budget_per"
                      placeholder="" :rules="[requiredValidator]" label=" " :prefix="$t('formEB03.page3.percentage')" />
                  </VCol>


                  <VCol cols="12" md="1"></VCol>
                  <VCol cols="12" md="6">
                    <AppTextField type="number" v-model="summaryTrainingForm.srt_fees_or_expenses" placeholder=""
                      :rules="[requiredValidator]" :label="$t('formEB03.page3.expenseCategory')"
                      :suffix="$t('formEB03.page3.baht')" />
                  </VCol>
                  <VCol cols="12" md="5">
                    <AppTextField disabled type="number" v-model="summaryTrainingForm.srt_fees_or_expenses_per"
                      placeholder="" :rules="[requiredValidator]" label=" " :prefix="$t('formEB03.page3.percentage')" />
                  </VCol>


                  <VCol cols="12" md="1"></VCol>
                  <VCol cols="12" md="6">
                    <AppTextField type="number" v-model="summaryTrainingForm.srt_support_budget" placeholder=""
                      :rules="[requiredValidator]" :label="$t('formEB03.page3.financialSupport')"
                      :suffix="$t('formEB03.page3.baht')" />
                  </VCol>
                  <VCol cols="12" md="5">
                    <AppTextField disabled type="number" v-model="summaryTrainingForm.srt_support_budget_per"
                      placeholder="" :rules="[requiredValidator]" label=" " :prefix="$t('formEB03.page3.percentage')" />
                  </VCol>

                  <VCol cols="12" md="12">
                    <h4>{{ $t('formEB03.page3.moneySupport') }}</h4>
                  </VCol>
                  <VCol cols="12" md="1"></VCol>
                  <VCol cols="12" md="6">
                    <AppTextField type="number" v-model="summaryTrainingForm.srt_request_suport" placeholder=""
                      :rules="[requiredValidator]" :label="$t('formEB03.page3.moneyAmountSupport')"
                      :suffix="$t('formEB03.page3.baht')" />
                  </VCol>
                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn color="secondary" @click="currentStep--, isCurrentStepValid = true">
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                        {{ $t('button.previous') }}
                      </VBtn>
                      <VBtn @click="handleFormSubmit" color="success">{{ $t('button.save') }}</VBtn>

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
import { computed, ref } from 'vue';
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
onMounted(async () => {
  route.params.id || null
  getData()
  getCourseData()

})
const trainingID = route.params.id
const dataForSelectTmp = ref([])
const dataForSelect = ref([])

const numberedSteps = computed(() => [
  {
    title: t('formEB03.step.courseDetail'),
  },
  {
    title: t('formEB03.step.training'),
  },
  {
    title: t('formEB03.step.expense'),
  },
]);
const tableHeadersDetailTraining = computed(() => [
  { title: t('formEB03.header.gen'), sortable: false, key: "no" },
  { title: t('formEB03.header.company'), sortable: false, key: "company" },
  { title: t('formEB03.header.amountPeople'), key: "mount" },
  { title: t('formEB03.header.amountDay'), key: "duration_days" },
  { title: t('formEB03.header.amountHour'), key: "duration_hours" },
  { title: t('formEB03.header.date'), key: "date_training" },
  { title: t('formEB03.header.budget'), key: "budget" },
  { title: t('formEB03.header.detailCoordinator'), key: "detail_coordinator" },
  { title: t('formEB03.header.action'), key: "action" },

]);

// const srt_detail_training = ref([
//   {
//     company: "test",
//     mount: "test",
//     budget: "test",
//     duration_days: "test",
//     duration_hours: "test",
//     date_training: "test",
//   },
//   {},
//   {},
//   { company: "รวม" },
// ]);
// const items = ref(['Option 1', 'Option 2', 'Option 3']);
// const selectedItem = ref('');
// const items = ref([
//   'Apple',
//   'Banana',
//   'Cherry',
//   'Date',
//   'Grapes',
//   'Lemon',
//   'Mango',
// ]);
const currentStep = ref(0);
const isCurrentStepValid = ref(true);
const refFormEB03Page1 = ref();
const refFormEB03Page2 = ref();
const refFormEB03Page3 = ref();
const typb_id = ref("");
const typb_name_course = ref("");
const typb_academy = ref("");
const typb_contact = ref("");
const typb_email = ref("");
const typb_coordinator = ref("");
const typeForm = ref("add");
const summaryTrainingId = ref("");

const summaryTrainingForm = ref({
  srt_id_training: null,
  srt_detail_training: ref([
    {
      no: "test",
      company: "test",
      mount: "test",
      budget: "test",
      duration_days: "test",
      duration_hours: "test",
      date_training: "test",
      detail_coordinator: "test"
    },
    {},
    {},
    { company: "รวม" },
  ]),
  // typb_name_course: "",
  // typb_academy: "",
  // typb_contact: "",
  // typb_email: "",
  // typb_coordinator: "",
  srt_total_trainee: ref(""),
  srt_total_lecturer: ref(""),
  srt_name_lecturers: ref([{ value: "" }]),




  // courseCode: "",
  // courseName: "",
  // responsibleInstitution: "",
  // phone: "",
  // email: "",
  // responsibleCourse: "",
  // registrationFee: "",
  // dateTraing: "",
  // durationTraining: "",
  // countMemberGen: "",
  // countGen: "",
  // operatorSelected: null,
  // targetIndustriesSelected: null,
  // totalTrainee: "",
  // totalLecturer: "",
  // detailBudget: "",
  srt_total_real_budget: "",
  srt_fees_or_expenses: "",
  srt_support_budget: "",
  srt_total_real_budget_per: "1",
  srt_fees_or_expenses_per: "2",
  srt_support_budget_per: "3",
  srt_request_suport: "",


});

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
async function getData() {
  try {
    let data = {
      populate: ["tra_id_course"],
      // where: {
      //   _id: route.params.data
      // }
    }
    await axios.post(
      `${import.meta.env.VITE_API_HOST}/mongoose/getOne/eec_trainings/${trainingID} `, data, { headers }
    ).then((result) => {
      typb_id.value = result.data.tra_id_course._id
      typb_name_course.value = result.data.tra_id_course.typb_name_course
      typb_academy.value = result.data.tra_id_course.typb_academy
      typb_contact.value = result.data.tra_id_course.typb_contact
      typb_email.value = result.data.tra_id_course.typb_email
      typb_coordinator.value = result.data.tra_id_course.typb_coordinator
    })




    data = {
      // populate: ["tra_id_course"],
      where: {
        srt_id_training: trainingID
      }
    }
    await axios.post(
      `${import.meta.env.VITE_API_HOST}/mongoose/getOne/eec_summary_trainings`, data, { headers }
    ).then((result) => {
      if (result.data) {
        typeForm.value = "edit"
        console.log('result.data')
        console.log(result.data)
        summaryTrainingId.value = result.data._id
        summaryTrainingForm.value.srt_detail_training = result.data.srt_detail_training
        summaryTrainingForm.value.srt_total_trainee = result.data.srt_total_trainee
        summaryTrainingForm.value.srt_total_lecturer = result.data.srt_total_lecturer
        summaryTrainingForm.value.srt_name_lecturers = result.data.srt_name_lecturers
        summaryTrainingForm.value.srt_total_real_budget = result.data.srt_total_real_budget
        summaryTrainingForm.value.srt_fees_or_expenses = result.data.srt_fees_or_expenses
        summaryTrainingForm.value.srt_support_budget = result.data.srt_support_budget
        summaryTrainingForm.value.srt_total_real_budget_per = result.data.srt_total_real_budget_per
        summaryTrainingForm.value.srt_fees_or_expenses_per = result.data.srt_fees_or_expenses_per
        summaryTrainingForm.value.srt_support_budget_per = result.data.srt_support_budget_per
        summaryTrainingForm.value.srt_request_suport = result.data.srt_request_suport
      }
    })

      .catch((err) => {
        console.log(err)
      })
  } catch (error) {

  }
}
const deleteItem = (index) => {
  summaryTrainingForm.value.srt_detail_training.splice(index, 1);
};
const addItem = () => {
  // console.log(summaryTrainingForm.srt_detail_training.value.length)
  summaryTrainingForm.value.srt_detail_training.splice(summaryTrainingForm.value.srt_detail_training.length - 1, 1);
  summaryTrainingForm.value.srt_detail_training.push({
  });
  summaryTrainingForm.value.srt_detail_training.push({ company: "รวม" });
};
const addLecturer = () => {
  summaryTrainingForm.value.srt_name_lecturers.push({ value: "" });
};
const deleteitemsLecturer = (index) => {
  summaryTrainingForm.value.srt_name_lecturers.splice(index, 1);
};

const validateFormEB03Page1 = () => {
  refFormEB03Page1.value?.validate().then((valid) => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};
const validateFormEB03Page2 = () => {
  refFormEB03Page2.value?.validate().then((valid) => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};
const validateFormEB03Page3 = () => {
  refFormEB03Page3.value?.validate().then((valid) => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};
const backMainPage = () => {
  router.replace({
    name: 'type-bmanagement-training'
  })
};

const handleFormSubmit = async () => {
  let isValid = true
  await refFormEB03Page1.value?.validate().then((valid) => {
    if (!valid.valid) {
      isCurrentStepValid.value = false;
      isValid = false;
    }
  });
  await refFormEB03Page2.value?.validate().then((valid) => {
    if (!valid.valid) {
      isCurrentStepValid.value = false;
      isValid = false;
    }
  });
  await refFormEB03Page3.value?.validate().then((valid) => {
    if (!valid.valid) {
      isCurrentStepValid.value = false;
      isValid = false;
    }
  });
  console.log(isValid)
  saveSummaryTraining(isValid);
};
const saveSummaryTraining = async (valid) => {
  if (valid) {
    try {
      const result = await sweetalertService.showAlert(
        t("sweetAdd.doYouWantToIncreaseData"),
        t("sweetAdd.pleaseSelectTheActionYouWant"),
        "warning",
        t("button.confirm"),
        t("button.cancel")

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
      t("sweetAdd.unableToAddData"),
      t("sweetAdd.pleaseInputACompleteData"),
      "error"
    );
  }
}

async function save() {
  try {
    if (typeForm.value == "edit") {
      summaryTrainingForm.value.srt_id_training = trainingID
      await axios.put(
        `${import.meta.env.VITE_API_HOST}/mongoose/update/eec_summary_trainings/${summaryTrainingId.value}`, { data: summaryTrainingForm.value }, { headers }
      )
      const dataSet = {
        hcs_date: new Date().toISOString(),
        hcs_stasus_change: "updated summary training",
        hcs_training_tra_id: summaryTrainingForm.value.srt_id_training,
        // "hcs_training_tra_id": null,
        hcs_user: userData.value.id
      }
      await axios.post(
        `${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_history_change_status`, { data: dataSet }, { headers }
      )
    }
    if (typeForm.value == "add") {

      // summaryTrainingForm.value.tra_created_by = userData.value.id
      // summaryTrainingForm.value.tra_status_approve = "รออนุมัติ"
      // summaryTrainingForm.value.tra_comment_approve = ""
      summaryTrainingForm.value.srt_id_training = trainingID
      await axios.post(
        `${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_summary_trainings`, { data: summaryTrainingForm.value }, { headers }
      )
      const dataSet = {
        hcs_date: new Date().toISOString(),
        hcs_stasus_change: "created summary training",
        hcs_training_tra_id: summaryTrainingForm.value.srt_id_training,
        // "hcs_training_tra_id": null,
        hcs_user: userData.value.id
      }

      await axios.post(
        `${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_history_change_status`, { data: dataSet }, { headers }
      )
      // console.log(data.data._id);
    }
  } catch (error) {

  }
}

// const inputValue = ref('');
// const showDropdown = ref('');
// const filteredOptions = ref('');
// const selectOption = ref('');
// const addNewOption = ref('');
// const onInput = ref('');

const inputValue = ref('');
const options = ref(['ตัวเลือก 1', 'ตัวเลือก 2', 'ตัวเลือก 3']); // ข้อมูลตัวเลือก

// ฟังก์ชันเพื่อแสดงหรือซ่อนดรอปดาว
const showDropdown = computed(() => inputValue.value.length > 0);

// ฟังก์ชันในการกรองตัวเลือกที่ตรงกับข้อมูลที่พิม
const filteredOptions = computed(() => {
  return options.value.filter(option =>
    option.toLowerCase().includes(inputValue.value.toLowerCase())
  );
});

// ฟังก์ชันในการเลือกตัวเลือก
const selectOption = (option) => {
  inputValue.value = option;
  showDropdown.value = false;
};

// ฟังก์ชันในการเพิ่มตัวเลือกใหม่
const addNewOption = () => {
  if (!options.value.includes(inputValue.value)) {
    options.value.push(inputValue.value);
    selectOption(inputValue.value);
  }
};

// ฟังก์ชันเรียกใช้งานเมื่อกรอกข้อมูล
const onInput = () => {
  showDropdown.value = inputValue.value.length > 0;
};
</script>
<style scoped lang="scss">
hr {
  border: 1px solid rgba(0, 0, 0, 10%);
}

.alert {
  padding: 10px;
  color: white;
  background-color: #4caf50;
  border-radius: 4px;
}

.mt-3 {
  margin-top: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;
  background-color: #fff;
}

li {
  padding: 8px;
  cursor: pointer;
  color: #0b0b0b;
}

li:hover {
  background-color: #f0f0f0;
}
</style>

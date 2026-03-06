<template>
  <div>
    <VCard class="mb-6" :title="$t('FormEB01.courseProposalFormO1')">
      <hr />
      <VCard>
        <VCardText>
          <!-- 👉 Stepper -->
          <AppStepper v-if="typeForm == 'add'" v-model:current-step="currentStep" :items="numberedSteps"
            :is-active-step-valid="isCurrentStepValid" />
          <AppStepper v-else v-model:current-step="currentStep" :items="numberedSteps" />
        </VCardText>
        <VDivider />
        <VCardText>
          <!-- 👉 stepper content -->
          <VWindow v-model="currentStep" class="disable-tab-transition">
            <VWindowItem>
              <VForm ref="refFormEB01Page1" @submit.prevent="validateFormEB01Page1">
                <VRow>
                  <VCol cols="12" md="6">
                    <!-- {{ courseDetailForm.value.typb_name_course }} -->
                    <AppTextField @blur="showDropdown = false" v-if="typeForm == 'add'"
                      :disabled="typeForm == 'approve'" v-model="courseDetailForm.typb_name_course"
                      :rules="[requiredValidator, nameCourseValidator]" :label="$t('FormEB01.formAdd.step1.courseName')"
                      @input="onInput" />
                    <AppTextField @blur="showDropdown = false" v-if="typeForm == 'edit' || typeForm == 'approve'"
                      :disabled="typeForm == 'approve'" v-model="courseDetailForm.typb_name_course"
                      :rules="[requiredValidator]" :label="$t('FormEB01.formAdd.step1.courseName')" @input="onInput" />
                    <div v-if="showDropdown">
                      <ul>
                        <li v-for="option in filteredOptions" :key="option"
                          @click="selectOption(option.typb_name_course)">
                          {{ option.typb_name_course }}
                        </li>
                        <li v-if="filteredOptions.length === 0" @click="addNewOption">
                          "{{ courseDetailForm.typb_name_course }}" ไม่พบข้อมูล เพิ่มข้อมูล
                        </li>
                      </ul>
                    </div>
                    <!-- <AppTextField :disabled="typeForm == 'approve'" v-model="courseDetailForm.typb_name_course"
                      placeholder="" :rules="[requiredValidator]" :label="$t('FormEB01.formAdd.step1.courseName')" /> -->
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField :disabled="typeForm == 'approve'" v-model="courseDetailForm.typb_academy"
                      placeholder="" :rules="[requiredValidator]" :label="$t('FormEB01.formAdd.step1.ownerCourse')" />
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField :disabled="typeForm == 'approve'" v-model="courseDetailForm.typb_coordinator"
                      placeholder="" :rules="[requiredValidator]" :label="$t('FormEB01.formAdd.step1.coordinator')" />
                  </VCol>
                  <VCol cols="12" md="3">
                    <AppTextField maxlength="10" type="number" @input="maxlength" :disabled="typeForm == 'approve'"
                      v-model="courseDetailForm.typb_contact" placeholder=""
                      :rules="[lengthValidator(courseDetailForm.typb_contact, 10)]"
                      :label="$t('FormEB01.formAdd.step1.contract')" prepend-inner-icon="tabler-phone" />
                  </VCol>
                  <VCol cols="12" md="3">
                    <AppTextField :disabled="typeForm == 'approve'" v-model="courseDetailForm.typb_email" placeholder=""
                      :rules="[emailValidator]" :label="$t('FormEB01.formAdd.step1.Email')"
                      prepend-inner-icon="tabler-mail" />
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField :disabled="typeForm == 'approve'" v-model="courseDetailForm.typb_count_tainees"
                      placeholder="" :rules="[requiredValidator]" :label="$t('FormEB01.formAdd.step1.countTrainees')" />
                  </VCol>
                  <VCol cols="12" md="3">
                    <AppTextField type="number" :disabled="typeForm == 'approve'"
                      v-model="courseDetailForm.typb_count_gen" placeholder="" :rules="[requiredValidator]"
                      :label="$t('FormEB01.formAdd.step1.dividedInto')" suffix="รุ่น" />
                  </VCol>
                  <VCol cols="12" md="3">
                    <AppTextField type="number" :disabled="typeForm == 'approve'"
                      v-model="courseDetailForm.typb_count_member_gen" placeholder="" :rules="[requiredValidator]"
                      :label="$t('FormEB01.formAdd.step1.genNum')" suffix="คน" />
                  </VCol>

                  <VCol cols="12" md="6">
                    <AppTextField :disabled="typeForm == 'approve'" v-model="courseDetailForm.typb_training_schedule"
                      placeholder="" :rules="[requiredValidator]"
                      :label="$t('FormEB01.formAdd.step1.trainingSchedule')" />
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField :disabled="typeForm == 'approve'" v-model="courseDetailForm.typb_duration_training"
                      placeholder="" :rules="[requiredValidator]"
                      :label="$t('FormEB01.formAdd.step1.trainingPeriod')" />
                  </VCol>
                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn @click="backMainPage()" color="secondary">
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                        {{ $t("button.cancel") }}
                      </VBtn>

                      <VBtn type="submit">
                        Next
                        <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                      </VBtn>
                    </div>
                  </VCol>

                  <!-- <VCol cols="12">
                    <div
                      class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"
                    >
                      <VBtn
                        color="secondary"
                        
                        @click="currentStep--, isCurrentStepValid = true"
                      >
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                        ย้อนกลับ
                      </VBtn>
    
                      <VBtn type="submit">
                        Next
                        <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                      </VBtn>
                    </div>
                  </VCol> -->
                </VRow>
              </VForm>
            </VWindowItem>

            <VWindowItem>
              <VForm ref="refFormEB01Page2" @submit.prevent="validateFormEB01Page2">
                <VRow>
                  <VCol cols="12" md="7">
                    <AppSelect :items="operatorItems" item-text="title" item-value="value"
                      :disabled="typeForm == 'approve'" v-model="courseDetailForm.typb_entrepreneurs_training"
                      :label="$t('FormEB01.formAdd.step2.entrepreneursWantJoin')"
                      placeholder="กรุณาเลือกผู้ประกอบการที่ประสงค์เข้าร่วมอบรม" :rules="[requiredValidator]" />
                  </VCol>
                  <VCol cols="12" md="7">
                    <AppSelect :items="targetIndustriesItems" item-text="title" item-value="value"
                      :disabled="typeForm == 'approve'" v-model="courseDetailForm.typb_target_industries"
                      :label="$t('FormEB01.formAdd.step2.responseTarget')"
                      placeholder="กรุณาเลือกตอบสนองต่ออุตสาหกรรมเป้าหมาย" :rules="[requiredValidator]" />
                  </VCol>
                  <VCol cols="12" sm="6">
                    <AppTextarea v-model="courseDetailForm.typb_benefits_trainees" :disabled="typeForm == 'approve'"
                      auto-grow :label="$t('FormEB01.formAdd.step2.benefitsTrain')" placeholder="Placeholder Text"
                      rows="3" row-height="30" :rules="[requiredValidator]" />
                  </VCol>
                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn color="secondary" @click="currentStep--, isCurrentStepValid = true">
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                        {{ $t("button.cancel") }}
                      </VBtn>

                      <VBtn type="submit">
                        Next
                        <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VWindowItem>

            <VWindowItem>
              <VForm ref="refFormEB01Page3" @submit.prevent="validateFormEB01Page3">
                <VRow>
                  <VCol cols="12" md="7">
                    <AppTextField type="number" :disabled="typeForm == 'approve'"
                      v-model="courseDetailForm.typb_budget_per_gen" placeholder="" :rules="[requiredValidator]"
                      :label="$t('FormEB01.formAdd.step3.budgetPerModel')" />
                  </VCol>
                  <VCol cols="12" md="7">
                    <AppTextField type="number" :disabled="typeForm == 'approve'"
                      v-model="courseDetailForm.typb_total_budget" placeholder="" :rules="[requiredValidator]"
                      :label="$t('FormEB01.formAdd.step3.totalBudget')" />
                  </VCol>
                  <VCol cols="12">
                    <VDataTable :headers="tableHeaders" :items="courseDetailForm.typb_details_expense_categories"
                      :items-per-page="5">
                      <template #item.typePay="{ item, index }">
                        <!-- {{ index }} -->
                        <AppTextField :disabled="typeForm == 'approve'" v-model="item.typePay" placeholder=""
                          :rules="[requiredValidator]" />
                      </template>
                      <template #item.budget_per_model="{ item, index }">
                        <!-- {{ index }} -->
                        <AppTextField type="number" :disabled="typeForm == 'approve'" v-model="item.budget_per_model"
                          placeholder="" :rules="[requiredValidator]" />
                      </template>

                      <!-- typePay: "ค่าเดินทาง",
                      budget_per_model: "1000" -->
                      <template #item.action="{ item, index }">
                        <div v-if="typeForm != 'approve'" class="d-flex">
                          <!-- {{ index }} -->
                          <IconBtn @click="deleteImpacttest(index)">
                            <VIcon icon="tabler-trash" />
                          </IconBtn>
                        </div>
                      </template>
                    </VDataTable>

                  </VCol>
                  <VCol class="text-right">
                    <VBtn v-if="typeForm != 'approve'" @click="addImpacttest"> + add new </VBtn>
                  </VCol>
                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn color="secondary" @click="currentStep--, isCurrentStepValid = true">
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                        {{ $t("button.cancel") }}
                      </VBtn>

                      <VBtn type="submit">
                        Next
                        <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VWindowItem>

            <VWindowItem>
              <VForm ref="refFormEB01Page4" @submit.prevent="validateFormEB01Page4">
                <VRow>
                  <VCol cols="12" md="6">
                    <AppTextField :disabled="typeForm == 'approve'" v-model="courseDetailForm.typb_target_group"
                      placeholder="" :rules="[requiredValidator]" :label="$t('FormEB01.formAdd.step4.targetGroup')" />
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField :disabled="typeForm == 'approve'" v-model="courseDetailForm.typb_origin_importance"
                      placeholder="" :rules="[requiredValidator]"
                      :label="$t('FormEB01.formAdd.step4.originAndImportance')" />
                  </VCol>
                  <!-- :disabled="typeForm == 'approve'" v-model="courseDetailForm.budgetPerModel[index]" -->
                  <VCol cols="12" md="6">
                    <div v-for="(items, index) in courseDetailForm.typb_skill_set">

                      <VRow v-if="index == 0">
                        <VCol md="11">
                          <AppTextField :disabled="typeForm == 'approve'"
                            v-model="courseDetailForm.typb_skill_set[index]" placeholder="" :rules="[requiredValidator]"
                            :label="$t('FormEB01.formAdd.step4.learningOutcome')" />
                        </VCol>
                      </VRow>
                      <VRow v-else>
                        <VCol md="11">
                          <AppTextField :disabled="typeForm == 'approve'"
                            v-model="courseDetailForm.typb_skill_set[index]" placeholder="" :rules="[requiredValidator]"
                            label="" />
                        </VCol>
                        <VCol md="1">
                          <IconBtn @click="deleteLearningOutcomes(index)">
                            <VIcon icon="tabler-trash" />
                          </IconBtn>
                        </VCol>
                      </VRow>
                    </div>
                    <VRow>
                      <VCol class="text-right" md="11">
                        <VBtn v-if="typeForm != 'approve'" @click="addLearningOutcomes"> + add new </VBtn>
                      </VCol>
                    </VRow>
                  </VCol>
                  <VCol cols="12" md="6">
                    <div v-for="(item, index) in courseDetailForm.typb_impact">
                      <VRow v-if="index == 0">
                        <VCol md="11">
                          <AppTextField :disabled="typeForm == 'approve'" v-model="courseDetailForm.typb_impact[index]"
                            placeholder="" :rules="[requiredValidator]" :label="$t('FormEB01.formAdd.step4.impact')" />
                        </VCol>
                      </VRow>
                      <VRow v-else>
                        <VCol md="11">
                          <AppTextField :disabled="typeForm == 'approve'" v-model="courseDetailForm.typb_impact[index]"
                            placeholder="" :rules="[requiredValidator]" label="" />
                        </VCol>
                        <VCol md="1">
                          <IconBtn @click="deleteImpact(index)">
                            <VIcon icon="tabler-trash" />
                          </IconBtn>
                        </VCol>
                      </VRow>
                    </div>
                    <VRow>
                      <VCol class="text-right" md="11">
                        <VBtn v-if="typeForm != 'approve'" @click="addImpact"> + add new </VBtn>
                      </VCol>
                    </VRow>
                  </VCol>
                  <VCol cols="12">
                    <VDataTable :headers="tableHeadersDetailCourse" :items="courseDetailForm.typb_training_details"
                      :items-per-page="5">
                      <template #item.index="{ item, index }">
                        {{ index + 1 }}
                      </template>
                      <template #item.outcomes="{ item, index }">
                        <AppTextField :disabled="typeForm == 'approve'" v-model="item.outcomes" placeholder=""
                          :rules="[requiredValidator]" label="" />
                      </template>
                      <template #item.topic="{ item, index }">
                        <AppTextField :disabled="typeForm == 'approve'" v-model="item.topic" placeholder=""
                          :rules="[requiredValidator]" label="" />
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
                    <VBtn v-if="typeForm != 'approve'" @click="addItem"> + add new </VBtn>
                  </VCol>

                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn color="secondary" @click="currentStep--, isCurrentStepValid = true">
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                        {{ $t("button.cancel") }}
                      </VBtn>

                      <VBtn v-if="typeForm != 'approve'" type="submit" @click="handleFormSubmit" color="success"> บันทึก
                      </VBtn>
                      <VBtn v-else-if="typeForm == 'approve'" type="submit">
                        Next
                        <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VWindowItem>
            <VWindowItem v-if="typeForm == 'approve'">
              <VForm ref="refFormEB01Page5">
                <VRow>
                  <VCol cols="12" md="7">
                    <VRadioGroup v-model="courseDetailForm.typb_status_approve">
                      <VRadio color="success" label="อนุมัติหลักสูตร" value="อนุมัติแล้ว">
                      </VRadio>
                      <VRadio color="error" label="ไม่อนุมัติหลักสูตร" value="ไม่อนุมัติ">
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="12" md="7">
                    <AppTextarea v-model="courseDetailForm.typb_comment_approve" auto-grow label="หมายเหตุ"
                      placeholder="Placeholder Text" rows="3" row-height="30" :rules="[requiredValidator]" />
                  </VCol>
                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn color="secondary" @click="currentStep--, isCurrentStepValid = true">
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                        ย้อนกลับ
                      </VBtn>
                      <VBtn @click="handleFormSubmit" color="success">บันทึก</VBtn>

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
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { VForm } from "vuetify/components/VForm";
import sweetalertService from '../../../service/sweetalertService';
const { t } = useI18n();
const test = t('EEC NETs');

const accessTokenCookie = useCookie('accessToken')
const userData = useCookie('userData')
console.log(userData.value.id);
const headers = {
  "Authorization": "Bearer " + accessTokenCookie.value
}
const route = useRoute();
onMounted(async () => {

  console.log('$api');
  console.log($api);
  console.log("route.params.data")
  route.params.type || null
  route.params.data || null
  if (route.params.type == "approve" || route.params.type == "edit") {
    getData()
  }
  getCourseData()
})

let typeForm = route.params.type
let typeBID = route.params.data
console.log(typeForm)
console.log(typeBID)

const itemsLearningOutcomes = ref([{ value: "" }]);
const itemsImpact = ref([{ value: "" }]);
const selectedRadioApprove = ref('')
let numberedSteps = ref([])
if (typeForm == "approve") {
  numberedSteps = computed(() => [
    {
      title: t("FormEB01.formAdd.step1.courseDetail"),
    },
    {
      title: t("FormEB01.formAdd.step2.courseObjective"),
    },
    {
      title: t("FormEB01.formAdd.step3.budget"),
    },
    {
      title: t("FormEB01.formAdd.step4.courseGoal"),
    },
    {
      title: "พิจารณาอนุมัติ",
    },
  ]);
  // numberedSteps.push({ title: "พิจารณาอนุมัติ" })
} else {
  numberedSteps = computed(() => [
    {
      title: t("FormEB01.formAdd.step1.courseDetail"),
    },
    {
      title: t("FormEB01.formAdd.step2.courseObjective"),
    },
    {
      title: t("FormEB01.formAdd.step3.budget"),
    },
    {
      title: t("FormEB01.formAdd.step4.courseGoal"),
    },
  ]);
}

const operatorItems = [
  { title: "อุตสาหกรรมในพื้นที่อีอีซีที่ไม่ได้รับบีโอไอ", value: "อุตสาหกรรมในพื้นที่อีอีซีที่ไม่ได้รับบีโอไอ" },
  { title: "อุตสาหกรรมในพื้นที่อีอีซีที่ยังได้รับการยกเว้นภาษีเงินได้นิติบุคคลจากบีโอไอ", value: "อุตสาหกรรมในพื้นที่อีอีซีที่ยังได้รับการยกเว้นภาษีเงินได้นิติบุคคลจากบีโอไอ" },
  { title: "อุตสาหกรรมนอกพื้นที่อีอีซีที่ยังได้รับการยกเว้นภาษีเงินได้นิติบุคคลจากบีโอไอ", value: "3อุตสาหกรรมนอกพื้นที่อีอีซีที่ยังได้รับการยกเว้นภาษีเงินได้นิติบุคคลจากบีโอไอ" },
];
const targetIndustriesItems = [
  { title: "อุตสาหกรรมยานยนต์แห่งอนาคต", value: "อุตสาหกรรมยานยนต์แห่งอนาคต" },
  { title: "อุตสาหกรรมการเกษตรและเทคโนโลยีชีวภาพ", value: "อุตสาหกรรมการเกษตรและเทคโนโลยีชีวภาพ" },
  { title: "อุตสาหกรรมเทคโนโลยีภาคตะวันออก", value: "อุตสาหกรรมเทคโนโลยีภาคตะวันออก" },
];
let tableHeaders = ref([])
///////// เดี๋ยวมาปรับแก้ /////////////////
if (typeForm == "approve") {
  tableHeaders = computed(() => [
    { title: t("FormEB01.formAdd.step3.expenseCategory"), sortable: false, key: "typePay" },
    { title: t("FormEB01.formAdd.step3.budgetPerModel"), key: "budget_per_model" },
  ]);
  // tableHeaders.splice(2, 1);
} else {
  tableHeaders = computed(() => [
    { title: t("FormEB01.formAdd.step3.expenseCategory"), sortable: false, key: "typePay" },
    { title: t("FormEB01.formAdd.step3.budgetPerModel"), key: "budget_per_model" },
    { title: t("FormEB01.action"), key: "action" },
  ]);
}
let tableHeadersDetailCourse = ref([])
///////// เดี๋ยวมาปรับแก้ /////////////////
if (typeForm == "approve") {
  // tableHeadersDetailCourse.splice(3, 1);
  tableHeadersDetailCourse = computed(() => [
    { title: t("FormEB01.formAdd.step4.number"), sortable: false, key: "index" },
    { title: t("FormEB01.formAdd.step4.title"), sortable: false, key: "topic" },
    { title: t("FormEB01.formAdd.step4.outcomeRelate"), key: "outcomes" },
  ]);
} else {
  tableHeadersDetailCourse = computed(() => [
    { title: t("FormEB01.formAdd.step4.number"), sortable: false, key: "index" },
    { title: t("FormEB01.formAdd.step4.title"), sortable: false, key: "topic" },
    { title: t("FormEB01.formAdd.step4.outcomeRelate"), key: "outcomes" },
    { title: t("FormEB01.action"), key: "action" },
  ]);
}
const currentStep = ref(0);
const isCurrentStepValid = ref(true);
const refFormEB01Page1 = ref();
const refFormEB01Page2 = ref();
const refFormEB01Page3 = ref();
const refFormEB01Page4 = ref();
const validateNameCoruse = ref();


const courseDetailForm = ref({
  typb_name_course: "",
  typb_academy: "",
  typb_coordinator: "",
  typb_contact: "",
  typb_email: "",
  typb_count_tainees: "",
  typb_training_schedule: "",
  typb_duration_training: "",
  typb_count_member_gen: "",
  typb_count_gen: "",
  typb_benefits_trainees: "",
  typb_entrepreneurs_training: null,
  typb_target_industries: null,
  typb_total_budget: "",
  typb_budget_per_gen: "",
  typb_target_group: "",
  typb_origin_importance: "",
  typb_details_expense_categories: ref([{
    typePay: "ค่าเดินทาง",
    budget_per_model: "1000"
  },
  {
    typePay: "ค่าที่พัก",
    budget_per_model: "500"
  },
  {
    typePay: "ค่าวิทยากร",
    budget_per_model: "1000"
  }]),
  typb_skill_set: ref([""]),
  typb_impact: ref([""]),
  typb_training_details: ref([{
    topic: "",
    outcomes: ""
  }]),
  typb_status_approve: "",
  typb_comment_approve: "",
  typb_code_course: "",
  typb_created_by: userData.value.id,


});
const backMainPage = () => {
  console.log('typeForm');
  console.log(typeForm);
  if (typeForm == "approve") {
    console.log("aaaaaaaaaaaaaaaaaaa");

    router.replace({
      name: 'type-bmanagement-course-approvals'
    })
  } else {
    console.log("bbbbbbbbbbbbbbbbbbb");

    router.replace({
      name: 'type-bmanagement-course'
    })
  }
};
const handleFormSubmit = async () => {
  let isValid = true
  await refFormEB01Page1.value?.validate().then((valid) => {
    if (!valid.valid) {
      isCurrentStepValid.value = false;
      isValid = false;
    }
  });
  await refFormEB01Page2.value?.validate().then((valid) => {
    if (!valid.valid) {
      isCurrentStepValid.value = false;
      isValid = false;
    }
  });
  await refFormEB01Page3.value?.validate().then((valid) => {
    if (!valid.valid) {
      isCurrentStepValid.value = false;
      isValid = false;
    }
  });
  await refFormEB01Page4.value?.validate().then((valid) => {
    if (!valid.valid) {
      isCurrentStepValid.value = false;
      isValid = false;
    }
  });
  console.log(isValid)
  saveTypeB(isValid);
};
const saveTypeB = async (valid) => {
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
        if (typeForm == "add") {
          let tmp = options.value.filter(option => option.typb_name_course.toLowerCase() == courseDetailForm.value.typb_name_course.toLowerCase())
          console.log(tmp)
          console.log(tmp.length != 0)
          if (tmp.length != 0) {
            sweetalertService.showAlertTimeOut(
              "ชื่อหลักสูตรนี่มีอยู่แล้ว",
              "กรุณากรอกชื่อหลักสูตรใหม่",
              "error"
            );
            currentStep.value = 0
          } else {
            await save();
            await sweetalertService.showSuccessTimeOut(
              t("sweetAdd.complete"),
              t("sweetAdd.yourDataHasBeenSuccessfullyIncreased")
            );
            backMainPage()
            // router.replace({ name: 'backMainPage' });
          }
        } else {
          await save();
          await sweetalertService.showSuccessTimeOut(
            t("sweetAdd.complete"),
            t("sweetAdd.yourDataHasBeenSuccessfullyIncreased")
          );
          backMainPage()
          // router.replace({ name: 'backMainPage' });
        }

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
    if (typeForm == "edit") {
      await axios.put(
        `${import.meta.env.VITE_API_HOST}/mongoose/update/eec_type_b/${typeBID}`, { data: courseDetailForm.value }, { headers }
      )
      const dataSet = {
        hcs_date: new Date().toISOString(),
        hcs_stasus_change: "updated",
        hcs_type_b: typeBID,
        // "hcs_training_tra_id": null,
        hcs_user: userData.value.id
      }
      await axios.post(
        `${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_history_change_status`, { data: dataSet }, { headers }
      )
    }
    if (typeForm == "add") {
      courseDetailForm.value.typb_status_approve = "รออนุมัติ"
      courseDetailForm.value.typb_comment_approve = ""
      courseDetailForm.value.typb_code_course = "enrollKey"
      const data = await axios.post(
        `${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_type_b`, { data: courseDetailForm.value }, { headers }
      )
      const dataSet = {
        hcs_date: new Date().toISOString(),
        hcs_stasus_change: "created",
        hcs_type_b: data.data._id,
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
        `${import.meta.env.VITE_API_HOST}/mongoose/update/eec_type_b/${typeBID}`, { data: courseDetailForm.value }, { headers }
      )
      const dataSet = {
        hcs_date: new Date().toISOString(),
        hcs_stasus_change: "approve",
        hcs_type_b: typeBID,
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
async function getData() {
  try {
    await axios.get(
      `${import.meta.env.VITE_API_HOST}/mongoose/getOne/eec_type_b/${typeBID}`, { headers }
    ).then((result) => {
      console.log(result)
      courseDetailForm.value.typb_name_course = result.data.typb_name_course
      courseDetailForm.value.typb_academy = result.data.typb_academy
      courseDetailForm.value.typb_coordinator = result.data.typb_coordinator
      courseDetailForm.value.typb_contact = result.data.typb_contact
      courseDetailForm.value.typb_email = result.data.typb_email
      courseDetailForm.value.typb_count_tainees = result.data.typb_count_tainees
      courseDetailForm.value.typb_training_schedule = result.data.typb_training_schedule
      courseDetailForm.value.typb_duration_training = result.data.typb_duration_training
      courseDetailForm.value.typb_count_member_gen = result.data.typb_count_member_gen
      courseDetailForm.value.typb_count_gen = result.data.typb_count_gen
      courseDetailForm.value.typb_benefits_trainees = result.data.typb_benefits_trainees
      courseDetailForm.value.typb_budget_per_gen = result.data.typb_budget_per_gen
      courseDetailForm.value.typb_total_budget = result.data.typb_total_budget
      courseDetailForm.value.typb_target_group = result.data.typb_target_group
      courseDetailForm.value.typb_origin_importance = result.data.typb_origin_importance
      courseDetailForm.value.typb_entrepreneurs_training = result.data.typb_entrepreneurs_training
      courseDetailForm.value.typb_target_industries = result.data.typb_target_industries
      courseDetailForm.value.typb_details_expense_categories = result.data.typb_details_expense_categories
      courseDetailForm.value.typb_skill_set = result.data.typb_skill_set
      courseDetailForm.value.typb_impact = result.data.typb_impact
      courseDetailForm.value.typb_training_details = result.data.typb_training_details
      courseDetailForm.value.typb_status_approve = result.datatypb_status_approve
      courseDetailForm.value.typb_comment_approve = result.data.typb_comment_approve
      courseDetailForm.value.typb_code_course = result.data.typb_code_course

    })
      .catch((err) => {
        console.log(err)
      })
  } catch (error) {

  }

}
async function getCourseData() {
  console.log("test")
  try {
    const data = {
      populate: ["typb_created_by"],
      // where: {
      //   hcs_stasus_change: "created"
      // }
    }
    await axios.post(
      `${import.meta.env.VITE_API_HOST}/mongoose/initial/TypeB`, "", { headers }
    ).then((result) => {
      console.log('result')
      console.log(result)
      options.value = result.data
    })
      .catch((err) => {
        console.log(err)
      })
  } catch (error) {

  }

}
async function getDataByName() {
  try {
    const data = {
      // populate: ["typb_created_by"],
      where: {
        typb_name_course: courseDetailForm.value.typb_name_course
      }
    }
    await axios.post(
      `${import.meta.env.VITE_API_HOST}/mongoose/getOne/eec_type_b`, data, { headers }
    ).then((result) => {
      console.log(result)
      typeBID = result.data._id
      courseDetailForm.value.typb_name_course = result.data.typb_name_course
      courseDetailForm.value.typb_academy = result.data.typb_academy
      courseDetailForm.value.typb_coordinator = result.data.typb_coordinator
      courseDetailForm.value.typb_contact = result.data.typb_contact
      courseDetailForm.value.typb_email = result.data.typb_email
      courseDetailForm.value.typb_count_tainees = result.data.typb_count_tainees
      courseDetailForm.value.typb_training_schedule = result.data.typb_training_schedule
      courseDetailForm.value.typb_duration_training = result.data.typb_duration_training
      courseDetailForm.value.typb_count_member_gen = result.data.typb_count_member_gen
      courseDetailForm.value.typb_count_gen = result.data.typb_count_gen
      courseDetailForm.value.typb_benefits_trainees = result.data.typb_benefits_trainees
      courseDetailForm.value.typb_budget_per_gen = result.data.typb_budget_per_gen
      courseDetailForm.value.typb_total_budget = result.data.typb_total_budget
      courseDetailForm.value.typb_target_group = result.data.typb_target_group
      courseDetailForm.value.typb_origin_importance = result.data.typb_origin_importance
      courseDetailForm.value.typb_entrepreneurs_training = result.data.typb_entrepreneurs_training
      courseDetailForm.value.typb_target_industries = result.data.typb_target_industries
      courseDetailForm.value.typb_details_expense_categories = result.data.typb_details_expense_categories
      courseDetailForm.value.typb_skill_set = result.data.typb_skill_set
      courseDetailForm.value.typb_impact = result.data.typb_impact
      courseDetailForm.value.typb_training_details = result.data.typb_training_details
      courseDetailForm.value.typb_status_approve = result.datatypb_status_approve
      courseDetailForm.value.typb_comment_approve = result.data.typb_comment_approve
      courseDetailForm.value.typb_code_course = result.data.typb_code_course

    })
      .catch((err) => {
        console.log(err)
      })
  } catch (error) {

  }
}

const addLearningOutcomes = () => {
  courseDetailForm.value.typb_skill_set.push("");
};
const deleteLearningOutcomes = (index) => {
  console.log(courseDetailForm.value)
  courseDetailForm.value.typb_skill_set.splice(index, 1);
};
const addImpacttest = () => {
  courseDetailForm.value.typb_details_expense_categories.push({
    typePay: "ค่าเดินทาง",
    budget_per_model: "1000"
  });
  // ,
  // courseDetailForm.value.typb_impact.push("");
};
const deleteImpacttest = (index) => {
  courseDetailForm.value.typb_details_expense_categories.splice(index, 1);
};
const addImpact = () => {
  courseDetailForm.value.typb_impact.push("");
};
const deleteImpact = (index) => {
  courseDetailForm.value.typb_impact.splice(index, 1);
};
const deleteItem = (index) => {
  courseDetailForm.value.typb_training_details.splice(index, 1);
};
const addItem = () => {
  courseDetailForm.value.typb_training_details.push({
    topic: "",
    outcomes: "",
  });
};
const validateFormEB01Page1 = () => {
  refFormEB01Page1.value?.validate().then((valid) => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};
const validateFormEB01Page2 = () => {
  console.log(refFormEB01Page1);
  refFormEB01Page2.value?.validate().then((valid) => {
    console.log(valid.valid);
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false; ง
    }
  });
};

const validateFormEB01Page3 = () => {
  refFormEB01Page3.value?.validate().then((valid) => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};

const validateFormEB01Page4 = () => {
  refFormEB01Page3.value?.validate().then((valid) => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};



// const inputValue = ref('');
const options = ref([]); // ข้อมูลตัวเลือก

// ฟังก์ชันเพื่อแสดงหรือซ่อนดรอปดาว
// const showDropdown = computed(() => inputValue.value.length > 0);
const showDropdown = ref(false)


// ฟังก์ชันในการกรองตัวเลือกที่ตรงกับข้อมูลที่พิม
const filteredOptions = computed(() => {
  return options.value.filter(option =>
    option.typb_name_course.toLowerCase().includes(courseDetailForm.value.typb_name_course.toLowerCase())
  );
});

// ฟังก์ชันในการเลือกตัวเลือก
const selectOption = async (option) => {
  courseDetailForm.value.typb_name_course = option;

  const result = await sweetalertService.showAlert(
    "มีข้อมูลนี่อยู่เเล้วต้องการแก้ไขหรือไม่",
    "โปรดเลือกดำเนินการที่คุณต้องการ !",
    "warning",
    t("button.confirm"),
    t("button.cancel")
  );
  if (result.isConfirmed) {
    console.log("selectOption")
    showDropdown.value = false;
    console.log("typeFormNew")
    console.log(typeForm)
    typeForm = "edit"
    // await save();
    await sweetalertService.showSuccessTimeOut(
      t("sweetAdd.complete"),
      t("sweetAdd.yourDataHasBeenSuccessfullyIncreased")
    );
    getDataByName()
    // backMainPage()
    // router.replace({ name: 'backMainPage' });
  } else {
    typeForm = "add"
    showDropdown.value = false;
    console.log("typeFormNew")
    console.log(typeForm)
    sweetalertService.showAlertTimeOut(
      t("sweetAdd.cancel"),
      t("sweetAdd.successfullyCanceledDataIncrease"),
      "error"
    );
  }
};

// ฟังก์ชันในการเพิ่มตัวเลือกใหม่
const addNewOption = () => {
  // if (!options.value.includes(inputValue.value)) {
  //   options.value.push(inputValue.value);
  //   selectOption(inputValue.value);
  // }
  showDropdown.value = false;

  console.log("typeForm")

  console.log(typeForm)
  typeForm = "add"
  console.log("typeFormNew")
  console.log(typeForm)

};

const maxlength = (event) => {
  let value = event.target.value;
  if (value.length > 10) {
    value = value.slice(0, 10);
  }
  courseDetailForm.value.typb_contact = value;
  this.$emit('input', courseDetailForm.value.typb_contact);
}

// ฟังก์ชันเรียกใช้งานเมื่อกรอกข้อมูล
const onInput = () => {
  showDropdown.value = courseDetailForm.value.typb_name_course.length > 0;
  let tmp = options.value.filter(option => option.typb_name_course.toLowerCase() == courseDetailForm.value.typb_name_course.toLowerCase())
  console.log(tmp)
  console.log(tmp.length != 0)

};


const nameCourseValidator = () => {
  if (typeForm == "add") {
    let tmp = options.value.filter(option => option.typb_name_course.toLowerCase() == courseDetailForm.value.typb_name_course.toLowerCase())
    console.log(tmp)
    console.log(tmp.length != 0)
    // if (tmp.length != 0) {
    return tmp.length == 0 || 'ข้อมูลซ้ำ'
    // }
  } else {
    return true
  }

}


</script>

<style scoped lang="scss">
hr {
  border: 1px solid rgba(0, 0, 0, 0.1);
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

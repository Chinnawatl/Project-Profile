<script setup lang="js">
import { computed, ref } from "vue";
import { VForm } from "vuetify/components/VForm";
import { router } from "@/plugins/1.router";
import sweetalertService from '../../../service/sweetalertService';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const route = useRoute();


const id = ref(route.params.id);
const refGraduate = ref();

/*
 * validateGraduateForm
 * สำหรับการเช็คค่าในฟอร์มว่ามีข้อมูลอยู่หรือไม่
 * param: เลขหน้า
 * return: -
 */

const validateGraduateForm = async () => {
  const result = await refGraduate.value?.validate();
  return result.valid;
};

const headers = computed(() =>[
  { title: t("graduate.formAdd.prefix"), key: "rotg_prefix" },
  { title: t("graduate.formAdd.firstname"), key: "rotg_firstname" },
  { title: t("graduate.formAdd.lastname"), key: "rotg_lastname" },
  { title: t("graduate.formAdd.ID-Card"), key: "rotg_id_card" },
  { title: t("graduate.formAdd.level"), key: "rotg_level" },
  { title: t("graduate.formAdd.role"), key: "rotg_role" },
  { title: t("graduate.formAdd.action"), key: "action" },
]);

const graduates = ref([
  {
    rotg_prefix: null ,
    rotg_firstname: "",
    rotg_lastname: "",
    rotg_id_card: "",
    rotg_level: "",
    rotg_role: "",
    rotg_id_training: id.value,
    rotg_type: "A",
  },
]);

/*
 * combineName
 * เป็นฟังก์ชันสำหรับรวมข้อมูล prefix, firstname, lastname เป็น rotg_name
 * param: -
 * return: -
 */
// const combineName = (graduate) => {
//   graduate.rotg_name = `${graduate.prefix} ${graduate.firstname} ${graduate.lastname}`;
// };

// const sanitizedGraduates = graduates.value.map(graduate => {
//         const { prefix, firstname, lastname, ...rest } = graduate;
//         return rest;
//       });

//       const accessTokenCookie = useCookie('accessToken')
//       const headers = {
//         "Authorization": "Bearer " + accessTokenCookie.value
//       }
//       await axios.post(
//         `${import.meta.env.VITE_API_HOST}/mongoose/upsertDocument/eec_training_graduates`, 
//         {
//           uniqueField:["rotg_name", "rotg_id_card"],
//           data: sanitizedGraduates,
//         }, 
//         { headers }
//       );

/*
 * addGraduate
 * เป็นฟังก์ชันสำหรับยืนยันในการบันทึกข้อมูล
 * param: -
 * return: -
 */
const addGraduate = async (valid) => {
  if (!valid) {
    sweetalertService.showAlertTimeOut(
      t("sweetAdd.unableToAddData"),
      t("sweetAdd.pleaseInputACompleteData"),
      "error",
      t("button.confirm"),
      t("button.cancel")
    );
    return;
  }

  try {
    const result = await sweetalertService.showAlert(
      t("sweetAdd.doYouWantToIncreaseData"),
      t("sweetAdd.pleaseSelectTheActionYouWant"),
      "warning",
      t("button.confirm"),
      t("button.cancel")
    );
    console.log(graduates.value)
    if (result.isConfirmed) {
      // graduates.value.forEach(combineName);
      console.log(graduates.value)
      const accessTokenCookie = useCookie('accessToken')
      const headers = {
        "Authorization": "Bearer " + accessTokenCookie.value
      }
      await axios
        .post(`${import.meta.env.VITE_API_HOST}/mongoose/bulkWriteGraduate/eec_training_graduates`,{
          data: graduates.value},{ headers },
        )
        console.log(graduates.value)
      sweetalertService.showSuccessTimeOut(
        t("sweetAdd.complete"),
        t("sweetAdd.yourDataHasBeenSuccessfullyIncreased")
      );

      router.push({ name: 'type-agradute' });
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

};

/*
 * handleFormSubmit
 * เป็นฟังก์ชันสำหรับกดปุ่มส่งฟอร์ม
 * param: -
 * return: -
 */

const handleFormSubmit = async () => {
  const isValid = await validateGraduateForm();
  console.log(isValid);
  addGraduate(isValid);
};

/*
 * addRow
 * สำหรับการกดปุ่มเพื่อเพิ่มแถวในตาราง
 * param: เลขหน้า
 * return: -
 */
const addRow = () => {
  graduates.value.push({
    rotg_prefix: null ,
    rotg_firstname: "",
    rotg_lastname: "",
    rotg_id_card: "",
    rotg_level: "",
    rotg_role: "",
    rotg_id_training: id.value,
    rotg_type: "A",
  });
};

/*
 * addRow
 * สำหรับการกดปุ่มเพื่อเพิ่มแถวในตาราง
 * param: index
 * return: -
 */
const removeRow = (index) => {
  if (index == 0) {
    sweetalertService.showAlertTimeOut(
      "ไม่สามารถลบแถวนี้ได้",
      " ",
      "error"
    );
    return;
  } else {
    graduates.value.splice(index, 1);
  }

};
</script>

<template>
  <div>
    <VCard>
      <template v-slot:title>
        <div class="d-flex">
          <h2 class="bold">{{ $t('graduate.formAdd.addGraduateData') }}</h2>
        </div>
      </template>
      <hr />
      <VCardText>
        <VForm ref="refGraduate" @submit.prevent="handleFormSubmit">
          <VDataTable :headers="headers" :items="graduates" >
            <template v-slot:bottom v-if="true">
            </template>
            <template #item.rotg_prefix="{item} ">
              <VSelect v-model="item.rotg_prefix" :rules="[requiredValidator]" placeholder="เลือกคำนำหน้า"
                :items="['นาย', 'นาง', 'นางสาว']" variant="underlined"  />
            </template>
            <template #item.rotg_firstname="{ item }">
              <VTextField v-model="item.rotg_firstname" placeholder="ชลเทพ" :rules="[value => !!value || $t('rule.require'),
          value => /^[ก-๙a-zA-Z]+$/.test(value) || $t('rule.alphabet')]"
                variant="underlined" />
            </template>
            <template #item.rotg_lastname="{ item }">
              <VTextField v-model="item.rotg_lastname" placeholder="อรุณรุ่ง" :rules="[value => !!value || $t('rule.require'),
          value => /^[ก-๙a-zA-Z]+$/.test(value) || $t('rule.alphabet')]"
                variant="underlined" />
            </template>
            <template #item.rotg_id_card="{ item }">
              <VTextField v-model="item.rotg_id_card" maxlength="13" placeholder="1027xxxxxxxxx" :rules="[lengthValidator(item.rotg_id_card, 13)] "
                variant="underlined" />
            </template>
            <template #item.rotg_level="{ item }">
              <VTextField v-model="item.rotg_level" placeholder="กลาง" :rules="[requiredValidator]"
                variant="underlined" />
            </template>
            <template #item.rotg_role="{ item }">
              <VTextField v-model="item.rotg_role" placeholder="Develop" :rules="[value => !!value || $t('rule.require'),
          value => /^[ก-๙a-zA-Z]+$/.test(value) || $t('rule.alphabet')]"
                variant="underlined" />
            </template>
            <template #item.action="{ item, index }">
              <div class="d-flex gap-1">
                <IconBtn @click="addRow">
                  <VIcon icon="tabler-plus" />
                </IconBtn>
                <IconBtn @click="removeRow(index)">
                  <VIcon icon="tabler-trash" />
                </IconBtn>
              </div>

            </template>
          </VDataTable>
          <!-- <div>
            <VBtn @click="addRow">Add New Row</VBtn>
          </div> -->
          <div class="button-container">
            <!-- <VBtn color="success" type="submit">บันทึก</VBtn> -->
            <VBtn type="submit"> {{ $t('button.save') }} </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>
<style lang="scss">

.v-data-table__td{
  width: calc(100% / 7);
}
.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  
}
</style>

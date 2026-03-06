<template>
  <VCard>
    <template v-slot:title>
      <div class="d-flex">
        <h2 class="bold">{{ $t('matching.editDemand.editPosition') }}</h2>
      </div>
    </template>
    <hr />
    <VCardText>
      <VForm ref="refProductForm" @submit.prevent="submitForm">
        <VRow>
          <VCol cols="12" md="12">
            <AppTextField v-model="positionData.job_name" :rules="[requiredValidator]"
              :label="$t('matching.editDemand.position')" placeholder="position" />
          </VCol>

          <VCol cols="12" md="12">
            <AppCombobox v-model="positionData.job_skill_set" placeholder="skill_set"
              :label="$t('matching.editDemand.skillSet')" chips closable-chips multiple :rules="[requiredValidator]" />
          </VCol>

          <VCol cols="12" md="12">
            <AppTextarea v-model="positionData.job_company" :label="$t('matching.editDemand.company')" rows="3"
              placeholder="company" :rules="[requiredValidator]" />
          </VCol>



          <VCol cols="12" class="d-flex justify-center align-center gap-4">
            <VBtn type="reset" @click="CancelButton" color="error">
              {{ $t('button.cancel') }}
            </VBtn>

            <VBtn type="submit" color="success">
              {{ $t('button.save') }}
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>

<script lang="js" setup>
import { router } from '@/plugins/1.router';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { VForm } from "vuetify/components/VForm";
import sweetalertService from '../../../service/sweetalertService';
const { t } = useI18n();


const route = useRoute();

const id = ref('');

const requiredValidator = (value) => !!value || 'กรอกข้อมูล';
onMounted(async () => {

  id.value = route.params.id// ใช้ 'id' แทนที่ id ที่เก็บค่าตัวแปรไว้
  await getPositionEdit();
})
const positionData = ref({
  job_name: '',
  job_company: '',
  job_skill_set: null,
});

const refProductForm = ref(null);
const refValid = ref(true);
const validateProductForm = () => {
  return refProductForm.value?.validate().then(valid => {
    if (valid.valid) {
      refValid.value = true;
    } else {
      refValid.value = false;
    }

    return valid.valid;
  });
};

const getPositionEdit = async () => {

  try {
    const accessTokenCookie = useCookie('accessToken')
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    await axios
      .get(`${import.meta.env.VITE_API_HOST}/mongoose/getOne/eec_jobs/${id.value}`, { headers }, {

      })
      .then((result) => {
        positionData.value.job_name = result.data.job_name;
        positionData.value.job_company = result.data.job_company;
        positionData.value.job_skill_set = result.data.job_skill_set;
      })
      .catch((err) => {
        console.log(err)
      })
  } catch (error) {
    console.log(error)
  }
};


const submitForm = async () => {
  const isValid = await validateProductForm();
  if (!isValid) {
    sweetalertService.showAlertTimeOut(
      "ไม่สามารถเพิ่มข้อมูลได้",
      "กรุณากรอกข้อมูลให้ครบถ้วน",
      "error"
    );
    return;
  }

  try {
    const result = await sweetalertService.showAlert(
      t("sweetEdit.doyouWantToModifyData"),
      t("sweetEdit.pleaseSelectTheActionYouWant"),
      "warning",
      t("button.confirm"),
      t("button.cancel")
    );
    if (result.isConfirmed) {
      try {
        const accessTokenCookie = useCookie('accessToken')
        const headers = {
          "Authorization": "Bearer " + accessTokenCookie.value
        }
        await axios
          .put(`${import.meta.env.VITE_API_HOST}/mongoose/update/eec_jobs/${id.value}`, {
            data: positionData.value,
          }, { headers },)
          .then((result) => {
            console.log(result)
            sweetalertService.showSuccessTimeOut(
              t("sweetEdit.complete"),
              t("sweetEdit.yourDataHasBeenSuccessfullyModifies")
            );
            router.replace({ name: 'matching-manage-deman' });
          })
          .catch((err) => {
            console.log(err)
          })
      } catch (error) {
        console.log(error)
      }

    } else {
      sweetalertService.showAlertTimeOut(
        t("sweetEdit.cancel"),
        t("sweetEdit.successfullyCanceledDataModify"),
        "error"
      );
    }
    await axios
      .get(`${import.meta.env.VITE_API_HOST}/mongoose/getOne/eec_jobs/${id.value}`, { headers }, {

      })
      .then((result) => {
        positionData.value.job_name = result.data.job_name;
        positionData.value.job_company = result.data.job_company;
        positionData.value.job_skill_set = result.data.job_skill_set;
      })
      .catch((err) => {
        console.log(err)
      })
  } catch (error) {
    console.log(error)
  }
};
const CancelButton = () => {
  router.replace({ name: 'matching-manage-deman' });
};




</script>

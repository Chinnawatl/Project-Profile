<template>
  <VCard>
    <template v-slot:title>
      <div class="d-flex">
        <h3 class="">
          {{ $t('curriculum.EditCourse') }}
        </h3>
      </div>
    </template>
    <hr />
    <VCardText>
      <VForm ref="refCurriculumForm" @submit.prevent="handleFormSubmit">
        <VRow>
          <VCol cols="12" md="6">
            <AppTextField v-model="curriculumForm.typa_academy" placeholder="Institution" multiple chips
              :rules="[requiredValidator]" :label="$t('curriculum.formTypeA.Institution')" />
          </VCol>

          <VCol cols="12" md="6">
            <AppTextField v-model="curriculumForm.typa_name" :rules="[requiredValidator]" placeholder="Course"
              :label="$t('curriculum.formTypeA.Course')" />
          </VCol>

          <VCol cols="12" md="6">
            <AppTextarea v-model="curriculumForm.typa_detail" rows="3" placeholder="Description"
              :rules="[requiredValidator]" :label="$t('curriculum.formTypeA.Description')" />
          </VCol>

          <VCol cols="12" md="6">
            <AppTextarea v-model="curriculumForm.typa_goal" rows="3" placeholder="Objective"
              :rules="[requiredValidator]" :label="$t('curriculum.formTypeA.Objective')" />
          </VCol>

          <VCol cols="12" md="6">
            <AppTextarea v-model="curriculumForm.typa_level" rows="3" placeholder="Content level"
              :rules="[requiredValidator]" :label="$t('curriculum.formTypeA.ContentLevel')" />
          </VCol>

          <VCol cols="12" md="6">
            <AppTextarea v-model="curriculumForm.typa_structure" rows="3" placeholder="Course structure"
              :rules="[requiredValidator]" :label="$t('curriculum.formTypeA.CourseStructure')" />
          </VCol>

          <VCol cols="12" md="6">
            <VCombobox v-model="curriculumForm.typa_skill_set" chips closable-chips multiple placeholder="Skills"
              :rules="[requiredValidator]" :label="$t('curriculum.formTypeA.Skills')">
            </VCombobox>
          </VCol>

          <VCol cols="12" class="d-flex justify-center align-center gap-4">
            <VBtn type="reset" color="error" @click="cancelForm">
              Cancel
            </VBtn>

            <VBtn type="submit" color="success">
              Save
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>

<script setup lang="js">
import { requiredValidator } from "@/@core/utils/validators";
import axios from "axios";
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VForm } from 'vuetify/components/VForm';
import sweetalertService from '../../../service/sweetalertService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
console.log("pull id" + route.params.id)
const id = ref(route.params.id);

onMounted(() => {
  // console.log("pull id" + id.value)
  getCurriculum();
});
const curriculumForm = ref({});
const refCurriculumForm = ref(null);
const refvalid = ref(true);

const getCurriculum = async () => {
try {
    const accessTokenCookie = useCookie('accessToken')
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    const response = await axios.get(`${import.meta.env.VITE_API_HOST}/mongoose/getOne/eec_type_a/${id.value}`, { headers });
    curriculumForm.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const validateCurriculumForm = () => {
  return refCurriculumForm.value?.validate().then(valid => {
    if (valid.valid) {
      refvalid.value = true;
    } else {
      refvalid.value = false;
    }
    return refvalid.value;
  });
};

const handleFormSubmit = async () => {
  const isValid = await validateCurriculumForm();
  editCurriculum(isValid);
};

const editCurriculum = async (valid) => {
  if (valid) {
    try {
      const result = await sweetalertService.showAlert(
        t("sweetEdit.doyouWantToModifyData"),
        t("sweetEdit.pleaseSelectTheActionYouWant"),
        "warning",
        t("button.confirm"),
        t("button.cancel")
      );
      if (result.isConfirmed) {
        await editCurriculumData();
        sweetalertService.showSuccessTimeOut(
          t("sweetEdit.complete!"),
          t("sweetEdit.yourDataHasBeenSuccessfullyModifies")
        );
        router.replace({ name: 'type-acurriculum-type-a' });
      } else {
        sweetalertService.showAlertTimeOut(
          t("sweetEdit.cancel"),
          t("sweetEdit.successfullyCanceledDataModify"),
          "error"
        );
      }
    } catch (error) {
      sweetalertService.showErrorTimeOut("Error", "An error occurred.");
    }
  }
}

const editCurriculumData = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken')
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    await axios.put(`${import.meta.env.VITE_API_HOST}/mongoose/update/eec_type_a/${id.value}`, {
      data: curriculumForm.value
    }, { headers });
  } catch (error) {
    console.log(error);
  }
};



const cancelForm = () => {
  router.push({ name: 'type-acurriculum-type-a' });
};
</script>



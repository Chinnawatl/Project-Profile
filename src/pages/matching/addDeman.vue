<template>
  <VCard>
    <template v-slot:title>
      <div class="d-flex">
        <h2 class="bold"> {{ $t("matching.addDeman.headAdd") }} </h2>
      </div>
    </template>
    <hr />
    <VCardText>
      <VForm ref="refProductForm" @submit.prevent="submitForm">
        <VRow>
          <!-- Job Name Field with Filtered Dropdown -->
          <VCol cols="12" md="12">
            <AppTextField
              v-model="positionData.job_name"
              :rules="[requiredValidator]"
              :label="$t('matching.addDeman.Position')"
              :placeholder="$t('matching.addDeman.Position')"
              @input="onInput('job_name')"
            />
            <div v-if="showDropdownName">
              <ul>
                <li
                  v-for="option in filteredNameOptions"
                  :key="option"
                  @click="selectOption('job_name', option)"
                >
                  {{ option }}
                </li>
                <li
                  v-if="filteredNameOptions.length === 0"
                  @click="addNewOption"
                >
                  "{{ positionData.job_name }}" ไม่พบข้อมูล เพิ่มข้อมูล
                </li>
              </ul>
            </div>
          </VCol>

          <!-- Job Skill Set Field -->
          <VCol cols="12" md="12">
            <AppCombobox
              v-model="positionData.job_skill_set"
              :placeholder="$t('matching.addDeman.Skill')"
              :label="$t('matching.addDeman.Skill')"
              chips
              closable-chips
              multiple
              :rules="[requiredValidator]"
            />
          </VCol>

          <!-- Job Company Field with Filtered Dropdown -->
          <VCol cols="12" md="12">
            <AppTextarea
              v-model="positionData.job_company"
              :label="$t('matching.addDeman.Company')"
              rows="3"
              :placeholder="$t('matching.addDeman.Company')"
              :rules="[requiredValidator]"
              @input="onInput('job_company')"
            />
            <div v-if="showDropdownCompany">
              <ul>
                <li
                  v-for="option in filteredCompanyOptions"
                  :key="option"
                  @click="selectOption('job_company', option)"
                >
                  {{ option }}
                </li>
                <li
                  v-if="filteredCompanyOptions.length === 0"
                  @click="addNewOption"
                >
                  "{{ positionData.job_company }}" ไม่พบข้อมูล เพิ่มข้อมูล
                </li>
              </ul>
            </div>
          </VCol>

          <!-- Buttons -->
          <VCol cols="12" class="d-flex justify-center align-center gap-4">
            <VBtn type="reset" @click="CancelButton" color="error">
              {{ $t("matching.addDeman.BTNaddDeman.BTNcancel") }}
            </VBtn>

            <VBtn type="submit" color="success">
              {{ $t("matching.addDeman.BTNaddDeman.BTNsave") }}
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>

<script lang="js" setup>
import axios from 'axios';
import Router, { router } from '@/plugins/1.router';
import sweetalertService from '../../../service/sweetalertService';
import { VForm } from "vuetify/components/VForm";
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from "vue";
const { t } = useI18n();

const positionData = ref({
  job_name: '',
  job_company: '',
  job_skill_set: null,
});
const refProductForm = ref(null);
const refValid = ref(true);
const CompanyItems = ref([]);
const PositionItems = ref([]);
const showDropdownName = ref(false);
const showDropdownCompany = ref(false);

// New properties for filtering
const filteredNameOptions = ref([]);
const filteredCompanyOptions = ref([]);

const requiredValidator = (value) => !!value || 'กรอกข้อมูล';
const validateProductForm = () => {
  return refProductForm.value?.validate().then(valid => {
    refValid.value = valid.valid;
    return valid.valid;
  });
};
const CancelButton = () => {
  router.replace({ name: 'matching-manage-deman' });
};

// Filter options based on user input
const onInput = (field) => {
  const input = positionData.value[field].toLowerCase();
  if (field === 'job_name') {
    if (input) {
      filteredNameOptions.value = PositionItems.value.filter(option =>
        option.toLowerCase().includes(input)
      );
      showDropdownName.value = true;
    } else {
      showDropdownName.value = false;
    }
  } else if (field === 'job_company') {
    if (input) {
      filteredCompanyOptions.value = CompanyItems.value.filter(option =>
        option.toLowerCase().includes(input)
      );
      showDropdownCompany.value = true;
    } else {
      showDropdownCompany.value = false;
    }
  }
};

// Handle option selection
const selectOption = (field, option) => {
  positionData.value[field] = option;
  if (field === 'job_name') {
    showDropdownName.value = false;
  } else if (field === 'job_company') {
    showDropdownCompany.value = false;
  }
};

const submitForm = async () => {
  const isValid = await validateProductForm();
  if (!isValid) {
    sweetalertService.showAlertTimeOut(
      t("sweetAdd.unableToAddData"),
      t("sweetAdd.pleaseInputACompleteData"),
      "error",
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
    if (result.isConfirmed) {
      const accessTokenCookie = useCookie('accessToken');
      const headers = {
        "Authorization": "Bearer " + accessTokenCookie.value
      };
      try {
        await axios
          .post(`${import.meta.env.VITE_API_HOST}/mongoose/upsertDocument/eec_jobs`, {
            uniqueField: ["job_name", "job_company"], data: positionData.value,
          }, { headers })
          .then(() => {
            sweetalertService.showSuccessTimeOut(
              t("sweetAdd.complete"),
              t("sweetAdd.yourDataHasBeenSuccessfullyIncreased"),
            );
            router.replace({ name: 'matching-manage-deman' });
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
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
};

const getFilter = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken');
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    };
    const response = await axios.get(`${import.meta.env.VITE_API_HOST}/mongoose/initialData/Job`, { headers });

    if (Array.isArray(response.data)) {
      const companies = new Set(response.data.map(item => item.job_company));
      CompanyItems.value = Array.from(companies);

      const positions = new Set(response.data.map(item => item.job_name));
      PositionItems.value = Array.from(positions);
    } else {
      console.error("Response data is not an array", response.data);
    }

  } catch (error) {
    console.log(error);
  }
};

const addNewOption = () => {
  showDropdownName.value = false;
  showDropdownCompany.value = false;
};

onMounted(async () => {
  await getFilter();
});
</script>
<style lang="scss" scoped>
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

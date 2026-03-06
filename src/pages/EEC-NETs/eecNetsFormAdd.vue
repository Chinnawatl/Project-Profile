/*
* eecNetsFormAdd
* Add EEC-NETs data
* Author: Teerajuk Sakunchaisitthichok
* Create date: 19 June 2024
*/
<script setup lang="js">
import AppTextarea from "@/@core/components/app-form-elements/AppTextarea.vue";
import axios from 'axios';
import { ref } from "vue";
import { useI18n } from 'vue-i18n';
import { useRouter } from "vue-router";
import { VForm } from "vuetify/components/VForm";
import sweetalertService from '../../../service/sweetalertService';

const accessTokenCookie = useCookie('accessToken')
const headers = {
  "Authorization": "Bearer " + accessTokenCookie.value
}
const { t } = useI18n();

const router = useRouter();
const addEecNets = async (valid) => {
  if (!valid) {
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
      await addEecNetsData();
      sweetalertService.showSuccessTimeOut(
        t("sweetAdd.complete"),
        t("sweetAdd.yourDataHasBeenSuccessfullyIncreased")
      );
      router.replace({ name: 'eecnets-eec-nets' });
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
  console.log(switchForm.value)
};

const editEecNets = async (valid) => {
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
        await editEecNetsData();
        sweetalertService.showSuccessTimeOut(
          t("sweetEdit.complete"),
          t("sweetEdit.yourDataHasBeenSuccessfullyModifies")
        );
        router.replace({ name: 'eecnets-eec-nets' });
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
  console.log(switchForm.value)
}

const editEecNetsData = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken')
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    await axios.put(`${import.meta.env.VITE_API_HOST}/mongoose/update/eec_nets/${id.value}`, {
      data: netsForm.value
    }, { headers });
  } catch (error) {
    console.log(error);
  }
};

const addEecNetsData = async () => {
  try {

    await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/insert/eec_nets`, {
      data: netsForm.value,
    }, { headers });
  } catch (error) {
    console.log(error);
  }
};
const numberedSteps = [
  { title: t("eecNets.formAdd.step.networkCenterData") },
  { title: t("eecNets.formAdd.step.cooperationWithAgenciesOrEstablishments") },
  { title: t("eecNets.formAdd.step.productionAndPersonnelSkillDevelopment") }
];

const currentStep = ref(0);
const isCurrentStepValid = ref(true);
const refNetsForm = ref(null);
const refConnectionForm = ref(null);
const refProductForm = ref(null);

const netsForm = ref({
  net_name: "",
  net_type: "",
  net_location: "",
  net_city: "",
  net_department: "",
  net_cooperation: "",
  net_address: "",
  net_phone: "",
  net_email: "",
  net_product: "",
  net_develop: ""
});

// const connectionForm = ref({
//   net_department: "",
//   net_cooperation: "",
//   net_address: "",
//   net_phone: "",
//   net_email: ""
// });

// const productForm = ref({
//   net_product: "",
//   net_develop: ""
// });

const validateNetsForm = () => {
  return refNetsForm.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
    return valid.valid;
  });
};

const validateConnectionForm = () => {
  return refConnectionForm.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
    return valid.valid;
  });
};

const validateProductForm = () => {
  return refProductForm.value?.validate().then(valid => {
    if (valid.valid) {
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
    return valid.valid;
  });
};

const switchForm = ref('add');
const showDropdownName = ref(false);
const showDropdownType = ref(false);
const showDropdownCity = ref(false);
const id = ref();
const onInput = (value) => {
  console.log("Input value:", value);

  if (value === "name") {
    showDropdownName.value = netsForm.value.net_name.length > 0;
  } else if (value === "type") {
    showDropdownType.value = netsForm.value.net_type.length > 0;
  } else if (value === "city") {
    showDropdownCity.value = netsForm.value.net_city.length > 0;
  }
};

const optionsName = ref([]); // ข้อมูลตัวเลือก
const optionsType = ref([]); // ข้อมูลตัวเลือก
const optionsCity = ref([]); // ข้อมูลตัวเลือก

const filteredOptionsName = computed(() => {
  return optionsName.value.filter(option =>
    option.toLowerCase().includes(netsForm.value.net_name.toLowerCase())
  );
});
const filteredOptionsType = computed(() => {
  return optionsType.value.filter(option =>
    option.toLowerCase().includes(netsForm.value.net_type.toLowerCase())
  );
});
const filteredOptionsCity = computed(() => {
  return optionsCity.value.filter(option =>
    option.toLowerCase().includes(netsForm.value.net_city.toLowerCase())
  );
});

const selectOptionType = async (option) => {
  netsForm.value.net_type = option;
  showDropdownType.value = false;
  checkInput();
};

const selectOptionCity = async (option) => {
  netsForm.value.net_city = option;
  showDropdownCity.value = false;
  checkInput();
};

const selectOptionName = async (option) => {
  netsForm.value.net_name = option;
  showDropdownName.value = false;
  checkInput();
};

// ตรวจสอบว่ากรอกครบทั้ง 3 ช่องแล้วหรือยัง
const checkInput = async () => {
  if (netsForm.value.net_name && netsForm.value.net_type && netsForm.value.net_city) {
    checkForExistingRecord();
  }
};


const checkForExistingRecord = async () => {
  try {
    // ดึงข้อมูลจากฐานข้อมูลโดยใช้เงื่อนไขชื่อ, ประเภท, เมือง
    const where = {
      net_name: netsForm.value.net_name.trim(),
      net_type: netsForm.value.net_type.trim(),
      net_city: netsForm.value.net_city.trim(),
    };

    const result = await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/getOne/eec_nets`, {
      where: where,
    }, { headers });
    if (result.data) {
      // แสดงการยืนยันให้แก้ไขข้อมูล
      const editResult = await sweetalertService.showAlertChangeToEdit(
        t("change.duplicate"),
        t("change.what"),
        t("change.choose"),
        "warning",
        t("button.confirm"),
        t("button.cancel")
      );

      if (editResult.isConfirmed) {
        await sweetalertService.showSuccessTimeOut(
          t("change.complete"),
          t("change.switchFinish")
        );
        // ถ้าพบข้อมูลที่ตรงกัน
        if (result.data) {
          netsForm.value = result.data;
          // console.log(netsForm.value)
          id.value = netsForm.value._id;
          console.log(id.value)
        }
        switchForm.value = 'edit';
        console.log(switchForm.value)
      } else {
        sweetalertService.showAlertTimeOut(
          t("change.cancel"),
          t("change.cancelFinish"),
          "error"
        );
      }
    }


  } catch (error) {
    console.error(error);
  }
};
const getFilter = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_HOST}/mongoose/initialData/eecNets`,{ headers });
      optionsName.value = [...response.data.net_name];

      optionsType.value = [...response.data.net_type];

      optionsCity.value = [...response.data.net_city];
    
  } catch (error) {
    console.error(error);
  }
};

const saveChange = () => {
  if (switchForm.value == 'edit') {
    handleFormEdit();
  } else if (switchForm.value == 'add') {
    handleFormSubmit();
  }
}

const handleFormSubmit = async () => {
  const isValid = await validateProductForm();
  addEecNets(isValid);
};

const handleFormEdit = async () => {
  const isValid = await validateProductForm();
  editEecNets(isValid);
};

onMounted(async () => {
  await getFilter();
  console.log(switchForm.value)
});
</script>

<template>
  <VCard>
    <template v-slot:title>
      <div class="d-flex">
        <h3 class="">
          {{ $t('eecNets.formAdd.increaseEecNetsData') }}
        </h3>
      </div>
    </template>

    <hr />
    <VCardText>
      <AppStepper v-model:current-step="currentStep" :items="numberedSteps"
        :is-active-step-valid="isCurrentStepValid" />
    </VCardText>
    <hr />
    <VDivider />

    <VCardText>
      <VWindow v-model="currentStep" class="disable-tab-transition">
        <VWindowItem>
          <VForm ref="refNetsForm" @submit.prevent="validateNetsForm">
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">
                  {{ $t('eecNets.formAdd.detailNetworkCenter') }}
                </h6>
                <p class="mb-0">{{ $t('eecNets.formAdd.inputDatailNetworkData') }}</p>
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField v-model="netsForm.net_name" placeholder="EEC-Automation Park"
                  :rules="[value => !!value || $t('rule.require')]" :label="$t('eecNets.formAdd.networkCenter')"
                  @input="onInput('name')" />
                <div v-if="showDropdownName" class="dropdown-container">
                  <ul>
                    <li v-for="option in filteredOptionsName" :key="option" @click="selectOptionName(option)">
                      {{ option }}
                    </li>
                    
                  </ul>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField v-model="netsForm.net_type" placeholder="-" :rules="[value => !!value || $t('rule.require'),
                value => /^[a-zA-Zก-ฮ\u0E00-\u0E7F\s]+$/.test(value) || $t('rule.alphabet')
                ]" :label="$t('eecNets.formAdd.typeNetworkCenter')" @input="onInput('type')" />
                <div v-if="showDropdownType" class="dropdown-container">
                  <ul>
                    <li v-for="option in filteredOptionsType" :key="option" @click="selectOptionType(option)">
                      {{ option }}
                    </li>
                    
                  </ul>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField v-model="netsForm.net_location" :label="$t('eecNets.formAdd.location')"
                  placeholder="ม. บูรพา, FIBO มทร. ตะวันออก" :rules="[value => !!value || $t('rule.require')]" />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField v-model="netsForm.net_city" :label="$t('eecNets.formAdd.city')" placeholder="ชลบุรี"
                  :rules="[value => !!value || $t('rule.require'),
                  value => /^[a-zA-Zก-ฮ\u0E00-\u0E7F\s]+$/.test(value) || $t('rule.alphabet')
                  ]" @input="onInput('city')" />
                <div v-if="showDropdownCity" class="dropdown-container">
                  <ul>
                    <li v-for="option in filteredOptionsCity" :key="option" @click="selectOptionCity(option)">
                      {{ option }}
                    </li>
                    
                  </ul>
                </div>
              </VCol>
              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn color="secondary" variant="tonal" @click="$router.push({ name: 'eecnets-eec-nets' })">
                    <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                    {{ $t('button.cancel') }}
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
          <VForm ref="refConnectionForm" @submit.prevent="validateConnectionForm">
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">
                  {{ $t('eecNets.formAdd.informationOnCooperationWithAgenciesOrEstablishments') }}
                </h6>
                <p class="mb-0">
                  {{ $t('eecNets.formAdd.inputTheInformationOnCooperationWithAgenciesOrEstablishments') }}
                </p>
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField v-model="netsForm.net_department"
                  :label="$t('eecNets.formAdd.nameOfAgencyOrEstablishment')"
                  :rules="[value => !!value || $t('rule.require')]" placeholder="กกท." />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField v-model="netsForm.net_cooperation" :label="$t('eecNets.formAdd.cooperation')"
                  :rules="[value => !!value || $t('rule.require')]" placeholder="พัฒนาพื้นที่เมืองใหม่" />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField v-model="netsForm.net_address" :label="$t('eecNets.formAdd.contactLocation')"
                  :rules="[value => !!value || $t('rule.require')]"
                  placeholder="ชั้น 18 อาคารจัตุรัสจามจุรี ถนนพญาไท เขตปทุมวัน กรุงเทพมหานคร 10330" />
              </VCol>
              <VCol cols="12" md="3">
                <AppTextField v-model="netsForm.net_phone" :label="$t('eecNets.formAdd.contactPhoneNumber')" :rules="[value => !!value || $t('rule.require'),
                value => /^[0-9-]+$/.test(value) || $t('rule.phoneNumber')
                ]" placeholder="090xxxxxxx" />
              </VCol>
              <VCol cols="12" md="3">
                <AppTextField v-model="netsForm.net_email" :label="$t('eecNets.formAdd.email')" :rules="[
                  value => !!value || $t('rule.require'),
                  value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || $t('rule.requireEmail') + ' [emailxxx@email.com]'
                ]" placeholder="carterleonardo@gmail.com" />
              </VCol>
              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--, isCurrentStepValid = true">
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
          <VForm ref="refProductForm" @submit.prevent="saveChange">
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">
                  {{ $t('eecNets.formAdd.informationOnProductionAndPersonnelSkillDevelopment') }}
                </h6>
                <p class="mb-0">{{ $t('eecNets.formAdd.inputTheInformationOnProductionAndPersonnelSkillDevelopment') }}
                </p>
              </VCol>
              <VCol cols="12" md="6">
                <AppTextarea v-model="netsForm.net_product" placeholder=""
                  :rules="[value => !!value || $t('rule.require')]"
                  :label="$t('eecNets.formAdd.informationOnProduction')" />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextarea v-model="netsForm.net_develop" placeholder=""
                  :rules="[value => !!value || $t('rule.require')]"
                  :label="$t('eecNets.formAdd.personnelSkillDevelopment')" />
              </VCol>
              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--, isCurrentStepValid = true">
                    <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                    {{ $t('button.previous') }}
                  </VBtn>
                  <VBtn color="success" type="submit">
                    {{ $t('button.submit') }}
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>
<style lang="scss">
/* Container for the dropdown list */
.dropdown-container {
  position: relative;
}

/* Dropdown list styles */
.dropdown-container ul {
  /* Light background color */
  position: absolute;
  z-index: 1000;
  padding: 0;
  border: 1px solid #ddd;

  /* Softer border color */
  border-radius: 6px;
  margin: 0;

  /* Softer shadow */
  background-color: #f9f9f9;

  /* Slightly rounded corners */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 15%);
  inline-size: 100%;
  list-style-type: none;
  max-block-size: 200px;

  /* Adjust height as needed */
  overflow-y: auto;

  /* Enable scrolling if necessary */
}

/* List item styles */
.dropdown-container li {
  padding: 12px;

  /* Adjust font size as needed */
  color: #333;

  /* Slightly more padding for better spacing */
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.3s ease, color 0.3s ease;

  /* Darker text color for better readability */
}

/* Hover effect for list items */
.dropdown-container li:hover {
  background-color: #e6e6e6;

  /* Subtle hover background color */
  color: #000;

  /* Text color on hover */
}

/* Style for the "Add new option" item */
.dropdown-container li.add-new {
  color: #007bff;

  /* Blue color for the add new option */
  font-weight: bold;
}

/* Style for empty state */
.dropdown-container li.empty-state {
  padding: 12px;
  color: #666;
  font-style: italic;

  /* Grey color for empty state text */
  text-align: center;
}
</style>

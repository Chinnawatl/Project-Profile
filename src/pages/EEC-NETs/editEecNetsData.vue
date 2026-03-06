/*
* editEecNetsData
* Edit EEC-NETs data
* Author: Teerajuk Sakunchaisitthichok
* Create date: 24 June 2024
*/
<script setup lang="js">
import axios from "axios";
import { onMounted, ref } from "vue";
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { VForm } from "vuetify/components/VForm";
import sweetalertService from '../../../service/sweetalertService';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const refForm = ref(null);


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
}

const refValid = ref(true);

const validateRefForm = () => {
  return refForm.value?.validate().then(valid => {
    if (valid.valid) {
      refValid.value = true;
    } else {
      refValid.value = false;
    }
    return valid.valid;
  });
};

const handleFormSubmit = async () => {
  const isValid = await validateRefForm();
  editEecNets(isValid);
};

const eecNetsSelect = ref([]);
const id = ref(route.params.id);
const getEecNets = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken')
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    const response = await axios.get(`${import.meta.env.VITE_API_HOST}/mongoose/getone/eec_nets/${id.value}`, { headers });
    eecNetsSelect.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const editEecNetsData = async () => {
  try {
    const accessTokenCookie = useCookie('accessToken')
    const headers = {
      "Authorization": "Bearer " + accessTokenCookie.value
    }
    await axios.put(`${import.meta.env.VITE_API_HOST}/mongoose/update/eec_nets/${id.value}`, {
      data: eecNetsSelect.value
    }, { headers });
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getEecNets();
});
</script>

<style lang="scss">
hr {
  border: 1px solid rgba(0, 0, 0, 10%);
}
</style>

<template>
  <VCard>
    <template v-slot:title>
      <div class="d-flex">
        <h3 class="">
          {{ $t('eecNets.formEdit.modifyEecNetsData') }}
        </h3>
      </div>
    </template>

    <hr />
    <VDivider />

    <VCardText>
      <VForm ref="refForm" @submit.prevent="handleFormSubmit">
        <VRow>
          <VCol cols="12">
            <h6 class="text-h6 font-weight-medium">
              {{ $t('eecNets.formEdit.detailNetworkCenter') }}
            </h6>
            <p class="mb-0">{{ $t('eecNets.formEdit.inputDatailNetworkData') }}</p>
          </VCol>

          <VCol cols="12" md="6">
            <AppTextField v-model="eecNetsSelect.net_name" placeholder="EEC-Automation Park"
              :rules="[value => !!value || $t('rule.require')]" :label="$t('eecNets.formEdit.networkCenter')" />
          </VCol>

          <VCol cols="12" md="6">
            <AppTextField v-model="eecNetsSelect.net_type" placeholder="-"
              :rules="[value => !!value || $t('rule.require')]" :label="$t('eecNets.formEdit.typeNetworkCenter')" />
          </VCol>

          <VCol cols="12" md="6">
            <AppTextField v-model="eecNetsSelect.net_location" :label="$t('eecNets.formEdit.location')"
              placeholder="ม. บูรพา, FIBO มทร. ตะวันออก" :rules="[value => !!value || $t('rule.require')]" />
          </VCol>
          <VCol cols="12" md="6">
            <AppTextField v-model="eecNetsSelect.net_city" :label="$t('eecNets.formEdit.city')" placeholder="ชลบุรี"
              :rules="[value => !!value || $t('rule.require')]" />
          </VCol>
        </VRow>

        <VRow>
          <VCol cols="12">
            <hr class="mb-3">
            <h6 class="text-h6 font-weight-medium">
              {{ $t('eecNets.formEdit.informationOnCooperationWithAgenciesOrEstablishments') }}
            </h6>
            <p class="mb-0">
              {{ $t('eecNets.formEdit.inputTheInformationOnCooperationWithAgenciesOrEstablishments') }}
            </p>
          </VCol>

          <VCol cols="12" md="6">
            <AppTextField v-model="eecNetsSelect.net_department"
              :label="$t('eecNets.formEdit.nameOfAgencyOrEstablishment')"
              :rules="[value => !!value || $t('rule.require')]" placeholder="กกท." />
          </VCol>

          <VCol cols="12" md="6">
            <AppTextField v-model="eecNetsSelect.net_cooperation" :label="$t('eecNets.formEdit.cooperation')"
              :rules="[value => !!value || $t('rule.require')]" placeholder="พัฒนาพื้นที่เมืองใหม่" />
          </VCol>

          <VCol cols="12" md="6">
            <AppTextField v-model="eecNetsSelect.net_address" :label="$t('eecNets.formEdit.contactLocation')"
              :rules="[value => !!value || $t('rule.require')]"
              placeholder="ชั้น 18 อาคารจัตุรัสจามจุรี ถนนพญาไท เขตปทุมวัน กรุงเทพมหานคร 10330" />
          </VCol>

          <VCol cols="12" md="3">
            <AppTextField v-model="eecNetsSelect.net_phone" :label="$t('eecNets.formEdit.contactPhoneNumber')"
              :rules="[value => !!value || $t('rule.require')]" placeholder="090xxxxxxx" />
          </VCol>
          <VCol cols="12" md="3">
            <AppTextField v-model="eecNetsSelect.net_email" :label="$t('eecNets.formEdit.email')" :rules="[
              value => !!value || $t('rule.require'),
              value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || $t('rule.requireEmail')
            ]" placeholder="carterleonardo@gmail.com" />
          </VCol>
        </VRow>

        <VRow>
          <VCol cols="12">
            <hr class="mb-3">
            <h6 class="text-h6 font-weight-medium">
              {{ $t('eecNets.formEdit.informationOnProductionAndPersonnelSkillDevelopment') }}
            </h6>
            <p class="mb-0">{{ $t('eecNets.formEdit.inputTheInformationOnProductionAndPersonnelSkillDevelopment') }}</p>
          </VCol>

          <VCol cols="12" md="6">
            <AppTextarea v-model="eecNetsSelect.net_product" placeholder=""
              :rules="[value => !!value || $t('rule.require')]" :label="$t('eecNets.formEdit.informationOnProduction')"
              rows="3" />
          </VCol>
          <VCol cols="12" md="6">
            <AppTextarea v-model="eecNetsSelect.net_develop" placeholder=""
              :rules="[value => !!value || $t('rule.require')]"
              :label="$t('eecNets.formEdit.personnelSkillDevelopment')" rows="3" />
          </VCol>
          <VCol cols="12">
            <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
              <VBtn color="secondary" variant="tonal" @click="$router.push({ name: 'eecnets-eec-nets' })">
                <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                {{ $t('button.cancel') }}
              </VBtn>
              <VBtn color="success" type="submit">
                <VIcon icon="tabler-device-floppy" start />
                {{ $t('button.save') }}
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>

<script setup lang="js">
import NavbarPublic from '../../layouts/components/NavBarPublic.vue';
import pr1 from '@images/eecImages/eec-hdc.jpg';
import pr2 from '@images/eecImages/pr2.jpg';
definePage({ meta: { layout: 'blank' } })
</script>

<template>
    <NavbarPublic />
    <VCardText>
      <h1> {{ $t('PR.general.headG') }} </h1>
    </VCardText>
    <VCard style="background-color: #FF8600; margin-bottom: 30px">
      <VCardText>
        <VRow>
          <VCol cols="10" md="3">
            <AppTextField
              class="bg-color"
              v-model="search"
              :placeholder="'| ' + $t('PR.general.search')"
              prepend-inner-icon="tabler-search"
              single-line
              hide-details
              dense
              outlined
            />
          </VCol>
          <VCol cols="10" md="3">
            <AppTextField
              class="bg-color"
              type="date"
              :placeholder="$t('PR.general.calendar')"
              single-line
              hide-details
              dense
              outlined
            />
          </VCol>
          <p style="color: white;">{{ $t('PR.general.to') }}</p>
          <VCol cols="10" md="3">
            <AppTextField
              class="bg-color"
              type="date"
              :placeholder="$t('PR.general.calendar')"
              single-line
              hide-details
              dense
              outlined
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  
    <VRow>
      <VCol cols="12" md="4">
        <VCard class="wider-card">
          <VImg :src="pr1" height="180" width="100%" />
          <VCardText class="colorText">EEC HDC คืออะไร?</VCardText>
          <VCardText style="display: flex; align-items: center;">
            <v-icon>tabler-calendar</v-icon>
            <span style="margin-left: 8px;">03/09/2567</span>
            <VBtn class="btn-color" style="margin-left: auto;">
              {{ $t('PR.general.readmore') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
      <!-- คัดลอกโค้ดการ์ดอื่น ๆ ด้วยโครงสร้างเดียวกัน -->
      <VCol cols="12" md="4">
        <VCard class="wider-card">
          <VImg :src="pr2" height="180" width="100%" />
          <VCardText class="colorText">Humen Resource?</VCardText>
          <VCardText style="display: flex; align-items: center;">
            <v-icon>tabler-calendar</v-icon>
            <span style="margin-left: 8px;">03/09/2567</span>
            <VBtn class="btn-color" style="margin-left: auto;">
              {{ $t('PR.general.readmore') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </template>
  
  <style lang="scss" scoped>
  .bg-color {
    background-color: white;
  }
  
  .colorText {
    color: #7773A5;
    font-weight: bold; /* ปรับน้ำหนักตัวอักษร */
  }
  
  .btn-color {
    background-color: #060048;
    color: white;
  }
  
  h1 {
    font-size: 50px;
    margin: 20px;
  }
  
  .wider-card {
    margin-left: 20px;
  }
  </style>
  

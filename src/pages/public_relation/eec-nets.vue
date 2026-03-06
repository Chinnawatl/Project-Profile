<script setup lang="js">
import pr1 from '@images/eecImages/eec-hdc.jpg';
definePage({ meta: { layout: 'blank' } })
import NavbarPublic from '../../layouts/components/NavBarPublic.vue';

</script>

<template>
  <NavbarPublic />

  <VCardText>
    <h1>{{ $t('PR.eecNets.headeecNets')}}</h1>
  </VCardText>
  <VRow style="margin-left: 20px;">
    <VCol cols="auto" class="p-0 mx-2">
      <VBtn class="bg-warning"> {{ $t('PR.eecNets.B1') }} </VBtn>
    </VCol>
    <VCol cols="auto" class="p-0 mx-2">
      <VBtn class="bg-warning">{{ $t('PR.eecNets.B2') }}</VBtn>
    </VCol>
    <VCol cols="auto" class="p-0 mx-2">
      <VBtn class="bg-warning">{{ $t('PR.eecNets.B3') }}</VBtn>
    </VCol>
  </VRow>

  <VRow style="margin-left: 20px;">
    <VCol cols="12" md="4">
      <VCard class="mb-5">
        <!-- รูปภาพการ์ด -->
        <VImg :src="pr1" height="200px" class="mx-auto" />

        <!-- เนื้อหาการ์ด -->
        <VCardText class="p-3">
          <div class="text-grey-5 mb-2">14.05.2564</div>
          <div>
            <strong>EEC HDC</strong> ร่วมขับเคลื่อนอุตสาหกรรมยานยนต์ไฟฟ้า นำร่องพื้นที่อีอีซี สู่เศรษฐกิจสีเขียว
            สร้างงาน รายได้
            คู่ดูแลสิ่งแวดล้อม นายอภิชาต ทองอยู่ ประธานคณะทำงานประสานงานด้านการพัฒนาบุคลากรในเขตพัฒนาพิเศษภาคตะวันออก
            (EEC HDC)
            เข้าร่วมบรรยาย การสัมมนาเชิงปฏิบัติการออนไลน์
          </div>
        </VCardText>

        <!-- ปุ่มการ์ด -->
        <VCardActions>
          <VBtn outlined class="mx-auto">{{ $t('PR.eecNets.readmore') }}</VBtn>
        </VCardActions>
      </VCard>
    </VCol>

    <VCol cols="12" md="4">
      <VCard class="mb-5">
        <!-- รูปภาพการ์ด -->
        <VImg :src="pr1" height="200px" class="mx-auto" />

        <!-- เนื้อหาการ์ด -->
        <VCardText class="p-3">
          <div class="text-grey-5 mb-2">14.05.2564</div>
          <div>
            <strong>EEC HDC</strong> ร่วมขับเคลื่อนอุตสาหกรรมยานยนต์ไฟฟ้า นำร่องพื้นที่อีอีซี สู่เศรษฐกิจสีเขียว
            สร้างงาน รายได้
            คู่ดูแลสิ่งแวดล้อม นายอภิชาต ทองอยู่ ประธานคณะทำงานประสานงานด้านการพัฒนาบุคลากรในเขตพัฒนาพิเศษภาคตะวันออก
            (EEC HDC)
            เข้าร่วมบรรยาย การสัมมนาเชิงปฏิบัติการออนไลน์
          </div>
        </VCardText>

        <!-- ปุ่มการ์ด -->
        <VCardActions>
          <VBtn outlined class="mx-auto">{{ $t('PR.eecNets.readmore') }}</VBtn>
        </VCardActions>
      </VCard>
    </VCol>

    <VCol cols="12" md="4">
      <VCard class="mb-5">
        <!-- รูปภาพการ์ด -->
        <VImg :src="pr1" height="200px" class="mx-auto" />

        <!-- เนื้อหาการ์ด -->
        <VCardText class="p-3">
          <div class="text-grey-5 mb-2">14.05.2564</div>
          <div>
            <strong>EEC HDC</strong> ร่วมขับเคลื่อนอุตสาหกรรมยานยนต์ไฟฟ้า นำร่องพื้นที่อีอีซี สู่เศรษฐกิจสีเขียว
            สร้างงาน รายได้
            คู่ดูแลสิ่งแวดล้อม นายอภิชาต ทองอยู่ ประธานคณะทำงานประสานงานด้านการพัฒนาบุคลากรในเขตพัฒนาพิเศษภาคตะวันออก
            (EEC HDC)
            เข้าร่วมบรรยาย การสัมมนาเชิงปฏิบัติการออนไลน์
          </div>
        </VCardText>

        <!-- ปุ่มการ์ด -->
        <VCardActions>
          <VBtn outlined class="mx-auto">{{ $t('PR.eecNets.readmore') }}</VBtn>
        </VCardActions>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.text-grey-5 {
  color: #9e9e9e;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.p-3 {
  padding: 16px; /* ปรับขนาด padding ให้เหมาะสม */
}

h1{
    font-size: 50px;
    margin: 20px;
}


</style>

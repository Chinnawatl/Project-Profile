<script setup lang="js">
import company from '@images/eecImages/company.png';
import pr1 from '@images/eecImages/eec-hdc.jpg';
import home from '@images/eecImages/home.jpg';
import home1 from '@images/eecImages/home1.png';
import NavbarPublic from '../../layouts/components/NavBarPublic.vue';

definePage({ meta: { layout: 'blank' } })
</script>
<template>
    <NavbarPublic />
    <VRow>
        <VCardText style=" font-size: 60px; margin-top: 50px; margin-left: 40px">
            {{ $t('PR.home.welcome') }}
            <span style="color: #F99E39;  margin-left: 8px;">EEC</span>
        </VCardText>
    </VRow>
    <VRow>
        <div class="line"></div>
    </VRow>

    <VRow>
        <VCardText style=" font-size: 40px; margin-top: 10px; margin-left: 40px">
            ระบบ
            <span style="color: #F99E39;  margin-left: 5px;">EEC</span>
            มีงานทำ
        </VCardText>
    </VRow>
    <div class="backImagehome">
        <VImg :src="home1" height="100%" width="100%" style="margin-left: 20px;" />
        <VCardText class="overlay-text">
            <h1 style="color: white;">About System</h1>
            <span>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                into
                electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
                release of
                Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
                Aldus PageMaker including versions of Lorem Ipsum.</span>
        </VCardText>

    </div>
    <div class="bg-imageBoat">
        <VImg :src="home" class="rounded-image" height="auto" width="80%" />
    </div>
    <VRow>
        <VCardText class="header" style="font-size: 80px;">
            {{ $t('PR.home.target') }}
        </VCardText>
    </VRow>
    <VRow style="align-items: center;">
        <VCol cols="12" md="4" class="spaceBetweenTop">
            <VImg :src="company" height="200" />
            <VCardText class="textCenterforGoal">{{ $t('PR.home.stu') }}</VCardText>
        </VCol>
        <VCol cols="12" md="4" class="spaceBetweenTop">
            <VImg :src="company" height="200" />
            <VCardText class="textCenterforGoal">{{ $t('PR.home.unEmp') }}</VCardText>
        </VCol>
        <VCol cols="12" md="4" class="spaceBetweenTop">
            <VImg :src="company" height="200" />
            <VCardText class="textCenterforGoal">{{ $t('PR.home.company') }}</VCardText>
        </VCol>
    </VRow>

    <VCard style="background-color: #F99E39; color: white; margin-top: 50px;">
        <VCardText class="header" style="font-size: 80px; margin-top: 20px;">
            EEC News
        </VCardText>
        <VCardText class="header" style="font-size: 18px; color: white; margin-top: 20px;">
            ข่าวประชาสัมพันธ์
        </VCardText>
        <VRow style="display: flex; justify-content: center; align-items: center;">
            <VCol cols="auto" class="p-0 mx-2">
                <VBtn class="bg-info"> ข่าวสารทั่วไป </VBtn>
            </VCol>
            <VCol cols="auto" class="p-0 mx-2">
                <VBtn class="bg-info"> กิจกรรม EEC</VBtn>
            </VCol>
            <VCol cols="auto" class="p-0 mx-2">
                <VBtn class="bg-info"> ข่าวสารความร่วมมือ </VBtn>
            </VCol>
        </VRow>
        <VRow>
            <VCol cols="12" md="4">
                <VCard class="wider-card">
                    <VImg :src="pr1" height="100" width="100%" />
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
            <!-- Repeat for other cards -->
            <VCol cols="12" md="4">
                <VCard class="wider-card">
                    <VImg :src="pr1" height="100" width="100%" />
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
            <VCol cols="12" md="4">
                <VCard class="wider-card">
                    <VImg :src="pr1" height="100" width="100%" />
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
        </VRow>
    </VCard>


</template>

<style lang="scss" scoped>
.spaceBetweenTop {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.textCenterforGoal {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 25px !important;
}

h1 {
    font-size: 50px;
}

.wider-card {
    margin-left: 50px;
    /* ลด margin-left */
    margin-right: 10px;
    /* เพิ่ม margin-right เพื่อให้ช่องว่างเท่ากันทั้งสองด้าน */
    margin-top: 10px;
    /* ลด margin-top */
    margin-bottom: 50px;
    /* ลด margin-bottom */
    width: 70%;
    /* ใช้ความกว้างเต็ม */
    padding: 10px;
    /* เพิ่ม padding เล็กน้อยเพื่อความพอดี */
}

.header {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}

.line {
    width: 29%;
    margin-left: 70px;
    border-top: 3px solid;
    color: #F99E39;

}

.backImagehome {
    background-color: #F99E39;
    width: 70%;
    height: 30%;
    margin-left: 40px;
    margin-top: 60px;
    border-radius: 20px;
}

.overlay-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-90%, -220%);
    /* จัดตำแหน่งข้อความให้อยู่ตรงกลาง */
    color: white;
    padding: 20px;
    /* เพิ่ม padding รอบๆ ข้อความ */
}

.bg-imageBoat {
    position: absolute;
    width: 70%;
    height: 30%;
    transform: translate(80%, -85%);
    border-radius: 20px;
}

.rounded-image {
    border-radius: 20px; /* กำหนดขนาดของมุมโค้ง */
}
</style>

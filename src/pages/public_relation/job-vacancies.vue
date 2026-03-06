<script setup lang="js">
import logoIV from '@images/eecImages/IV.png';
definePage({ meta: { layout: 'blank' } })
import NavbarPublic from '../../layouts/components/NavBarPublic.vue';

</script>

<template>
    <NavbarPublic />
    <VCardText>
        <h1> {{ $t('PR.jobV.headJ') }} </h1>
    </VCardText>
    <VCard style="background-color: #FF8600; margin-bottom: 30px;">
        <VCardText>
            <VRow style="display: flex; justify-content: center;">
                <VCol cols="12" md="3">
                    <AppTextField class="bg-color" v-model="search" :placeholder="'| ' + $t('PR.jobV.search')" single-line hide-details
                        dense outlined />
                </VCol>
                <VCol cols="12" md="3">
                    <AppAutocomplete class="bg-color" v-model="selectedOption" :placeholder=" $t('PR.jobV.type') " />
                </VCol>
                <VCol cols="12" md="3">
                    <AppAutocomplete class="bg-color" v-model="selectedOption" :placeholder=" $t('PR.jobV.city')" />
                </VCol>
                <VCol cols="12" md="3">
                    <VBtn class="bg-info" style="margin-left: auto;">
                        <v-icon>tabler-search</v-icon>
                    </VBtn>
                </VCol>
            </VRow>
        </VCardText>
    </VCard>
    <VRow style="margin-left: 20px;">
        <VCol cols="10" md="3">
            <VCard>
                <VImg :src="logoIV" height="30%" width="20%" style="margin-left: 20px;"/>
                <VCardText>
                    <p class="textColor">Fullstack Developer</p>
                    <p class="head">บริษัท ไอวี ซอฟต์ จำกัด</p>
                    <p class="detail">3 อัตรา</p>
                    <p class="detail">28,000 - 32,000 บาท</p>
                    <p class="head"> {{ $t('PR.jobV.req') }} </p>
                    <p class="detail">๐ HTML, CSS, Javascript, PHP</p>
                    <p class="detail">๐ Water Fall, Scrum, Agile</p>
                </VCardText>
            </VCard>
        </VCol>
        <VCol cols="10" md="3">
            <VCard>
                <VImg :src="logoIV" height="20%" width="20%" style="margin-left: 20px;"/>
                <VCardText>
                    <p class="textColor">Fullstack Developer</p>
                    <p class="head">บริษัท ไอวี ซอฟต์ จำกัด</p>
                    <p class="detail">3 อัตรา</p>
                    <p class="detail">28,000 - 32,000 บาท</p>
                    <p class="head">{{ $t('PR.jobV.req') }}</p>
                    <p class="detail">๐ HTML, CSS, Javascript, PHP</p>
                    <p class="detail">๐ Water Fall, Scrum, Agile</p>
                </VCardText>
            </VCard>
        </VCol>
        <VCol cols="10" md="3">
            <VCard>
                <VImg :src="logoIV" height="20%" width="20%" style="margin-left: 20px;"/>
                <VCardText>
                    <p class="textColor">Fullstack Developer</p>
                    <p class="head">บริษัท ไอวี ซอฟต์ จำกัด</p>
                    <p class="detail">3 อัตรา</p>
                    <p class="detail">28,000 - 32,000 บาท</p>
                    <p class="head">{{ $t('PR.jobV.req') }}</p>
                    <p class="detail">๐ HTML, CSS, Javascript, PHP</p>
                    <p class="detail">๐ Water Fall, Scrum, Agile</p>
                </VCardText>
            </VCard>
        </VCol>
        <VCol cols="10" md="3">
            <VCard>
                <VImg :src="logoIV" height="20%" width="20%" style="margin-left: 20px;"/>
                <VCardText>
                    <p class="textColor">Fullstack Developer</p>
                    <p class="head">บริษัท ไอวี ซอฟต์ จำกัด</p>
                    <p class="detail">3 อัตรา</p>
                    <p class="detail">28,000 - 32,000 บาท</p>
                    <p class="head">{{ $t('PR.jobV.req') }}</p>
                    <p class="detail">๐ HTML, CSS, Javascript, PHP</p>
                    <p class="detail">๐ Water Fall, Scrum, Agile</p>
                </VCardText>
            </VCard>
        </VCol>
        <VCol cols="10" md="3">
            <VCard>
                <VImg :src="logoIV" height="20%" width="20%" style="margin-left: 20px;"/>
                <VCardText>
                    <p class="textColor">Fullstack Developer</p>
                    <p class="head">บริษัท ไอวี ซอฟต์ จำกัด</p>
                    <p class="detail">3 อัตรา</p>
                    <p class="detail">28,000 - 32,000 บาท</p>
                    <p class="head">{{ $t('PR.jobV.req') }}</p>
                    <p class="detail">๐ HTML, CSS, Javascript, PHP</p>
                    <p class="detail">๐ Water Fall, Scrum, Agile</p>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
</template>

<style lang="scss" scoped>
.bg-color {
    background-color: white;
    border-radius: 15px;
    border-color: #FF8600;
    color:  #FF8600;
}

.textColor {
    color: #FF8600;
    font-size: 20px;
}

.head{
    font-size: 18px; color: black;
}

.detail{
    font-size: 16px;
}

h1{
    font-size: 50px;
    margin: 20px
}
</style>

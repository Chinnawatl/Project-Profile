<template>
  <VCard>
    <VCardText>
      <!-- 👉 Stepper -->
      <AppStepper
        v-model:current-step="currentStep"
        :items="numberedSteps"
        :is-active-step-valid="isCurrentStepValid"
      />
    </VCardText>

    <VDivider />

    <VCardText>
      <!-- 👉 stepper content -->
      <VWindow v-model="currentStep" class="disable-tab-transition">
        <VWindowItem>
          <VForm ref="refAccountForm" @submit.prevent="validateAccountForm">
            <VRow>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="courseDetailForm.courseName"
                  placeholder=""
                  :rules="[requiredValidator]"
                  label="ชื่อหลักสูตร"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="courseDetailForm.responsibleInstitution"
                  placeholder=""
                  :rules="[requiredValidator]"
                  label="สถานศึกษาผู้รับผิดชอบหลักสูตร"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="courseDetailForm.responsibleInstitution"
                  placeholder=""
                  :rules="[requiredValidator]"
                  label="ผู้ประสานงาน"
                />
              </VCol>
              <VCol cols="12" md="3">
                <AppTextField
                  v-model="courseDetailForm.responsibleInstitution"
                  placeholder=""
                  :rules="[requiredValidator]"
                  label="ข้อมูลติดต่อ"
                  prepend-inner-icon="tabler-phone"
                />
              </VCol>
              <VCol cols="12" md="3">
                <AppTextField
                  v-model="courseDetailForm.responsibleInstitution"
                  placeholder=""
                  :rules="[requiredValidator]"
                  label="อีเมล"
                  prepend-inner-icon="tabler-mail"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="courseDetailForm.responsibleInstitution"
                  placeholder=""
                  :rules="[requiredValidator]"
                  label="จำนวนผู้เข้าอบรม"
                />
              </VCol>
              <VCol cols="12" md="3">
                <AppTextField
                  @keypress="isNumber($event)"
                  type="number"
                  v-model="courseDetailForm.countGen"
                  placeholder=""
                  :rules="[requiredValidator]"
                  label="แบ่งออกเป็น"
                  suffix="รุ่น"
                />
              </VCol>
              <VCol cols="12" md="3">
                <AppTextField
                  @keypress="isNumber($event)"
                  type="number"
                  v-model="courseDetailForm.countMemberGen"
                  placeholder=""
                  :rules="[requiredValidator]"
                  label="รุ่นละ"
                  suffix="คน"
                />
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField
                  v-model="courseDetailForm.courseName"
                  placeholder=""
                  :rules="[requiredValidator]"
                  label="กำหนดการฝึกอบรม"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="courseDetailForm.responsibleInstitution"
                  placeholder=""
                  :rules="[requiredValidator]"
                  label="ระยะเวลาการฝึกอบรม"
                />
              </VCol>
              <VCol cols="12">
                <div
                  class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"
                >
                  <VBtn color="secondary" variant="tonal" disabled>
                    <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                    Previous
                  </VBtn>

                  <VBtn type="submit">
                    Next
                    <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol>

              <!-- <VCol cols="12">
                <div
                  class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"
                >
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="currentStep--"
                  >
                    <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                    Previous
                  </VBtn>

                  <VBtn type="submit">
                    Next
                    <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol> -->
            </VRow>
          </VForm>
        </VWindowItem>

        <!-- <VWindowItem>
          <VForm ref="refAccountForm" @submit.prevent="validateAccountForm">
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">Account Details</h6>
                <p class="mb-0">Enter your Account Details</p>
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField
                  v-model="courseDetailForm.courseName"
                  placeholder="CarterLeonardo"
                  :rules="[requiredValidator]"
                  label="courseName"
                />
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField
                  v-model="courseDetailForm.email"
                  placeholder="carterleonardo@gmail.com"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                />
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField
                  v-model="courseDetailForm.password"
                  label="Password"
                  placeholder="············"
                  :rules="[requiredValidator, passwordValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField
                  v-model="courseDetailForm.cPassword"
                  label="Confirm Password"
                  placeholder="············"
                  :rules="[
                    requiredValidator,
                    confirmedValidator(
                      courseDetailForm.cPassword,
                      courseDetailForm.password
                    ),
                  ]"
                  :type="isCPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isCPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="isCPasswordVisible = !isCPasswordVisible"
                />
              </VCol>

              <VCol cols="12">
                <div
                  class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"
                >
                  <VBtn color="secondary" variant="tonal" disabled>
                    <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                    Previous
                  </VBtn>

                  <VBtn type="submit">
                    Next
                    <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem> -->

        <!-- <VWindowItem>
          <VForm ref="refPersonalForm" @submit.prevent="validatePersonalForm">
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">Personal Info</h6>
                <p class="mb-0">Setup Information</p>
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField
                  v-model="personalForm.firstName"
                  label="First Name"
                  :rules="[requiredValidator]"
                  placeholder="Leonard"
                />
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField
                  v-model="personalForm.lastName"
                  label="Last Name"
                  :rules="[requiredValidator]"
                  placeholder="Carter"
                />
              </VCol>

              <VCol cols="12" md="6">
                <AppSelect
                  v-model="personalForm.country"
                  label="Country"
                  :rules="[requiredValidator]"
                  placeholder="Select Country"
                  :items="['UK', 'USA', 'Canada', 'Australia', 'Germany']"
                />
              </VCol>

              <VCol cols="12" md="6">
                <AppSelect
                  v-model="personalForm.language"
                  label="Language"
                  :rules="[requiredValidator]"
                  placeholder="Select Language"
                  :items="['English', 'Spanish', 'French', 'Russian', 'German']"
                />
              </VCol>

              <VCol cols="12">
                <div
                  class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"
                >
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="currentStep--"
                  >
                    <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                    Previous
                  </VBtn>

                  <VBtn type="submit">
                    Next
                    <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem> -->

        <!-- <VWindowItem>
          <VForm
            ref="refSocialLinkForm"
            @submit.prevent="validateSocialLinkForm"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">Social Links</h6>
                <p class="mb-0">Add Social Links</p>
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField
                  v-model="socialForm.twitter"
                  placeholder="https://twitter.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="Twitter"
                />
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField
                  v-model="socialForm.facebook"
                  placeholder="https://facebook.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="Facebook"
                />
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField
                  v-model="socialForm.googlePlus"
                  placeholder="https://plus.google.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="Google+"
                />
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField
                  v-model="socialForm.linkedIn"
                  placeholder="https://likedin.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="LinkedIn"
                />
              </VCol>

              <VCol cols="12">
                <div
                  class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"
                >
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="currentStep--"
                  >
                    <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                    Previous
                  </VBtn>

                  <VBtn color="success" type="submit"> submit </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem> -->
      </VWindow>
    </VCardText>
  </VCard>
</template>
<script setup>
import { VForm } from "vuetify/components/VForm";

const numberedSteps = [
  {
    title: "รายละเอียดหลักสูตร",
  },
  {
    title: "วัตถุประสงค์หลักสูตร",
  },
  {
    title: "งบประมาณ",
  },
  {
    title: "เป้าหมายหลักสูตร",
  },

  // {
  //   title: "Account Details",
  //   subtitle: "Setup Account Details",
  // },
  // {
  //   title: "Personal Info",
  //   subtitle: "Add personal info",
  // },
  // {
  //   title: "Social Links",
  //   subtitle: "Add social links",
  // },
];

const currentStep = ref(0);
const isPasswordVisible = ref(false);
const isCPasswordVisible = ref(false);
const isCurrentStepValid = ref(true);
const refAccountForm = ref();
// const refPersonalForm = ref();
// const refSocialLinkForm = ref();

const courseDetailForm = ref({
  courseName: "",
  responsibleInstitution: "",
  countMemberGen: 0,
  countGen: 0,
});

// const personalForm = ref({
//   firstName: "",
//   lastName: "",
//   country: undefined,
//   language: undefined,
// });

// const socialForm = ref({
//   twitter: "",
//   facebook: "",
//   googlePlus: "",
//   linkedIn: "",
// });

const validateAccountForm = () => {
  refAccountForm.value?.validate().then((valid) => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};
const isNumber = (evt) => {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    evt.preventDefault();
  } else {
    return true;
  }
};
// const validatePersonalForm = () => {
//   refPersonalForm.value?.validate().then((valid) => {
//     if (valid.valid) {
//       currentStep.value++;
//       isCurrentStepValid.value = true;
//     } else {
//       isCurrentStepValid.value = false;
//     }
//   });
// };

// const validateSocialLinkForm = () => {
//   refSocialLinkForm.value?.validate().then((valid) => {
//     if (valid.valid) {
//       isCurrentStepValid.value = true;
//       console.log({
//         ...courseDetailForm.value,
//         ...personalForm.value,
//         ...socialForm.value,
//       });
//     } else {
//       isCurrentStepValid.value = false;
//     }
//   });
// };
</script>

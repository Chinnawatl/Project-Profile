  /*
  * file name : accountList
  * What is it used for : View account information in the system
  * Author : Chinnawat Leekpai
  * Create date : 19 June 2024
  */

  <script setup lang="js">
  import { computed, ErrorCodes, onMounted, ref } from "vue";
  import sweetalertService from '../../../service/sweetalertService';
  import axios from 'axios';
  import { useRoute, useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();

  const positionData = ref({
    user_first_name: '',
    user_last_name: '',
    user_role: '',
    user_status: '',
  });

  const router = useRouter();
  const route = useRoute();

  const search = ref("");
  const selectedRole = ref();
  const selectedOptionStatus = ref();
  const typeRole = ref([]);
  const typeStatus = ref([]);
  const accountlist = ref([]);
  const tempStatus = ref({});


  /**
 * ชื่อฟังก์ชัน (Name Fuction) : fetchAccounts
 * ฟังก์ชันทำอะไร (What can the function do?) : เรียก API เพื่อดึงข้อมูลบัญชี
 * มีค่าอะไรบ้าง (param) : None
 * ส่งค่าอะไร (Return) : None
 */

  // ฟังก์ชันเรียก API เพื่อดึงข้อมูลบัญชี
  const fetchAccounts = async () => {
    console.log(positionData.value)
    try {
      const accessTokenCookie = useCookie('accessToken')
      const headers = {
        "Authorization": "Bearer " + accessTokenCookie.value
      }
      const response = await axios.post(`${import.meta.env.VITE_API_HOST}/mongoose/get/eec_users`,
        {
          where: {
            user_status: { $ne: 'Delete' },
          },
          populate: ['user_role']
        }, { headers },
      );
      // กรองรายการที่ไม่ใช่ Delete
      accountlist.value = response.data;

      // Initialize tempStatus
      accountlist.value.forEach(account => {
        tempStatus.value[account._id] = checkUserStatus(account.user_status);
      });

    } catch (error) {
      console.log(error);
    }
  };



  const handleSwitchChange = (item) => {
  // ตรวจสอบสถานะปัจจุบันก่อนการสลับ
  const currentStatus = checkUserStatus(item.user_status);
  console.log('Before toggle:', currentStatus);
  
  // สลับสถานะ
  tempStatus.value[item._id] = !currentStatus;
  
  console.log('After toggle:', tempStatus.value[item._id]);
  
  // เรียกใช้ฟังก์ชันเพื่ออัปเดตสถานะใหม่
  toggleUserStatus(item);
};

const toggleUserStatus = async (item) => {
  const originalStatus = checkUserStatus(item.user_status);
  const newStatus = tempStatus.value[item._id] ? 'Activate' : 'Disabled';

  console.log('Toggling status:', { id: item._id, newStatus });

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
        const accessTokenCookie = useCookie('accessToken');
        const headers = {
          "Authorization": "Bearer " + accessTokenCookie.value
        };
        await axios.put(`${import.meta.env.VITE_API_HOST}/mongoose/update/eec_users/${item._id}`, {
          data: { user_status: newStatus }
        }, { headers });

        fetchAccounts(); // ดึงข้อมูลล่าสุด
        sweetalertService.showSuccessTimeOut(
          t("sweetEdit.complete"),
          t("sweetEdit.yourDataHasBeenSuccessfullyModifies")
        );
      } catch (error) {
        console.log(error);
        sweetalertService.showErrorTimeOut("Error", "An error occurred while editing the status");
        tempStatus.value[item._id] = originalStatus;
      }
    } else {
      tempStatus.value[item._id] = originalStatus;
      sweetalertService.showAlertTimeOut(
        t("sweetEdit.cancel"),
        t("sweetEdit.successfullyCanceledDataModify"),
        "error"
      );
    }
  } catch (error) {
    console.log("Error details:", error.response ? error.response.data : error.message);
    sweetalertService.showErrorTimeOut("Error", "An error occurred while editing the status");
    tempStatus.value[item._id] = originalStatus;
  }
};


  /**
   * ชื่อฟังก์ชัน (Name Fuction) : checkUserStatus
   * ฟังก์ชันทำอะไร (What can the function do?) : ตรวจสอบสถานะผู้ใช้
   * มีค่าอะไรบ้าง (param) : status (String) - User status
   * ส่งค่าอะไร (Return) : Boolean - เป็นจริงหากสถานะเป็น 'เปิดใช้งาน' จะเป็นจริง ถ้าหากเสถานะเป็น 'ปิดใช้งาน จะเป็นเท็จ
   */

  //ฟังก์ชันเช็คสถานะ user_status
  const checkUserStatus = (status) => {
    console.log("Check status:", status);
    if (status === 'Activate' || status === 'Active') {
      return true;
    } else if (status === 'Disabled') {
      return false;
    }
    return status;
  }

  /**
* ชื่อฟังก์ชัน (Name Fuction) : filterAccounts
* ฟังก์ชันทำอะไร (What can the function do?) : กรองบัญชีผู้ใช้ตามบทบาทและสถานะที่เลือก
* มีค่าอะไรบ้าง (param) : account (Object) - รายการบัญชีผู้ใช้
* ส่งค่าอะไร (Return) : Boolean - บ่งบอกว่าบัญชีผู้ใช้ตรงตามเงื่อนไขที่เลือกหรือไม่
*/
  const filterAccounts = (account) => {
    const matchesRole = selectedRole.value && selectedRole.value !== 'All Role'
      ? account.user_role.rol_name === selectedRole.value
      : true;

    const matchesStatus = selectedOptionStatus.value && selectedOptionStatus.value !== 'All status'
      ? (selectedOptionStatus.value === 'Activate' && account.user_status) || (selectedOptionStatus.value === 'Disabled' && !account.user_status)
      : true;

    return matchesRole && matchesStatus;
  };

  /**
 * ชื่อฟังก์ชัน (Name Fuction) : transformedAccountlist
 * ฟังก์ชันทำอะไร (What can the function do?) : ทำการแปลงค่า user_status ของแต่ละบัญชีจากสถานะเดิมมาเป็นค่า boolean
 * มีค่าอะไรบ้าง (param) : None
 * ส่งค่าอะไร (Return) : อาร์เรย์ของออบเจ็กต์บัญชีที่ได้รับการแปลงโดยมี user_status เป็น boolean
 */

  //computed property สำหรับการแปลง accountlist
  const transformedAccountlist = computed(() => {
    return accountlist.value.map(account => {
      return {
        ...account,
        fullname: `${account.user_first_name} ${account.user_last_name}`,
        user_status: checkUserStatus(account.user_status),
        role_name: account.user_role ? account.user_role.rol_name : ''
      };
    })
      .filter(filterAccounts);
  });


  /**
   * ชื่อฟังก์ชัน (Name Fuction) :
   * ฟังก์ชันทำอะไร (What can the function do?) : 
   * มีค่าอะไรบ้าง (param) : 
   * ส่งค่าอะไร (Return) : 
   */

  const options = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: [""],
    sortDesc: [false],

  });

  const headers = computed(() => [
    { title: t('MangeAccount.header.fullname'), key: "fullname", width: '300px' },
    { title: t('MangeAccount.header.role'), key: "role_name", width: '250px' },
    { title: t('MangeAccount.header.status'), key: "status", width: '200px' },
    { title: t('MangeAccount.header.action'), key: "action", align: 'center', width: '200px' },
  ]);

  /**
 * ชื่อฟังก์ชัน (Name Fuction) : deleteItem
 * ฟังก์ชันทำอะไร (What can the function do?) : ลบรายการบัญชีผู้ใช้
 * มีค่าอะไรบ้าง (param) : item (Object) - รายการบัญชีผู้ใช้
 * ส่งค่าอะไร (Return) : None
 */


  const deleteItem = async (item) => {
    try {
      const result = await sweetalertService.showAlert(
        t("sweetDelete.doYouWantToDeleteData"),
        t("sweetDelete.pleaseSelectTheActionYouWant"),
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
          await axios.put(`${import.meta.env.VITE_API_HOST}/mongoose/update/eec_users/${item._id}`,
            {
              data: { user_status: 'Delete' },
            }, { headers },
          );
          fetchAccounts(); // ดึงข้อมูลล่าสุด
          sweetalertService.showSuccessTimeOut(
            t("sweetDelete.complete"),
            t("sweetDelete.yourDataHasBeenSuccessfullyDeleted")
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        sweetalertService.showAlertTimeOut(
          t("sweetDelete.cancel"),
          t("sweetDelete.successfullyCanceledDataDelete"),
          "error"
        );
      }
    } catch (error) {
      sweetalertService.showErrorTimeOut("Error", "An error occurred");
    }
  };


  const getFilter = async () => {
    try {
      const accessTokenCookie = useCookie('accessToken')
      const headers = {
        "Authorization": "Bearer " + accessTokenCookie.value
      }
      const response = await axios.get(`${import.meta.env.VITE_API_HOST}/mongoose/initialData/ManageAccount`, { headers });
      // typeRole.value = ["All Role", "super admin", "Admin", "user", "external", "dev"];
      // typeStatus.value = ['All status', 'Activate', 'Disabled'];

      // ตรวจสอบข้อมูลทั้งหมดที่ได้รับ
      console.log(response.data);

      // ข้อมูลที่ได้รับเป็นอาร์เรย์ของอ็อบเจ็กต์
      const data = response.data;

      // สร้างอาร์เรย์สำหรับ role และ status จากข้อมูลที่ได้รับ
      const rolesSet = new Set();
      const statusesSet = new Set();

      data.forEach(item => {
        rolesSet.add(item.rol_name);
        // กรองสถานะที่ไม่ต้องการออก
        if (item.user_status === 'Activate' || item.user_status === 'Disabled') {
          statusesSet.add(item.user_status);
        }
      });

      // แปลง Set เป็น Array และเพิ่มค่าเริ่มต้น
      typeRole.value = ["All Role", ...Array.from(rolesSet)];
      typeStatus.value = ['All status', ...Array.from(statusesSet)];

      // ตรวจสอบค่าที่ตั้งไว้
      console.log(typeStatus.value);
      console.log(typeRole.value);

    } catch (error) {
      console.log(error);
      sweetalertService.showErrorTimeOut("Error", "An error occurred while fetching filter data.");
    }
  }


  onMounted(() => {
    fetchAccounts();
    getFilter();
  });



  /**
 * ชื่อฟังก์ชัน (Name Fuction) : editItem
 * ฟังก์ชันทำอะไร (What can the function do?) : เพื่อนำพาไปยังหน้าแก้ไชบัญชี
 * มีค่าอะไรบ้าง (param) : item (Object) - รายการบัญชีผู้ใช้
 * ส่งค่าอะไร (Return) : None
 */

  const editItem = (item) => {
    router.push({ name: 'manage-account-edit-account', params: { id: item._id } });
  };

  /**
 * ชื่อฟังก์ชัน (Name Fuction) : viewItem
 * ฟังก์ชันทำอะไร (What can the function do?) : เพื่อนำพาไปยังหน้าดูรายละเอียดบัญชี
 * มีค่าอะไรบ้าง (param) : item (Object) - รายการบัญชีผู้ใช้
 * ส่งค่าอะไร (Return) : None
 */

  const viewItem = (item) => {
    router.push({ name: 'manage-account-viewaccount', params: { id: item._id } });
    console.log(item._id)
  };

</script>


  <template>
    <div>
      <VCard title="">

        <!-- 👉 Headers -->

        <template v-slot:title>
          <div>
            <h3 class="font-weight-bold ">
              {{ $t('MangeAccount.manageAccount') }}
            </h3>
          </div>
        </template>
        <hr />

        <VCardText>
          <VRow>
            <!-- 👉 search -->

            <VCol cols="12" md="3">
              <AppTextField v-model="search" placeholder="| ค้นหา" prepend-inner-icon="tabler-search" single-line
                hide-details dense outlined />
            </VCol>

            <!-- 👉 Role Select -->

            <VCol cols="12" md="2">
              <AppSelect v-model="selectedRole" :items="typeRole" placeholder="Role" />
            </VCol>

            <!-- 👉 Status Select -->

            <VCol cols="12" md="2">
              <AppSelect v-model="selectedOptionStatus" :items="typeStatus" placeholder="Status" />
            </VCol>

            <!-- 👉 Button Add Account -->

            <VCol cols="12" md="5" class="text-right">
              <VBtn color="info" @click="$router.push('/ManageAccount/addAccount')"> <VIcon icon="tabler-user" start />{{ $t('MangeAccount.addAccount') }}
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
        <hr>

        <VDataTable :headers="headers" :search="search" :items="transformedAccountlist"
          :items-per-page="options.itemsPerPage" :page="options.page" :options="options" class="text-no-wrap"
          :no-data-text="$t('noDataAvailable')">

          <!-- 👉 PerPage -->

          <template #bottom>
            <hr />
            <VCardText class="pt-2">
              <div class="footer-paginate">
                <span>{{ $t('MangeAccount.amount : ') }}</span>
                <VTextField v-model="options.itemsPerPage" type="number" min="1" max="10" hide-details
                  style="max-inline-size: 4vw;" class="ms-2 me-2" />
                <span class="me-2">{{ $t('MangeAccount.rowPerPage') }}</span>
                <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 1 : 3"
                  :length="Math.ceil(accountlist.length / options.itemsPerPage)" />
              </div>
            </VCardText>
          </template>

          <!-- 👉 Full Name -->

          <template #item.name="{ item }">
            <span>{{ item.user_first_name }} {{ item.user_last_name }}</span>
          </template>

          <!-- 👉 Role Account -->

          <template #item.position="{ item }">
            <span>{{ item.role_name }}</span>
          </template>

          <!-- 👉 Status Acivate & Disbled -->
          <template #item.status="{ item }">
            <div>
              <VSwitch v-model="tempStatus[item._id]" @change="handleSwitchChange(item)" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>{{ item.user_status ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}</span>
              </VTooltip>
            </div>
          </template>

          <!-- 👉 Action View , Edit & Delete -->

          <template #item.action="{ item }">
            <div class="d-flex justify-center">
              <IconBtn @click="viewItem(item)">
                <VIcon icon="tabler-eye" />
                <VTooltip open-delay="500" location="top" activator="parent">
                  <span>{{ $t('button.viewMoreDetail') }}</span>
                </VTooltip>
              </IconBtn>
              <IconBtn @click="editItem(item)">
                <VIcon icon="tabler-edit" />
                <VTooltip open-delay="500" location="top" activator="parent">
                  <span>{{ $t('button.editData') }}</span>
                </VTooltip>
              </IconBtn>
              <IconBtn @click="deleteItem(item)">
                <VIcon icon="tabler-trash" />
                <VTooltip open-delay="500" location="top" activator="parent">
                  <span>{{ $t('button.deleteData') }}</span>
                </VTooltip>
              </IconBtn>
            </div>
          </template>
        </VDataTable>
      </VCard>
    </div>
  </template>

<style lang="scss">
.footer-paginate {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 4px;
}

hr {
  border: 1px solid rgba(0, 0, 0, 10%);
}
</style>

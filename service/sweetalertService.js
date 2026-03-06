import Swal from 'sweetalert2';

const sweetalertService = {
    showAlert(title, text, icon, confirmButtonText, cancelButtonText = 'info') {
        return Swal.fire({
            title,
            text,
            icon,
            confirmButtonText,
            cancelButtonText,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: '#28C76F',
            cancelButtonColor: '#d33',
            reverseButtons: true
        });
    },
    showAlertChangeToEdit(title, subtitle, text, icon, confirmButtonText, cancelButtonText = 'info') {
        return Swal.fire({
            title: '', // ปล่อยให้เป็นค่าว่างเพราะเราจะใช้ HTML สำหรับ title
            html: `
            <div style="text-align: center;">
                <h3>${title}</h3>
                <h4 style="margin-top: 10px;">${subtitle}</h4>
                <p>${text}</p>
            </div>`,
            text,
            icon,
            confirmButtonText,
            cancelButtonText,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: '#28C76F',
            cancelButtonColor: '#d33',
            reverseButtons: true
        });
    },
    showAlertOnly(title, text, icon = 'info') {
        return Swal.fire({
            title,
            text,
        });
    },

    showAlertTimeOut(title, text, icon = 'info') {
        return Swal.fire({
            title,
            text,
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            icon
        });
    },

    showConfirmation(title, text) {
        return Swal.fire({
            customClass: {
                confirmButton: 'btn btn-indigo btn-sweet-alert mx-2 my-2 px-5',
                cancelButton: 'btn btn-outline-indigo btn-sweet-alert mx-2 my-2 px-5 '
            },
            buttonsStyling: false,
            title,
            text,
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true
        });
    },

    showErrorTimeOut(title, text) {
        return Swal.fire({
            title,
            text,
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            icon: 'error'
        });
    },

    showSuccessTimeOut(title, text) {
        return Swal.fire({
            title,
            text,
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            icon: 'success'
        });
    },

    showLoading(title, text) {
        return Swal.fire({
            title,
            text,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    },
    close() {
        Swal.close();
    }
};

export default sweetalertService;

const handleClickModalTwoStep = async () => {
    try {
      const result = await sweetalertService.showAlert(
        "ทดสอบ modal 2 Step",
        "This action cannot be undone.",
        "warning"
      );
      if (result.isConfirmed) {
        sweetalertService.showSuccessTimeOut(
          "Success!",
          "Action completed successfully."
        );
      } else {
        sweetalertService.showAlertTimeOut(
          "Cancelled",
          "Action was cancelled.",
          "error"
        );
      }
    } catch (error) {
      sweetalertService.showErrorTimeOut("Error", "An error occurred.");
    }
  };

  const handleClickModalSuccess = async () => {
    sweetalertService.showSuccessTimeOut(
      "Success!",
      "Action completed successfully."
    );
  };

  const handleClickModalError = async () => {
    sweetalertService.showErrorTimeOut("Error!", "Action Error.");
  };




 


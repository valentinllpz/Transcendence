import { Snackbar } from "@mui/material";
import { useErrorContext } from "../../context/ErrorContext";

export const ErrorSnackbar = () => {
  const errorContext = useErrorContext();

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    errorContext.hideError?.();
  };

  return (
    <Snackbar
      open={errorContext.showError}
      autoHideDuration={6000}
      onClose={handleClose}
      message={`Error: ${errorContext.errorData.statusCode} ${errorContext.errorData.error}\n${errorContext.errorData.message}`}
      // action={action
    />
  );
};

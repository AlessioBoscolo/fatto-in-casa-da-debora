import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (type, message) => {
  const toastConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  switch (type) {
    case 'success':
      toast.success(message || 'Operazione completata con successo!', toastConfig);
      break;
    case 'error':
      toast.error(message || 'Si è verificato un errore.', toastConfig);
      break;
    default:
      toast.info(message, toastConfig);
  }
};
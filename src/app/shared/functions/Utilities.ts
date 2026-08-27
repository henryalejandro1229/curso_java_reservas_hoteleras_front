import swal from 'sweetalert2';

const BRAND_MARINE = '#214985';

const Toast = swal.mixin({
  toast: true,
  position: 'bottom-right',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true
});


export function showNotifySuccess(title: string) {
  return Toast.fire({
    icon: 'success',
    title: title
  });
}

export function showNotifyWarning(title: string) {
  return swal.fire({
    heightAuto: true,
    position: 'bottom-right',
    text: title,
    showConfirmButton: false,
    timer: 1500,
    backdrop: `#0535744b`,
  });
}

export function showNotifyError(title: string, err?: any) {
  const message = err?.error?.message || err?.message;
  return swal.fire({
    position: 'bottom-right',
    icon: 'error',
    title: title,
    text: message,
    showConfirmButton: false,
    timer: 1500,
    backdrop: `#0535744b`,
  });
}

export function showSwalSuccess(title: string, message: string) {
  return swal.fire({
    icon: 'success',
    titleText: title,
    text: message,
    showCloseButton: true,
    confirmButtonColor: BRAND_MARINE,
    backdrop: `#0535744b`,
  });
}

export function showSwalError(title: string, message: string) {
  return swal.fire({
    icon: 'error',
    titleText: title,
    text: message,
    showCloseButton: true,
    confirmButtonColor: BRAND_MARINE,
    backdrop: `#0535744b`,
  });
}

export function showSwalWarning(
  title = 'Error al realizar la solicitud',
  message: string
) {
  return swal.fire({
    icon: 'warning',
    titleText: title,
    text: message,
    showCloseButton: true,
    confirmButtonColor: BRAND_MARINE,
    backdrop: `#0535744b`,
  });
}

export function showModalConfirmation(title: string, message: string) {
  return swal.fire({
    icon: 'question',
    titleText: title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: BRAND_MARINE,
    cancelButtonColor: '#d1d1d1',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    backdrop: `#0535744b`,
  });
}

export function showLoading(show = true) {
  if (show)
    return swal.fire({
      width: 150,
      heightAuto: true,
      background: '#5681b900',
      showConfirmButton: false,
      didOpen: () => {
        swal.showLoading();
      },
      allowOutsideClick: false,
      backdrop: `#0535744b`,
    });
  else return swal.close();
}

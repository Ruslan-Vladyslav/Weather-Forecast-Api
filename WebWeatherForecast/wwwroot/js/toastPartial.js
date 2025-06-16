function showToast(message, type = 'danger') {
    const toastEl = document.getElementById('appToast');
    const toastMessageEl = document.getElementById('appToastMessage');

    if (!toastEl || !toastMessageEl) {
        console.error('Toast element not found in DOM');
        return;
    }

    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    toastMessageEl.textContent = message;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

window.showToast = showToast;
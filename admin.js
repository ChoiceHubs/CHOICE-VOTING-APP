document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adminForm');
  const msg = document.getElementById('adminMsg');

  // Ensure default password exists
  if (!localStorage.getItem('admin_password')) {
    localStorage.setItem('admin_password', 'admin123'); // default password
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pw = document.getElementById('adminPass').value;
    const stored = localStorage.getItem('admin_password'); // fetch stored password

    if (pw === stored) {  // compare to stored value
      sessionStorage.setItem('admin_logged_in', 'true');
      window.location.href = 'admin-dashboard.html';
    } else {
      msg.textContent = 'Wrong password';
      setTimeout(() => msg.textContent = '', 2200);
    }
  });
});
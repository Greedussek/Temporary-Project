
import { pb } from './api.js';
import { isLoggedIn, registerUser, loginUser } from './auth.js';
import { createVillage, loadVillages, showResourcesForVillage } from './village.js';

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const result = document.getElementById('result');
const error = document.getElementById('error');
const formContainer = document.getElementById('formContainer');
const con = document.getElementById('con');
const list = document.getElementById("villageList");

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  result.textContent = 'Rejestracja...';
  error.textContent = '';

  try {
    await registerUser(
      document.getElementById('regEmail').value,
      document.getElementById('regPassword').value,
      document.getElementById('regPasswordConfirm').value
    );
    result.textContent = 'Rejestracja zakończona sukcesem';
  } catch (err) {
    error.textContent = err.message || 'Błąd rejestracji';
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  result.textContent = 'Logowanie...';

  try {
    await loginUser(
      document.getElementById('logIdentity').value,
      document.getElementById('logPassword').value
    );
    result.textContent = 'Zalogowano pomyślnie';
    formContainer.classList.add('hidden');
    con.classList.remove('hidden');
    await loadVillages(list, showResourcesForVillage);
  } catch (err) {
    error.textContent = err.message || 'Błąd logowania';
  }
});

if (isLoggedIn()) {
  formContainer.classList.add('hidden');
  con.classList.remove('hidden');
  loadVillages(list, showResourcesForVillage);
} else {
  formContainer.classList.remove('hidden');
}

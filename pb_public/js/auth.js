
import { pb } from './api.js';

export function isLoggedIn() {
  return pb.authStore.isValid && pb.authStore.model !== null;
}

export async function registerUser(email, password, passwordConfirm) {
  return await pb.collection('users').create({ email, password, passwordConfirm });
}

export async function loginUser(identity, password) {
  return await pb.collection('users').authWithPassword(identity, password);
}

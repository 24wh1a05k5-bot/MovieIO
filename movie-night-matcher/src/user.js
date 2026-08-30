export function getUserId() {
  let id = localStorage.getItem("mnm_user_id");
  if (!id) {
    id = "user-" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("mnm_user_id", id);
  }
  return id;
}

export function getUserName() {
  return localStorage.getItem("mnm_user_name") || "";
}

export function setUserName(name) {
  localStorage.setItem("mnm_user_name", name.trim().slice(0, 20));
}
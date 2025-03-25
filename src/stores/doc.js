import { computed, ref, } from 'vue'
import { defineStore } from 'pinia'




export const useDocStore = defineStore('doc', () => {
  const isloaded=ref(false);
  const text = ref();
  const currentUser = ref();
  const remoteUsers = ref(new Map());
  const remoteCursors = ref(new Map());
  function setText(data) {
    text.value = data;
  }
  function setCurrentUser(data) {
    currentUser.value = data;
  }
  function setRemoteUsers(data) {
    remoteUsers.value = data;
  }
  function setRemoteCursors(data) {
    remoteCursors.value = data;
  }
  function randomColor() {
    const color = Math.floor(Math.random() * 16777215).toString(16);
    return color;
  }
  function randomName() {
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Hannah', 'Ivy', 'Jack'];
    return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
  }
  function debounce(fn, delay) {
    let timer;
    return function () {
      if (timer)
        clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, delay);
    }
  }


  return {
    text,
    setText,
    currentUser,
    setCurrentUser,
    remoteUsers,
    setRemoteUsers,
    remoteCursors,
    setRemoteCursors,
    randomColor,
    randomName,
    debounce,
    isloaded,
  }
}

)
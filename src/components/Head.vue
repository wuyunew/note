<template>
  <div class="head" v-if="isloaded">
    <h1>协同文档编辑</h1>
    <div>
      <h2>当前用户:<span :style="{color:currentUser.color}">{{currentUser.name}}</span></h2>
    </div>
    <div>
      <h3>其他在线用户：</h3>
      <div v-for="user in remoteUsers":key="user.id">
       <span :style="{color: user.color}">{{ user.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDocStore } from '@/stores/doc';
import { computed} from 'vue';
const isloaded = computed(() => store.isloaded);
const store=useDocStore();
const currentUser=computed(()=>{
  return store.currentUser;
})
const remoteUsers=computed(()=>{
  return Array.from(store.remoteUsers, ([id, user]) => ({ id, ...user }));
})


</script>

<style scoped>

</style>

<script setup>
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { onMounted, onUnmounted, ref } from 'vue';
import { useDocStore } from '@/stores/doc';
import { WebsocketProvider } from 'y-websocket';
import { computed } from 'vue';

const store = useDocStore();
const text = computed(() => store.text) // 实际在textarea中的内容
const setText = store.setText;
const setCurrentUser = store.setCurrentUser;
const setRemoteUsers = store.setRemoteUsers;
const setRemoteCursors = store.setRemoteCursors;
const remoteCursors = computed(() =>{
    return Array.from(store.remoteCursors.values());
});

const ydoc = new Y.Doc();
const yText = ref();
// create a websocket provider,相当于第一个provider
const provider = new WebsocketProvider('ws://localhost:1234', 'doc', ydoc);
// create a y-indexeddb persistence provider,相当于第二个provider（备用)
const persistence = new IndexeddbPersistence('doc', ydoc);
provider.awareness.setLocalStateField('user', {
    name: store.randomName(),
    color: '#' + store.randomColor(),
});

// yjs数据同步到实际文本
const updateHandler = () => {
    setText(yText.value?.toString() || "");
}

// 鼠标移动事件处理
const updateCursor = (e) => {
    provider.awareness.setLocalStateField('cursor', {
        x: e.clientX,
        y: e.clientY,
    });
}

onMounted(() => {
    // 初始化
    yText.value = ydoc.getText('shared-text');
    setCurrentUser(provider.awareness.getLocalState()?.user);
    // 从本地同步数据
    persistence.whenSynced.then(() => {
        setText(yText.value.toString())
    })
    // 监听Yjs更新，同步到文本中
    ydoc.on("update", updateHandler);
    // 监听用户状态变更，获取在线用户列表和光标位置
    provider.awareness.on("change", () => {
        const status = provider.awareness.getStates();
        const users = new Map();
        const cursors = new Map();
        // 获取在线其他用户信息
        for (const [key, value] of status) {
            if (key !== provider.awareness.clientID) {
                users.set(key, value.user);
                cursors.set(key, value.cursor)
            }

        }
        setRemoteUsers(users);
        setRemoteCursors(cursors);
    })
    // 监听鼠标移动事件
    document.addEventListener('mousemove', updateCursor)
    store.isloaded = true;
});

// 处理框内文本
const debounce = store.debounce;
const debouncedHandleChange = debounce((event) => {
    const newText = event.target.value;
    const cursorIndex = event.target.selectionStart ?? 0;
    if (yText.value) {
        yText.value.delete(0, yText.value.length);
        yText.value.insert(cursorIndex, newText);
    }
}, 1000);

const handleChange = (event) => {
    debouncedHandleChange(event);
    setText(event.target.value);
}
onUnmounted(() => {
    ydoc.off("update", updateHandler);
    provider.disconnect();
    document.removeEventListener('mousemove', updateCursor);
});
</script>

<template>
    <textarea rows="45" cols="75" @input="handleChange" :value="text"></textarea>
    <div v-for="(cursor, clientId) in remoteCursors" 
    :key="clientId"
    :style="{position:'absolute',
        left: cursor.x + 'px',
        top: cursor.y + 'px',
        width: '36px',
        height: '36px',
        backgroundColor: 'red',
        borderRadius: '50%',
    }">
    </div>
</template>

<style scoped></style>
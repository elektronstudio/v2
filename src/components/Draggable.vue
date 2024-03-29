<script setup>
import { defineProps, defineEmits, ref, watch, computed } from "vue";
import { useMouse } from "../lib";

const props = defineProps({ x: { default: null }, y: { default: null } });
const emit = defineEmits();

const draggableRef = ref(0);

const x = ref(0);
const y = ref(0);

watch(
  [() => props.x, () => props.y],
  () => {
    x.value = props.x;
    y.value = props.y;
  },
  { immediate: true }
);

const { mouseX, mouseY } = useMouse();

const dragStarted = ref(false);
const touchDragStarted = ref(false);

const offsetX = ref(null);
const offsetY = ref(null);

const initialX = ref(null);
const initialY = ref(null);

const onMousedown = () => {
  dragStarted.value = true;
  offsetX.value = mouseX.value - draggableRef.value.offsetLeft;
  offsetY.value = mouseY.value - draggableRef.value.offsetTop;
  initialX.value = mouseX.value;
  initialY.value = mouseY.value;
};

const onMouseup = () => {
  dragStarted.value = false;
  offsetX.value = null;
  offsetY.value = null;
  if (
    initialX.value - mouseX.value === 0 &&
    initialY.value - mouseY.value === 0
  ) {
    emit("dragClick", { x: mouseX.value, y: mouseY.value });
  }
};

const onTouchstart = (e) => {
  dragStarted.value = true;
  offsetX.value = e.changedTouches[0].pageX - draggableRef.value.offsetLeft;
  offsetY.value = e.changedTouches[0].pageY - draggableRef.value.offsetTop;
};

const onTouchend = (e) => {
  dragStarted.value = false;
  offsetX.value = null;
  offsetY.value = null;
  if (!touchDragStarted.value) {
    emit("dragClick", {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY,
    });
  }
  touchDragStarted.value = false;
};

watch([() => mouseX.value, () => mouseY.value], () => {
  if (dragStarted.value) {
    touchDragStarted.value = true;
    const dragX = mouseX.value - offsetX.value;
    const dragY = mouseY.value - offsetY.value;
    x.value = dragX;
    y.value = dragY;
    emit("drag", { x: dragX, y: dragY });
  }
});

const style = computed(() => {
  return {
    position: "fixed",
    left: `${x.value}px`,
    top: `${y.value}px`,
    cursor: dragStarted.value ? "grabbing" : "grab",
  };
});
</script>

<template>
  <div
    ref="draggableRef"
    :style="style"
    @mousedown.stop.prevent="onMousedown"
    @touchstart.stop.prevent="onTouchstart"
    @mouseup.stop.prevent="onMouseup"
    @touchend.stop.prevent="onTouchend"
  >
    <slot />
  </div>
</template>

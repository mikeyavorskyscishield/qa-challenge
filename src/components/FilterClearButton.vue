<template>
  <button
    type="button"
    class="clear-button"
    :id="id"
    aria-label="Clear"
    @click="($e) => $emit('click', $e)"
  ></button>
</template>

<script>
import closeUrl from "./close.svg";

export default {
  name: "FilterClearButton",
  props: {
    id: { type: String, default: `${Math.random()}` },
  },
  onMounted() {
    const bg = `url("${closeUrl}")`;
    console.log({ bg });
    document.getElementById(this.id).style.background = bg;
  },
};
</script>

<style scoped>
.clear-button {
  appearance: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  background-color: white;
  height: 1rem;
  width: 1rem;
  background-size: cover;
}

.clear-button:focus {
  outline: 0.125rem solid var(--blue-500, navy);
  outline-offset: 0.125rem;
}
</style>

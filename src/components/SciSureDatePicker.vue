<template>
  <div class="scisure-datepicker">
    <v-date-picker
      ref="datePicker"
      v-model="localRecordDate"
      :is-required="isRequired"
      :class="className"
      :min-date="minDate"
      :max-date="maxDate"
      :model-config="modelConfig"
      :masks="masks"
      timezone="utc"
      :key="datePickerKey"
    >
      <template #default="{ inputValue, inputEvents }">
        <label v-if="label" :for="inputValueId">{{ label }}</label>
        <div class="input-wrapper">
          <input
            :value="inputValue"
            v-on="inputEvents"
            :id="inputValueId"
            :name="inputValueId"
          />
          <template v-if="useClearButton">
            <FilterClearButton v-if="localRecordDate" @click="clearInput" />
          </template>
        </div>
      </template>
    </v-date-picker>
  </div>
</template>

<script>
import FilterClearButton from "./FilterClearButton.vue";

export default {
  name: "SciSureDatePicker",
  data() {
    return {
      localRecordDate: this.recordDate,
      modelConfig: {
        type: "date",
        format: "YYYY-MM-DD",
      },
      masks: {
        input: "YYYY-MM-DD",
      },
      maxDate: this.isMaxDate ? this.todayEnd() : null,
      datePickerKey: 0, // Key to force re-render if needed
    };
  },
  components: {
    FilterClearButton,
  },
  props: {
    recordDate: {
      type: [String, Date],
      default: "",
    },
    className: {
      type: String,
      default: "date-picker-wrapper",
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    minDate: {
      type: Date,
      default: null,
    },
    isMaxDate: {
      type: Boolean,
      default: false,
    },
    payloadType: {
      type: String,
      default: "date",
    },
    dateBetween: {
      type: Boolean,
      default: false,
    },
    useClearButton: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: "",
    },
    forceVisualClear: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    localRecordDate(newVal) {
      let emitVal = newVal;
      if (this.payloadType === "string" && newVal) {
        emitVal = this.dateWithoutTime(newVal);
      }
      // Normalize both for comparison
      let currentVal = this.recordDate;
      if (this.payloadType === "string" && currentVal) {
        currentVal = this.dateWithoutTime(currentVal);
      }
      if (emitVal !== currentVal) {
        this.$emit("update:modelValue", emitVal);
      }
    },
    recordDate(newVal) {
      // Only update if different (normalize for comparison)
      let localVal = this.localRecordDate;

      if (this.payloadType === "string" && localVal) {
        localVal = this.dateWithoutTime(localVal);
      }
      let newValNorm = newVal;
      if (this.payloadType === "string" && newVal) {
        newValNorm = this.dateWithoutTime(newVal);
      }
      // Normalize nullish values to an empty string or null, so they match types
      if (!newValNorm) newValNorm = null;
      if (!localVal) localVal = null;
      if (localVal !== newValNorm) {
        this.localRecordDate = newVal;
      }
    },
  },
  computed: {
    inputValueId() {
      return this.className + "-input-date";
    },
  },
  methods: {
    dateWithoutTime(date) {
      if (!date) return "";
      // If already a string in YYYY-MM-DD, return as is
      if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      // Parse as local date, not UTC, to avoid timezone shifts
      const d =
        typeof date === "string"
          ? new Date(date + "T23:59:59")
          : new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    todayEnd() {
      const now = new Date();
      // Get today's date in UTC
      const year = now.getUTCFullYear();
      const month = now.getUTCMonth();
      const day = now.getUTCDate();
      // Set to end of today in UTC
      return new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
    },
    clearInput() {
      this.localRecordDate = null;
      this.$emit("update-record-date", this.localRecordDate);
      this.$nextTick(() => {
        // Remount the <v-date-picker> so all internal state is cleared
        this.datePickerKey += 1;
      });
    },
  },
};
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.scisure-datepicker label {
  font-weight: bold;
}
</style>

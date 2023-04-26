<template>
  <v-container grid-list-md text-xs-center>
    <v-row >
      <v-col>
        <v-card>
          <v-card-title>
          <h4 class="text-xs-left"> {{ $t('message.settings_sync_title') }}</h4>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="v, k, i in syncModes">
                <v-list-item-title>{{ synctexts[i].text }}</v-list-item-title>
                <v-radio-group inline v-model="syncModes[k]">
                  <v-radio :label="$t('message.settings_sync_disabled')" value="n"></v-radio>
                  <v-radio :label="$t('message.settings_sync_upstream')" value="u"></v-radio>
                  <v-radio :label="$t('message.settings_sync_downstream')" value="d"></v-radio>
                  <v-radio :label="$t('message.settings_sync_bidirectional')" value="b"></v-radio>
                </v-radio-group>
              </v-list-item>
            </v-list>
            <v-text-field 
              v-model="syncPeriod"
              @update:modelValue="{$emit('update:syncPeriod', syncPeriod); v$.syncPeriod.$touch()}"
              v-bind:label="$t('message.settings_sync_period')"
              v-bind:error-messages="v$.syncPeriod.$error == true ? $t('message.validation_settings_sync_period') : ''"></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
          <h4 class="text-xs-left"> {{ $t('message.settings_sync_status') }}</h4>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="v, k, i in syncModes">
                <v-list-item-title><v-icon icon="mdi-check"></v-icon> {{ synctexts[i].text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="sync()" icon="mdi-cached"></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">

import useVuelidate from '@vuelidate/core';
import {
  required, integer, minValue, maxValue
} from '@vuelidate/validators';

export default {
  components: {
  },
  props: ['syncModesInit', 'syncPeriodInit'],
  emits: ['update:syncModes', 'update:syncPeriod'],
  name: 'Sync',
  setup() {
    return {
      v$: useVuelidate(),
      synctexts: [
        { text: "Activities" },
        { text: "Programs" },
        { text: "Setting" },
      ]
    }
  },
  mounted() {
  },
  methods: {
    sync() {
        console.log("sync called");
        //accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkNaMVFtVGM1WGZIV2NfQ1dPVG9kcm1QaXZFNFJ2ckFXaFZ3T28yTm85eDAifQ.eyJpc3MiOiJDb2RlckJvdCBDbG91ZCBBUEkiLCJpYXQiOjE2Nzc3MDI4NjIsImV4cCI6MTcwOTIzODg2MiwiYXVkIjoic3QtYXBpLmNvZGVyYm90Lm9yZyIsInN1YiI6ImNvZGVyQGJvdHMuY29kZXJib3Qub3JnIiwiZW1haWwiOiJjb2RlckBib3RzLmNvZGVyYm90Lm9yZyIsInBpY3R1cmUiOiJodHRwczovL3N0LWFwcC5jb2RlcmJvdC5vcmcvcGljdHVyZXMvbm9waWMifQ.UqTs46YmcIyHN13DpqVZjpHgFtDepHO87OKx3uTYQkTpm5Dwx-mw259O39kJ-nDFfHhU8zs37fyZ0AiXDHPQUrrfMHYeUdnznyBF7VGCeWNR0Izebw0dz_RpgdSO0O8BsbqMUuUofoao7g4dDou5mkqWO8bIIgs0SY35LmyIB9yEuSV5ilvz_wakz8rAXD8dSfdrBg31K9QMh05vbyA9Fc8JYvhGFUJi048QEYD8u-jeGQZqrcc8K5gFEW4MuBsv16drTcmrmO7FMy2x_klCeI8PxftG8mhTP3vtST8uFUdnDiaZNJo6YJkGpyBfC5W3rjVlAVF_hlWSHtqgvJKbMA",
    },
  },
  data() {
    return {
      syncModes: this.syncModesInit,
      syncPeriod: this.syncPeriodInit,
    };
  },
  validations() {
    return {
      syncPeriod: {
        required,
        integer,
        minValue: minValue(10),
        maxValue: maxValue(300),
      },
    };
  }
};
</script>

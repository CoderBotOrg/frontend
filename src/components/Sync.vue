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
            {{ sync_status }}
          </v-card-text>
          <v-card-actions>
            <v-btn @click="sync()" icon="mdi-cached"></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
          <h4 class="text-xs-left"> {{ $t('message.settings_registration_status') }}</h4>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-if="regStatus==null">
                <v-list-item-title>
                  <v-text-field v-model="regOtp" prepend-icon="mdi-key"
                  @update:modelValue="{$emit('update:regOtp', regOtp); v$.regOtp.$touch()}"
                  ></v-text-field>
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="regStatus=='registered'">
                <v-list-item-title><v-icon icon="mdi-check"></v-icon> {{ org.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="regStatus==null" @click="register()" prepend-icon="mdi-cloud-check">Register</v-btn>
            <v-btn v-if="regStatus=='registered'" @click="unregister()" icon="mdi-cloud-off">Reset registration</v-btn>
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
import { LOGIC_NULL } from 'blockly/msg/msg';

import { defineComponent } from 'vue';

export default defineComponent({
  components: {
  },
  props: ['syncModesInit', 'syncPeriodInit', 'regOtpInit', 'regStatusInit'],
  emits: ['update:syncModes', 'update:syncPeriod', 'update:regOtp', 'update:regStatus'],
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
    this.sync_status_handler = setInterval(() => {this.syncStatus()}, 1000);
  },
  unmounted() {
    clearInterval(this.sync_status_handler);
  },
  methods: {
    sync() {
        console.log("sync called");
        this.$coderbot.cloudSyncRequest()
          .then(() => {
            console.log("ok")
        });
    },
    syncStatus() {
      console.log("sync status");
        this.$coderbot.cloudSyncStatus()
          .then((response) => {
            this.sync_status = response.data;
            console.log(this.sync_status)
        });
    },
    register() {
    },
    unregister() {
    }
  },
  data() {
    return {
      syncModes: this.syncModesInit,
      syncPeriod: this.syncPeriodInit,
      regOtp: this.regOtpInit,
      regStatus: this.regStatusInit,
      org: {
        name: null,
        description: null,
      },
      sync_status: {},
      sync_status_handler: null,
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
      regOtp: {
      },
      regStatus: {
      },
    };
  }
});
</script>

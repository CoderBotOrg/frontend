<template>
  <v-container grid-list-md text-xs-center>
    <v-row>
      <v-col>
        <v-card v-if="!regStatus.registered">
          <v-card-title>
          <h4 class="text-xs-left"> {{ $t('message.settings_registration_status') }}</h4>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <v-text-field v-model="regOtp" prepend-icon="mdi-key"
                  @update:modelValue="{$emit('update:regOtp', regOtp); v$.regOtp.$touch()}"
                  ></v-text-field>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <v-text-field v-model="regName"
                  @update:modelValue="{$emit('update:regOtp', regName); v$.regName.$touch()}"
                  ></v-text-field>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <v-text-field v-model="regDescription"
                  @update:modelValue="{$emit('update:regDescription', regName); v$.regDescription.$touch()}"
                  ></v-text-field>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="register()" prepend-icon="mdi-cloud-sync">Register</v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-if="regStatus.registered">
          <v-card-title>
          <h4 class="text-xs-left"> {{ $t('message.settings_registration_status') }}</h4>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <v-icon icon="mdi-cloud-check"></v-icon> Registered
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <v-text-field v-model="regStatus.name" label="Name" readonly></v-text-field>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <v-text-field v-model="regStatus.description" label="Description" readonly></v-text-field>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <v-text-field v-model="regStatus.org_name" label="Organization" readonly></v-text-field>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="unregister()" prepend-icon="mdi-cloud-off-outline">Reset registration</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="regStatus.registered">
      <v-col>
        <v-card>
          <v-card-title>
          <h4 class="text-xs-left"> {{ $t('message.settings_sync_title') }}</h4>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="v, k, i in syncModes">
                <v-list-item-title>{{ syncItemsTexts[k] }}</v-list-item-title>
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
              <v-list-item v-for="v, k in syncItemsTexts">
                <v-list-item-title><v-icon :icon="syncItemsIcons[sync_status[k]]"></v-icon>{{ syncItemsTexts[k] }}</v-list-item-title>
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

import { defineComponent } from 'vue';

export default defineComponent({
  components: {
  },
  props: ['syncModesInit', 'syncPeriodInit', 'regStatusInit'],
  emits: ['update:syncModes', 'update:syncPeriod', 'update:regStatus'],
  name: 'Sync',
  setup() {
    return {
      v$: useVuelidate(),
      syncItemsTexts: { 
        activities: "Activities",
        programs: "Programs",
        settings: "Settings",
      },
      syncItemsIcons: {
        'syncing': 'mdi-sync',
        'synced': 'mdi-check-circle-outline',
        'failed': 'mdi-sync-alert',
      },
      registrationIcons: {
        'missing_data': 'mdi-checkbox-blank-circle-outline',
        'registering': 'mdi-sync',
        'failed': 'mdi-sync-alert',
        'registered': 'mdi-check-circle-outline',
      },
    };
  },
  mounted() {
    this.sync_status_handler = setInterval(() => {this.syncStatus()}, 1000);
    this.registrationStatus();
  },
  unmounted() {
    clearInterval(this.sync_status_handler);
  },
  methods: {
    sync() {
        this.$coderbot.cloudSyncRequest()
          .then(() => {
            console.log("ok")
        });
    },
    syncStatus() {
        this.$coderbot.cloudSyncStatus()
          .then((response) => {
            this.sync_status = response.data;
            console.log(this.sync_status)
        });
    },
    register() {
      let registration_request = {
        otp: this.regOtp,
        name: this.regName,
        description: this.regDescription,
      };
      this.$coderbot.cloudRegistrationRequest(registration_request)
          .then(() => {
            console.log("ok")
        });
    },
    unregister() {
      this.$coderbot.cloudRegistrationRemove()
          .then(() => {
            console.log("ok")
        });
    },
    registrationStatus() {
      console.log("registration status");
        this.$coderbot.cloudRegistrationStatus()
          .then((response) => {
            this.regStatus = response.data;
            console.log(this.regStatus)
        });
    },
  },
  data() {
    return {
      syncModes: this.syncModesInit,
      syncPeriod: this.syncPeriodInit,
      regOtp: null,
      regName: null,
      regDescription: null,
      regStatus: {},
      org: {
        name: null,
        description: null,
      },
      sync_status: {} as any,
      sync_status_handler: null as any,
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
    };
  }
});
</script>

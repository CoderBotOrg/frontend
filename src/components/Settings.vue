<template>
	<div>
		<v-app id="inspire">
			<sidebar></sidebar>
			<v-app-bar color="indigo" dark fixed app>
				<v-app-bar-nav-icon @click.stop="toggleSidebar()"></v-app-bar-nav-icon>
				<v-app-bar-title>Impostazioni</v-app-bar-title>
				<v-spacer></v-spacer>
        <template v-if="status == 200">
          <v-btn text @click="save">
            <v-icon>save</v-icon>
            Salva
          </v-btn>
        </template>
        <template v-else>
          <v-btn text>
            <v-progress-circular :size="30" :width="2" indeterminate></v-progress-circular>
          </v-btn>
        </template>
				<v-tabs slot="extension" v-model="tab" centered slider-color="white">
					<v-tab v-for="item in tabs" :key="item">
						{{ item }}
					</v-tab>
				</v-tabs>
			</v-app-bar>
			<v-main>
				<!--<template v-if="status == 200">-->
					<v-tabs-items v-model="tab">
						<v-tab-item>
							<v-container grid-list-md text-xs-center>
								<v-layout row wrap>
									<!-- Column A -->
									<v-flex xs12 md6 offset-md3>
										<h3 class="text-xs-left">Sistema </h3>
										<v-card>
											<div class="cardContent">
												<v-select v-model="settings.progLevel" :items="blocklyToolboxItems" label="Livello Toolbox Blockly"></v-select>
												<!--<v-text-field v-model="settings.cbName" label="Nome CoderBot"></v-text-field>
												<br>-->
												<div v-for="(value, key) in cb.info" :key="key">
													{{ key }}: <code>{{ value }}</code>
												</div>
												Vue app commit build: <code> {{ lastCommit }} </code>
											</div>
										</v-card>
										<br>
										<h3 class="text-xs-left">Stato </h3>
										<v-card>
											<div class="cardContent">
												<div v-for="(value, key) in cb.status" :key="key">
													<div v-if="key != 'log'">
														{{ key }}: <code>{{ value }}</code>
													</div>
												</div>
												<br>
											</div>
										</v-card>
										<br>
										<h3 class="text-xs-left"> Azioni </h3>
										<v-card>
											<div class="cardContent text-xs-center">
												<v-btn @click="shutdown" color="info">
													<v-icon>fas fa-power-off</v-icon> Spegni
												</v-btn>
												<v-btn @click="reboot" color="info">
													<v-icon>fas fa-redo</v-icon> Riavvia
												</v-btn>
												<v-btn @click="restoreConfig" color="warning">
													<v-icon>fas fa-redo</v-icon> Ripristina Impostazioni
												</v-btn>
												<!-- ** Restore button + dialog box** -->
                        <v-dialog v-model="dialog" width="500">
                          <!-- eslint-disable-next-line vue/no-unused-vars -->
                          <template v-slot:activator="data">
                            <v-btn slot="activator" color="error" dark>
                              <v-icon>fas fa-wrench</v-icon> Ripristina ad impostazioni di fabbrica
                            </v-btn>
                            <v-card>
                              <v-card-title class="headline grey lighten-2" primary-title>
                                <h3>CoderBot - Restore</h3>
                              </v-card-title>
                              <v-card-text>
                                Sei sicuro di voler ripristinare il CoderBot?
                                <br>
                                <h3><b>Tutti i file salvati verranno cancellati</b></h3>
                              </v-card-text>
                              <v-divider></v-divider>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="dialog = false">
                                  Esci
                                </v-btn>
                                <v-btn color="error" @click="restore">
                                  <b>Ripristina</b>
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </template>
                        </v-dialog>
												<!-- Logs -->
                        <v-dialog v-model="dialog_logs" width="700">
                          <!-- eslint-disable-next-line vue/no-unused-vars -->
                          <template v-slot:activator="data">
                            <v-btn slot="activator" color="warning" dark>
                              <v-icon>fas fa-file-signature</v-icon> Show logs
                            </v-btn>
                            <v-card>
                              <v-card-title class="headline grey lighten-2" primary-title>
                                <h3>CoderBot - Logs</h3>
                              </v-card-title>
                              <div class="cardContent">
                                <div v-for="value, key in cb.logs.log" :key="key">
                                  {{ value }}
                                </div>
                              </div>
                              <v-divider></v-divider>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="dialog_logs = false">
                                  Esci
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                        </template>
                          </v-dialog>
												<!--
												<v-btn color="warning">Aggiorna</v-btn>
												<v-btn color="error">Ripristina ad Impostazioni di fabbrica</v-btn> -->
											</div>
										</v-card>
										<br>
										<h3 class="text-xs-left"> Aggiornamento </h3>
										<v-card>
											<div class="cardContent">
												<template v-if="updateStatus==1">
													Caricamento del file:
													<h3>{{ counter }} %</h3>
													<br>
													{{ updateStatusText }}
												</template>
												<template v-if="updateStatus==2">
												</template>
												<template v-if="updateStatus==0">
													<v-text-field label="Seleziona il pacchetto di aggiornamento" @click='pickFile' v-model='fileName' prepend-icon='attach_file'></v-text-field>
													<input type="file" style="display: none" ref="file" @change="onFilePicked">
													<template v-if="this.fileObj">CoderBot verrà riavviato per applicare l'aggiornamento.<br></template>
													<v-btn v-if="this.fileObj" @click="upload" color="error">Conferma</v-btn>
												</template>
											</div>
										</v-card>
										<br><br>
									</v-flex>
								</v-layout>
							</v-container>
						</v-tab-item>
						<v-tab-item>
							<v-container grid-list-md text-xs-center>
								<v-layout row wrap>
									<!-- Column A -->
									<v-flex xs12 md6 offset-md3>
										<h3 class="text-xs-left">In modalità controllo</h3>
										<v-card>
											<div class="cardContent">
												<v-text-field v-model="settings.ctrlFwdSpeed" label="Forward speed" />
												<v-text-field v-model="settings.ctrlFwdElapse" label="Forward elapse / distance" />
												<v-text-field v-model="settings.ctrlTurnSpeed" label="Turn speed" />
												<v-text-field v-model="settings.ctrlTurnElapse" label="Turn elapse / angle" />
											</div>
										</v-card>
										<br><br>
										<h3 class="text-xs-left">In modalità programmazione</h3>
										<v-card>
											<div class="cardContent">
												<v-text-field v-model="settings.moveFwdSpeed" label="Forward speed" />
												<v-text-field v-model="settings.moveFwdElapse" label="Forward elapse / distance" />
												<v-text-field v-model="settings.moveTurnSpeed" label="Turn speed" />
												<v-text-field v-model="settings.moveTurnElapse" label="Turn elapse / angle" />
											</div>
										</v-card>
										<br><br>
										<h3 class="text-xs-left">Parametri Motori</h3>
										<v-card>
											<div class="cardContent">
												<v-text-field v-model="settings.motorMode" label="Motor control mode" />
												<v-text-field v-model="settings.trimFactor" label="Trim factor (1.0 = center)" />
												<v-text-field v-model="settings.power[0]" label="Power (target angle -15)" />
												<v-text-field v-model="settings.power[1]" label="Power (target angle -4)" />
												<v-text-field v-model="settings.power[2]" label="Power (target angle -1)" />
											</div>
										</v-card>
									</v-flex>
								</v-layout>
							</v-container>
						</v-tab-item>
						<v-tab-item>
							<v-container grid-list-md text-xs-center>
								<v-layout row wrap>
									<!-- Column A -->
									<v-flex xs12 md6 offset-md3>
										<h3 class="text-xs-left">Suoni personalizzati</h3>
										<v-card>
											<div class="cardContent">
												<v-text-field v-model="settings.startSound" label="Avvio" />
												<v-text-field v-model="settings.stopSound" label="Stop" />
												<v-text-field v-model="settings.shutterSound" label="Otturatore" />
											</div>
										</v-card>
									</v-flex>
								</v-layout>
							</v-container>
						</v-tab-item>
						<v-tab-item>
							<v-container grid-list-md text-xs-center>
								<v-layout row wrap>
									<!-- Column A -->
									<v-flex xs12 md6 offset-md3>
										<h3 class="text-xs-left">Funzione pulsante fisico</h3>
										<v-card>
											<div class="cardContent">
												<v-radio-group v-model="settings.btnFun" column>
													<v-radio label="Nessuno" value="none" />
													<v-radio label="Inizia/Interrompi programma corrente" value="startstop" />
												</v-radio-group>
											</div>
										</v-card>
										<br>
										<h3 class="text-xs-left">Carica all'avvio</h3>
										<v-card>
											<div class="cardContent">
												<v-text-field v-model="settings.startupProgram" label="Nome script" />
											</div>
										</v-card>
									</v-flex>
								</v-layout>
							</v-container>
						</v-tab-item>
						<v-tab-item>
							<v-container grid-list-md text-xs-center>
								<v-layout row wrap>
									<v-flex xs12 md6 offset-md3>
										<h3 class="text-xs-left">Configurazione di Rete</h3>
										<v-card>
											<div class="cardContent">
												<v-radio-group v-model="settings.wifiMode" column>
													<v-radio label="Connetti ad una rete WiFi già esistente (client)" value="client"></v-radio>
													<v-radio label="Lascia che CoderBot configuri la propria rete WiFi locale (ad-hoc)" value="ap"></v-radio>
                          <v-text-field v-model="settings.wifiSSID" label="SSID"></v-text-field>
                          <v-text-field v-model="settings.wifiPsw" label="Password"></v-text-field>
												</v-radio-group>
                        <v-card-actions>
                          <v-btn color="primary" @click.stop="dialog = true" block>Salva</v-btn>
                              <v-dialog v-model="dialog" max-width="290">
                                <v-card>
                                  <v-card-title class="text-h5">
                                    Attenzione!
                                  </v-card-title>
                                  <v-card-text>
                                    Questa operazione cambierà la configurazione di CoderBot che sarà poi riavviato.
                                  </v-card-text>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      color="secondary"
                                      @click="dialog = false"
                                    >
                                      Annulla
                                    </v-btn>
                                    <v-btn
                                      color="primary"
                                      @click="dialog = false; saveWifi"
                                    >
                                      Ok
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                        </v-card-actions>
											</div>
										</v-card>
									</v-flex>
								</v-layout>
							</v-container>
							<v-card-text>
							</v-card-text>
						</v-tab-item>
            <!-- TEST TAB -->
            <v-tab-item>
							<v-container grid-list-md text-xs-center>
								<v-layout row wrap align-center>
									<v-flex xs12 md6 offset-md3>
										<h3 class="text-xs-left">COMPONENTS TESTS</h3>
										<v-card>

											<div class="cardContent">
												<div id='test_array'>
                          <!-- SONAR -->
                          <v-layout row wrap justify-center>
                              <!-- switch -->
                              <v-flex xs12 offset-md2 md5>
                                  <v-switch label="Sonar" value="sonar" v-model="checkedTests" color="orange"></v-switch>
                              </v-flex>
                              <!-- button state -->
                              <v-flex xs12 md4>
                                  <span v-if="cb.logs.test != null && cb.logs.test.sonar != 0">
                                      <!-- passed -->
                                      <span v-if="cb.logs.test.sonar == 1">
                                          <v-btn @click="runTests" slot="activator" color="green" dark>
                                              <v-icon>fas fa-check</v-icon> Passed
                                          </v-btn>
                                      </span>
                                      <!-- failed -->
                                      <span v-else>
                                          <v-btn @click="runTests" slot="activator" color="red" dark>
                                              <v-icon>fas fa-times</v-icon> Failed
                                          </v-btn>
                                      </span>
                                  </span>
                                  <!-- not tested -->
                                  <span v-else>
                                      <v-btn @click="runTests" slot="activator" color="grey" dark>
                                          <v-icon>fas fa-question</v-icon> Not tested
                                      </v-btn>
                                  </span>
                              </v-flex>
                          </v-layout>
                                <!-- MOTORS -->
                                <v-layout row wrap justify-center>
                                    <!-- switch -->
                                    <v-flex xs12 offset-md2 md5>
                                        <v-switch label="Motors" value="motors" v-model="checkedTests" color="orange">
                                        </v-switch>
                                    </v-flex>
                                    <!-- button state -->
                                    <v-flex xs12 md4>
                                        <span v-if="cb.logs.test != null && cb.logs.test.motors != 0">
                                            <!-- passed -->
                                            <span v-if="cb.logs.test.motors== 1">
                                                <v-btn @click="runTests" slot="activator" color="green" dark>
                                                    <v-icon>fas fa-check</v-icon> Passed
                                                </v-btn>
                                            </span>
                                            <!-- failed -->
                                            <span v-else>
                                                <v-btn @click="runTests" slot="activator" color="red" dark>
                                                    <v-icon>fas fa-times</v-icon> Failed
                                                </v-btn>
                                            </span>
                                        </span>
                                        <!-- not tested -->
                                        <span v-else>
                                            <v-btn @click="runTests" slot="activator" color="grey" dark>
                                                <v-icon>fas fa-question</v-icon> Not tested
                                            </v-btn>
                                        </span>
                                    </v-flex>
                                </v-layout>

                                <!-- SPEAKER -->
                                <v-layout row wrap justify-center>
                                    <!-- switch -->
                                    <v-flex xs12 offset-md2 md5>
                                        <v-switch label="Speaker" value="speaker" v-model="checkedTests" color="orange">
                                        </v-switch>
                                    </v-flex>
                                    <!-- button state -->
                                    <v-flex xs12 md4>
                                        <span v-if="cb.logs.test != null && cb.logs.test.speaker != 0">
                                            <!-- passed -->
                                            <span v-if="cb.logs.test.speaker== 1">
                                                <v-btn @click="runTests" slot="activator" color="green" dark>
                                                    <v-icon>fas fa-check</v-icon> Passed
                                                </v-btn>
                                            </span>
                                            <!-- failed -->
                                            <span v-else>
                                                <v-btn @click="runTests" slot="activator" color="red" dark>
                                                    <v-icon>fas fa-times</v-icon> Failed
                                                </v-btn>
                                            </span>
                                        </span>
                                        <!-- not tested -->
                                        <span v-else>
                                            <v-btn @click="runTests" slot="activator" color="grey" dark>
                                                <v-icon>fas fa-question</v-icon> Not tested
                                            </v-btn>
                                        </span>
                                    </v-flex>
                                </v-layout>

                                <!-- OCR -->
                                <v-layout row wrap justify-center>
                                    <!-- switch -->
                                    <v-flex xs12 offset-md2 md5>
                                        <v-switch label="OCR" value="ocr" v-model="checkedTests" color="orange">
                                        </v-switch>
                                    </v-flex>
                                    <!-- button state -->
                                    <v-flex xs12 md4>
                                        <span v-if="cb.logs.test != null && cb.logs.test.ocr != 0">
                                            <!-- passed -->
                                            <span v-if="cb.logs.test.ocr== 1">
                                                <v-btn @click="runTests" slot="activator" color="green" dark>
                                                    <v-icon>fas fa-check</v-icon> Passed
                                                </v-btn>
                                            </span>
                                            <!-- failed -->
                                            <span v-else>
                                                <v-btn @click="runTests" slot="activator" color="red" dark>
                                                    <v-icon>fas fa-times</v-icon> Failed
                                                </v-btn>
                                            </span>
                                        </span>
                                        <!-- not tested -->
                                        <span v-else>
                                            <v-btn @click="runTests" slot="activator" color="grey" dark>
                                                <v-icon>fas fa-question</v-icon> Not tested
                                            </v-btn>
                                        </span>
                                    </v-flex>
                                </v-layout>

                                <!-- DEBUG
                                    <span>Checked names: {{ checkedTests }}</span>
                                -->
                            </div>
                            <br>
                            <v-card-actions>

                                <v-btn v-if="!cb.logs.runningTest"
                                        block
                                        @click="runTests"
                                        slot="activator"
                                        color="orange"
                                        dark>
                                    <v-icon>fas fa-running</v-icon> Run tests
                                </v-btn>
                                <v-btn v-else
                                        block
                                        disabled>
                                    <v-icon>fas fa-ellipsis-h</v-icon> Running tests...
                                </v-btn>
                                <!-- DEBUG
                                    Running test: {{ cb.logs.runningTest }}
                                -->
                            </v-card-actions>
                        </div>
                    </v-card>
									</v-flex>
								</v-layout>
							</v-container>
						</v-tab-item>

						<!-- AUDIO TAB -->
                        <v-tab-item>
							<v-container grid-list-md text-xs-center>
								<v-layout row wrap align-center>
									<v-flex xs12 md6 offset-md3>
										<h3 class="text-xs-left">Audio settings</h3>
										<v-card>
											<div class="cardContent">
												Volume:

												<v-text-field v-model="settings.audioLevel" label="Volume" />
											</div>
										</v-card>
									</v-flex>
								</v-layout>
							</v-container>
						</v-tab-item>

                <!-- PACKAGE MANAGER -->
                    <v-tab-item>
                        <v-container grid-list-md text-xs-center>
                            <v-layout row wrap align-center>
                                <v-flex xs12 md6 offset-md3>
                                    <h3 class="text-xs-left">Gestione Pacchetti</h3>
									<br>
                                    <h3 class="text-xs-left"> Pacchetti installati:</h3>
                                    <v-card v-for="pkgnames in settings.packagesInstalled" v-bind:key="pkgnames.key">
                                        <div class="cardContent">
                                    <li>   nome: <b>{{pkgnames[0][0]}}</b>  tipo: <b>{{pkgnames[1]}} </b><span  style="display: flex; justify-content: flex-end"><v-btn @click="deletePkg(pkgnames[0][1])" color="red" dark>
                                            <v-icon>fas fa-trash</v-icon> Rimuovi </v-btn></span>
                                            </li>
<!--
                                                <div v-for="pkgnames in settings.packagesInstalled">
                                              <ul>
                                             <li>   nome: {{pkgnames[0][0]}}  tipo: {{pkgnames[1]}} <span  style="display: flex; justify-content: flex-end"><v-btn @click="deletePkg(pkgnames[0][1])" color="red" dark>
                                                        <v-icon>fas fa-trash</v-icon> Rimuovi
                                            </v-btn></span>
                                            </li>
                                            </ul>
                                            </div>
-->
                                            </div>
                                    </v-card>
                                        <br>
										<h3 class="text-xs-left"> Aggiungi Pacchetto </h3>
										<v-card>
											<div class="cardContent">
												<template v-if="updateStatus==1">
													<b>Pacchetto installato</b>
													<br>
													{{ updateStatusText }}
													<v-btn @click="refresh" color="error">Aggiorna</v-btn>
												</template>
												<template v-if="updateStatus==2 || updateStatus==3">
													<b>Installazione fallita</b>
													<br>
													{{ updateStatusText }}
													<v-btn @click="refresh" color="error">Aggiorna</v-btn>
												</template>
												<template v-if="updateStatus==0">
													<v-text-field label="Seleziona il pacchetto da installare" @click='pickFile' v-model='fileName' prepend-icon='attach_file'></v-text-field>
													<input type="file" style="display: none" ref="file" @change="onFilePicked">
													<template v-if="this.fileObj">Clicca "CONFERMA" per installare il pacchetto<br></template>
													<v-btn v-if="this.fileObj" @click="uploadPackage" color="error">Conferma</v-btn>
												</template>
											</div>
                                        </v-card>
                                    </v-flex>
                                    </v-layout>
                                    </v-container>
                                    </v-tab-item>

					</v-tabs-items>
				<!--</template>
				<template v-else>
					<br>
					In attesa che CoderBot torni online...<br>
					<v-icon large>signal_wifi_off</v-icon>
				</template>-->
			</v-main>
			<!-- Notification Snackbar -->
			<v-snackbar v-model="snackbar">
				{{ snackText }}
				<v-btn color="pink" text @click="snackbar = false">
					Chiudi
				</v-btn>
			</v-snackbar>
		</v-app>
	</div>
</template>

<script>
import sidebar from '../components/Sidebar';
import * as music_package from '../assets/music_package.json';

const packageList = [];

Object.keys(music_package.packages).forEach((key) => {
  const names = [music_package.packages[key].name_IT, key];
  if (music_package.packages[key].category == 'instrument') {
    packageList[packageList.length] = [names, 'instrument'];
  } else if (music_package.packages[key].category == 'animal') {
    packageList[packageList.length] = [names, 'animal'];
  }
});

export default {
  components: { sidebar },
  name: 'Settings',
  mounted() {
    this.pollStatus();
    setInterval(() => {
      this.pollStatus();
    }, 1000);
    this.getInfoAndStatus();
    this.prepopulate();
  },
  methods: {
    pickFile() {
      this.$refs.file.click();
    },
    onFilePicked(e) {
      const { files } = e.target;
      this.fileName = files[0].name;
      this.fileObj = files[0];
      this.formdata = new FormData();
      this.formdata.append('file_to_upload', files[0], files[0].name);
    },

    uploadPackage() {
      /*
      const qs = this.$qs;
      const pkgName = qs.stringify({
        nameID: this.fileName,
      });
      */
      this.$axios.post(`${this.CB}/updatePackages`, this.formdata).then((result) => {
			    this.updateStatus = result.data;
        this.uploadCompleted = true;
        this.uploadInProgress = false;
        this.updateStatusText = 'Clicca "AGGIORNA" per visualizzare le modifiche.';
        console.dir(result.data);
        if (this.updateStatus == 2) {
          this.updateStatusText = 'Aggiornamento non avvenuto, il pacchetto è già presente con una versione successiva a quella che vuoi installare.';
        }
        if (this.updateStatus == 3) {
          this.updateStatusText = 'Aggiornamento non avvenuto, pacchetto già presente con stessa versione.';
        }
      });
    },

    upload() {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          this.counter = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
        },
      };
      this.updateStatus = 1;
      this.$axios.post(`${this.CB}/updateFromPackage`, this.formdata, config).then((result) => {
        this.uploadCompleted = true;
        this.uploadInProgress = false;
        console.dir(result.data);
        this.updateStatusText = 'Upload completato. Riavvio in corso.';
      });
    },

    refresh() {
      window.location.reload();
      /*    readTextFile
            this.packagesInstalled = packageList
            this.$http.get('vue/index.html#/settings').then((results) => {
                  console.log(results.data.data);
                  }, (results) => {
                      console.log('ERROR');
                      console.log(results);
                    });
*/
    },
    /*       readTextFile(file, callback) {
            var rawFile = new XMLHttpRequest();
            rawFile.overrideMimeType("application/json");
            rawFile.open("GET", file, true);
            rawFile.onreadystatechange = function() {
                if (rawFile.readyState === 4 && rawFile.status == "200") {
                    callback(rawFile.responseText);
                }
            }
            rawFile.send(null);
        },
*/
    restoreConfig() {
      const axios = this.$axios;
      const { CB } = this;
      axios.post(`${CB}/restoreSettings`)
        .then(() => {
          this.snackText = 'Impostazioni ripristinate';
          this.snackbar = true;
          this.prepopulate();
        });
    },
    runTests() {
      const axios = this.$axios;
      const { CB } = this;
      this.cb.logs.runningTest = true;
      axios.post(`${CB}/testCoderbot`, { params: this.checkedTests })
        .then((response) => {
          this.cb.logs.test = response.data;
          this.snackText = 'Running tests';
          this.snackbar = true;
          this.prepopulate();
          this.cb.logs.runningTest = false;
        });
    },
    restore() {
      const axios = this.$axios;
      const { CB } = this;
      axios.post(`${CB}/reset`)
        .then(() => {
          this.snackText = 'Ripristino ad impostazioni di fabbrica \
                                        Reboot in corso...';
          this.snackbar = true;
          this.prepopulate();
          setTimeout(() => this.dialog.close(), 5000);
          this.dialog = false;
        });
    },
    shutdown() {
      const axios = this.$axios;
      const { CBv1 } = this;
      axios.get(`${CBv1}/bot`, { params: { cmd: 'halt' } })
        .then(function success() {
          this.snackText = 'Coderbot in spegnimento..';
          this.snackbar = true;
        });
    },
    reboot() {
      const axios = this.$axios;
      const { CBv1 } = this;
      axios.get(`${CBv1}/bot`, { params: { cmd: 'reboot' } })
        .then(function success() {
          this.snackText = 'Riavvio iniziato...';
          this.snackbar = true;
        });
    },
    getInfoAndStatus() {
      // Get bot info and status
      const axios = this.$axios;
      axios.get(`${this.CB}/status`)
        .then((response) => {
          this.cb.status = response.data;
          this.cb.logs.log = response.data.log;
        });
      axios.get(`${this.CB}/info`)
        .then((response) => {
          this.cb.info = response.data;
        });
    },
    pollStatus() {
      const axios = this.$axios;
      const { CB } = this;
      axios.get(`${CB}/status`)
        .then((response) => {
          if (this.status == 0 && response.status) {
            this.snackText = 'CoderBot è tornato online';
            this.snackbar = true;
            this.getInfoAndStatus();
            this.prepopulate();
          }
          this.statusData = response.data;
          this.status = response.status;
          this.cb.logs.log = response.data.log;
        })
        .catch((error) => {
          // handle error
          console.log(error);
          if (this.status) {
            this.snackText = 'CoderBot irrangiungibile';
            this.snackbar = true;
          }
          this.status = 0;
        });
    },
    deletePkg(pkgNameID) {
      const { CBv1 } = this;
      const axios = this.$axios;
      const qs = this.$qs;
      const pkgName = qs.stringify({
        nameID: pkgNameID,
      });
      axios.post(`${CBv1}/deletepkg`, pkgName)
        .then(() => {
          console.log('Pacchetto rimosso');
          this.snackText = 'Pacchetto rimosso';
          this.snackbar = true;
          this.packagesInstalled = window.location.reload();
        });
    },
    prepopulate() {
      const axios = this.$axios;
      // Prepopulate settings
      axios.get(`${this.CBv1}/config`)
        .then((response) => {
          // handle success
          const data = this.settings;
          console.log(response.data);
          const remoteConfig = response.data;
          /*
					button_func: "none"
					camera_color_object_size_max: "160000"
					camera_color_object_size_min: "4000"
					camera_exposure_mode: "auto"
					camera_framerate: "30"
					camera_jpeg_bitrate: "1000000"
					camera_jpeg_quality: "5"
					camera_path_object_size_max: "160000"
					camera_path_object_size_min: "4000"
					cnn_default_model: ""
					ctrl_fw_elapse: "-1"
					ctrl_fw_speed: "99"
					ctrl_hud_image: ""
					ctrl_tr_elapse: "-1"
					ctrl_tr_speed: "80"
					cv_image_factor: "2"
					load_at_start: ""
					move_fw_elapse: "1"
					move_fw_speed: "100"
					move_motor_mode: "dc"
					move_motor_trim: "1"
					move_power_angle_1: "45"
					move_power_angle_2: "60"
					move_power_angle_3: "60"
					move_tr_elapse: "0.5"
					move_tr_speed: "85"
					prog_level: "adv"
					prog_maxblocks: "-1"
					prog_scrollbars: "true"
					show_control_move_commands: "true"
					show_page_control: "true"
					show_page_prefs: "true"
					show_page_program: "true"
					sound_shutter: "$shutter.mp3"
					sound_start: "$startup.mp3"
					sound_stop: "$shutdown.mp3"
					*/
          data.power = [remoteConfig.move_power_angle_1, remoteConfig.move_power_angle_2, remoteConfig.move_power_angle_3];
          data.btnFun = remoteConfig.button_func;
          data.wifiMode = remoteConfig.wifi_mode;
          data.wifiSSID = remoteConfig.wifi_ssid;
          data.wifiPsw = remoteConfig.wifi_psk;
          data.motorMode = remoteConfig.move_motor_mode;
          data.trimFactor = remoteConfig.move_motor_trim;
          data.startSound = remoteConfig.sound_start;
          data.stopSound = remoteConfig.sound_stop;
          data.shutterSound = remoteConfig.sound_shutter;
          data.startupProgram = remoteConfig.load_at_start;
          data.progLevel = remoteConfig.prog_level;
          data.moveFwdElapse = remoteConfig.move_fw_elapse;
          data.moveFwdSpeed = remoteConfig.move_fw_speed;
          data.moveTurnElapse = remoteConfig.move_tr_elapse;
          data.moveTurnSpeed = remoteConfig.move_tr_speed;
          data.ctrlFwdElapse = remoteConfig.ctrl_fw_elapse;
          data.ctrlFwdSpeed = remoteConfig.ctrl_fw_speed;
          data.ctrlTurnElapse = remoteConfig.ctrl_tr_elapse;
          data.ctrlTurnSpeed = remoteConfig.ctrl_tr_speed;
          data.audioLevel = remoteConfig.audio_volume_level;
          data.packagesInstalled = remoteConfig.packages_installed;
        });
    },
    save() {
      const qs = this.$qs;
      const selectedTab = this.tab;
      const axios = this.$axios;
      const { CBv1 } = this;
      const data = this.settings;
      if (selectedTab != 4) {
        const legacySettings = qs.stringify({
          wifi_mode: data.wifiMode,
          wifi_ssid: data.wifiSSID,
          wifi_psk: data.wifiPsw,
          move_power_angle_1: data.power[0],
          move_power_angle_2: data.power[1],
          move_power_angle_3: data.power[2],
          button_func: data.btnFun,
          move_motor_mode: data.motorMode,
          move_motor_trim: data.trimFactor,
          sound_start: data.startSound,
          sound_stop: data.stopSound,
          sound_shutter: data.shutterSound,
          load_at_start: data.startupProgram,
          prog_level: data.progLevel,
          move_fw_elapse: data.moveFwdElapse,
          move_fw_speed: data.moveFwdSpeed,
          move_tr_elapse: data.moveTurnElapse,
          move_tr_speed: data.moveTurnSpeed,
          ctrl_fw_elapse: data.ctrlFwdElapse,
          ctrl_fw_speed: data.ctrlFwdSpeed,
          ctrl_tr_elapse: data.ctrlTurnElapse,
          ctrl_tr_speed: data.ctrlTurnSpeed,
          audio_volume_level: data.audioLevel,
          packages_installed: data.packagesInstalled,
        });
        axios.post(`${CBv1}/config`, legacySettings)
          .then(() => {
            console.log('Updated settings');
            this.prepopulate();
            this.snackText = 'Impostazioni aggiornate';
            this.snackbar = true;
          });
      }
    },
    saveWifi() {
      const qs = this.$qs;
      const axios = this.$axios;
      const { CBv1 } = this;
      const valuesAsString = qs.stringify({
        wifi_mode: this.settings.wifiMode,
        wifi_ssid: this.settings.wifiSSID,
        wifi_psk: this.settings.wifiPsw,
      });
      // Send post with URL encoded parameters
      axios.post(`${CBv1}/wifi`, valuesAsString)
        .then(() => {
          console.log('Sent');
          this.snackText = 'Impostazioni di rete aggiornate';
          this.snackbar = true;
        });
      console.log(`save wifi config - ssid: ${this.settings.wifiSSID}  pwd: ${this.settings.wifiPsw}`);
    },
    toggleSidebar() {
      const currentStatus = this.$store.getters.drawerStatus;
      this.$store.commit('toggleDrawer', !currentStatus);
    },
  },
  data() {
    return {
      formdata: null,
      files: null,
      status: null,
      dialog: false,
      dialog_logs: false,
      lastCommit: process.env.lastCommit,
      CB: process.env.CB_ENDPOINT + process.env.APIv2,
      CBv1: process.env.CB_ENDPOINT,
      snackbar: null,
      snackText: null,
      fileName: '',
      fileObj: '',
      fileUrl: '',
      counter: 0,
      updateStatusText: '',
      checkedTests: [], // checked test array
      updateStatus: 0,
      // TODO: Prepopulate this
      settings: {

        cbName: 'CoderBot',
        power: [null, null, null],
        btnFun: null,
        wifiMode: 'ap',
        wifiSSID: null,
        wifiPsw: null,

        audioLevel: null,
        packagesInstalled: packageList,
        moveFwdElapse: null,
        moveFwdSpeed: null,
        moveTurnElapse: null,
        moveTurnSpeed: null,
        ctrlFwdElapse: null,
        ctrlFwdSpeed: null,
        ctrlTurnElapse: null,
        ctrlTurnSpeed: null,
        motorMode: null,
        trimFactor: null,
        startSound: null,
        stopSound: null,
        shutterSound: null,
        startupProgram: null,
        progLevel: null,
      },
      blocklyToolboxItems: [
        { text: 'Movimento', value: 'basic_move' },
        { text: 'Base', value: 'basic' },
        { text: 'Standard', value: 'std' },
        { text: 'Avanzate', value: 'adv' },
      ],
      cb: {
        info: {
          status: null,
          internetConnectivity: null,
          temp: null,
          uptime: null,
        },
        status: {
          model: null,
          serial: null,
          cbVersion: null,
          backendVersion: null,
          vueVersion: null,
          kernel: null,
          motors: null,
        },
        logs: {
          log: null,
          test: null,
          runningTest: false,
        },
      },
      drawer: null,
      tab: null,
      // tabs: ['Generali', 'Rete', 'Movimento', 'Suoni', 'Avanzate'],
      tabs: ['Generali', 'Movimento', 'Suoni', 'Avanzate', 'Wifi', 'Test', 'Audio', 'Gestione Pacchetti'],
    };
  },
};
</script>
<style scoped>
.cardContent {
	text-align: left;
	font-size: 16px;
	padding: 16px;
}
.fa,
.fas,
.fab {
	font-weight: 600;
	margin-right: 7px;
	text-size: 10px;
}
</style>

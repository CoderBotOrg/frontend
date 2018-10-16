<template>
	<div>
		<v-app id="inspire">
			<sidebar></sidebar>
			<v-toolbar color="indigo" dark fixed app>
				<v-toolbar-side-icon @click.stop="toggleSidebar()"></v-toolbar-side-icon>
				<v-toolbar-title>Impostazioni</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-toolbar-items>
					<v-btn flat>
						<v-icon>save</v-icon>
						Salva
					</v-btn>
				</v-toolbar-items>
				<v-tabs slot="extension" v-model="tab" centered color="transparent" slider-color="white">
					<v-tab v-for="item in tabs" :key="item">
						{{ item }}
					</v-tab>
				</v-tabs>
			</v-toolbar>
			<v-content>
				<v-tabs-items v-model="tab">
					<v-tab-item>
						<v-container grid-list-md text-xs-center>
							<v-layout row wrap>
								<!-- Column A -->
								<v-flex xs12 md6 offset-md3>
									<h3 class="text-xs-left">Sistema </h3>
									<v-card>
										<div class="cardContent">
											<v-text-field v-model="cbName" label="Nome CoderBot"></v-text-field>
											<br>
											<div v-for="(value, key, index) in cbInfo">
												{{ key }}: <code>{{ value }}</code>
											</div>
										</div>
									</v-card>
									<br>
									<h3 class="text-xs-left">Stato </h3>
									<v-card>
										<br>
										Robe
										<br>
										<br>
									</v-card>
									<br>
									<h3 class="text-xs-left"> Azioni </h3>
									<v-card>
										<div class="cardContent">
											<v-btn color="info">Spegni</v-btn>
											<v-btn color="info">Riavvia</v-btn>
											<v-btn color="warning">Aggiorna</v-btn>
											<v-btn color="error">Ripristina ad Impostazioni di fabbrica</v-btn>
										</div>
									</v-card>
									<br>

								</v-flex>
							</v-layout>
						</v-container>
					</v-tab-item>
					<v-tab-item>
						<v-container grid-list-md text-xs-center>
							<v-layout row wrap>
								<!-- Column A -->
								<v-flex xs12 md6 offset-md3>
									<h3 class="text-xs-left">Configurazione di Rete</h3>
									<v-card>
										<div class="cardContent">
											<v-radio-group v-model="wifiMode" column>
												<v-radio label="Connetti ad una rete WiFi già esistente (client)" value="wificlient"></v-radio>
												<v-radio label="Lascia che CoderBot configuri la propria rete WiFi locale (ad-hoc)" value="wifiadhoc"></v-radio>
												<div v-if="wifiMode == 'wificlient'">
													<v-text-field v-model="wifiSSID" label="SSID"></v-text-field>
													<v-text-field v-model="wifiPsw" label="Password"></v-text-field>
												</div>
												<div v-if="wifiMode =='wifiadhoc'"> SSID: <code> coderbot </code> Password: <code>coderb0t01 </code> </div>
											</v-radio-group>
										</div>
									</v-card>
								</v-flex>
							</v-layout>
						</v-container>
						<v-card-text>
						</v-card-text>
					</v-tab-item>
					<v-tab-item>
						Tab 3
					</v-tab-item>
					<v-tab-item>
						Tab 4
					</v-tab-item>
				</v-tabs-items>
			</v-content>
		</v-app>
	</div>
</template>
<script>
import sidebar from "../components/Sidebar"

export default {
	components: { sidebar },
	name: 'HelloWorld',
	methods: {
		toggleSidebar: function() {
			let currentStatus = this.$store.getters.drawerStatus
			this.$store.commit('toggleDrawer', !currentStatus)
		}
	},
	data() {
		return {
			cbName: 'CoderBot di Antonio',
			wifiMode: 'wifiadhoc',
			cbInfo: {
				'Modello': 'CDRBT-01-2017-1',
				'Seriale': '740129387591e',
				'Versione Software Base': '0.1',
				'Versione Backend': '0.3.1a',
				'Versione Web App': '0.1-prelease'
			},
			drawer: null,
			tab: null,
			tabs: ['Generali', 'Rete'],
		}
	}
}

</script>
<style scoped>
.cardContent {
	padding: 16px;
}

</style>

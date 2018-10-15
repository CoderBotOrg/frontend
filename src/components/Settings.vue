<template>
	<div>
		<v-app id="inspire">
			<v-navigation-drawer fixed v-model="drawer" app>
				<v-list dense>
					<v-list-tile>
						<v-list-tile-action>
							<v-icon>home</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>Home</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					Utente
					<v-list-tile>
						<v-list-tile-action>
							<v-icon>account_box</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>Luigi Beretta</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile>
						<v-list-tile-action>
							<v-icon>exit_to_app</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>Logout</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					Attività
					<v-list-tile>
						<v-list-tile-action>
							<v-icon>add</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>Nuova</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile>
						<v-list-tile-action>
							<v-icon>open_in_new</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>Apri</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile>
						<v-list-tile-action>
							<v-icon>close</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>Chiudi</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					Altro
					<v-list-tile>
						<v-list-tile-action>
							<v-icon>settings</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>Impostazioni</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-navigation-drawer>
			<v-toolbar color="indigo" dark fixed app>
				<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
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
						<br>
						<v-btn color="info">Spegni</v-btn>
						<v-btn color="info">Riavvia</v-btn>
						<v-btn color="warning">Aggiorna</v-btn>
						<br><br>
						<div v-for="(value, key, index) in cbInfo">
							{{ key }}: <code>{{ value }}</code>
						</div>
						<v-text-field v-model="cbName" label="Nome CoderBot"></v-text-field>
						<v-btn color="error">Ripristina ad Impostazioni di fabbrica</v-btn>
					</v-tab-item>
					<v-tab-item>
						<v-radio-group v-model="wifiMode" column>
							Configurazione di Rete
							<v-radio label="Connetti ad una rete WiFi già esistente (client)" value="wificlient"></v-radio>
							<v-radio label="Lascia che CoderBot configuri la propria rete WiFi locale (ad-hoc)" value="wifiadhoc"></v-radio>
							<div v-if="wifiMode == 'wificlient'">
								<v-text-field v-model="wifiSSID" label="SSID"></v-text-field>
								<v-text-field v-model="wifiPsw" label="Password"></v-text-field>
							</div>
							<div v-if="wifiMode =='wifiadhoc'"> SSID: <code> coderbot </code> Password: <code>coderb0t01 </code> </div>
						</v-radio-group>
					</v-tab-item>
					<v-tab-item>
						<wsFactory></wsFactory>
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
import wsFactory from '../components/wsFactory';

export default {
	name: 'HelloWorld',
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

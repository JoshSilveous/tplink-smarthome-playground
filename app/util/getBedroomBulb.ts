'use server'
import { Bulb, Client, Plug } from 'tplink-smarthome-api'
import { delay } from './delay'

const client = new Client()
const bedroomBulbId = '80128D211A5D3C1BFBB02F24891367DC221769F9'

let bedroomBulb: Bulb | undefined

client.startDiscovery().on('device-new', (device) => {
	if (device.id === bedroomBulbId) {
		bedroomBulb = device as Bulb
		console.log('Bulb registered to memory!')
		client.stopDiscovery()
	}
})

export async function getBedroomBulb(): Promise<Bulb> {
	return new Promise((res) => {
		const thisInterval = setInterval(() => {
			if (bedroomBulb) {
				clearInterval(thisInterval)
				res(bedroomBulb)
			} else {
				console.log('getBedroomBulb() called but device not found yet...')
			}
		}, 1000)
	})
}

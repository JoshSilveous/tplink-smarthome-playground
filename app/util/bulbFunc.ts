'use server'
import { LightStateInput } from 'tplink-smarthome-api'
import { getBedroomBulb } from './getBedroomBulb'

export async function getSrvLightState() {
	const device = await getBedroomBulb()

	const lightingInfo = await device.lighting.getLightState()
	return lightingInfo
}

export async function setColorTemp() {}
export async function setSrvLightState(lightState: LightStateInput) {
	const device = await getBedroomBulb()
	return device.lighting.setLightState(lightState)
}

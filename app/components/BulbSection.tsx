'use client'

import { useEffect, useState } from 'react'
import { getSrvLightState, setSrvLightState } from '../util/bulbFunc'
import { LightState } from 'tplink-smarthome-api'
import { ObjectTable } from './ObjectTable'
import { HSL, hexToHSL } from '../util/colorConvert'

export function BulbSection() {
	interface FormData {
		color_temp: number
		hue: number
		saturation: number
		brightness: number
	}
	const [formData, setFormData] = useState<FormData>({
		color_temp: 0,
		hue: 0,
		saturation: 0,
		brightness: 0,
	})
	const [waiting, setWaiting] = useState(true)
	const [clientLightState, setClientLightState] = useState<LightState>()

	// FIRST LOAD
	useEffect(() => {
		getSrvLightState().then((lightState) => {
			setClientLightState(lightState)
			setFormData({
				color_temp: lightState.color_temp!,
				hue: lightState.hue!,
				saturation: lightState.saturation!,
				brightness: lightState.brightness!,
			})
			setWaiting(false)
		})
	}, [])

	const [pendingChange, setPendingChange] = useState<FormData>()

	// ON FORM UPDATE
	useEffect(() => {
		console.log('formdata update:', formData)
		if (!waiting) {
			console.log('   not waiting, updating normally')
			setWaiting(true)
			setSrvLightState(formData).then(() => {
				setWaiting(false)
			})
		}
	}, [formData])

	// ON WAITING UPDATE
	useEffect(() => {
		// if not waiting anymore, check if server matches form. if not, update server

		if (!waiting) {
			checkSrvForMismatch()
		}
		async function checkSrvForMismatch() {
			const srvLightState = await getSrvLightState()
			if (
				srvLightState.color_temp !== formData.color_temp ||
				srvLightState.hue !== formData.hue ||
				srvLightState.saturation !== formData.saturation ||
				srvLightState.brightness !== formData.brightness
			) {
				// if mismatched
				console.log('mismatch found. updating now')
				setWaiting(true)
				setSrvLightState(formData).then(() => {
					setWaiting(false)
				})
			}
		}
	}, [waiting])

	function handleColorTempChange(e: React.ChangeEvent<HTMLInputElement>) {
		setFormData((prev) => ({
			...prev,
			color_temp: parseInt(e.target.value),
		}))
	}

	function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
		const hslVals = hexToHSL(e.target.value)
		setFormData((prev) => ({
			...prev,
			hue: hslVals.h,
			saturation: hslVals.s,
			brightness: hslVals.l,
		}))
	}

	return (
		<div>
			<h2>Bulb!</h2>
			<h3>Current Lighting Info:</h3>
			<p>{waiting ? 'waiting on change' : ''}</p>
			{!clientLightState ? (
				<div>loading...</div>
			) : (
				<>
					<ObjectTable data={clientLightState} />
					<br />
					<input
						type='range'
						min={0}
						max={3650}
						onChange={handleColorTempChange}
						defaultValue={formData!.color_temp}
					></input>
					{formData!.color_temp}
					<br />
					<br />
					<input type='color' onChange={handleColorChange}></input>
				</>
			)}
		</div>
	)
}

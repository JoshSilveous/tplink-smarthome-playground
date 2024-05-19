import Image from 'next/image'
import styles from './page.module.css'
import { BulbSection } from './components/BulbSection'

export default function Home() {
	return (
		<main className={styles.main}>
			<div>TPLink Smarthome Playground</div>
			<BulbSection />
		</main>
	)
}

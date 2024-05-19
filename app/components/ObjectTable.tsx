interface ObjectTableProps {
	data: Record<string, any>
}

export const ObjectTable: React.FC<ObjectTableProps> = ({ data }) => {
	if (!data || typeof data !== 'object') {
		return <p>Invalid data</p>
	}

	const keys = Object.keys(data)
	const values = Object.values(data)

	return (
		<table>
			<thead>
				<tr>
					<th>Property</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>
				{keys.map((key, index) => (
					<tr key={index}>
						<td>{key}</td>
						<td>
							{typeof values[index] === 'object'
								? JSON.stringify(values[index])
								: values[index]}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import marked from 'marked';
import _range from 'lodash/fp/range';
import _get from 'lodash/fp/get';

import Retro from './Retro';

interface ExportProps {
	match: { params: { retroId: string } };
}

export default function Export({
	match: {
		params: { retroId },
	},
}: ExportProps): JSX.Element | null {
	const [retro, setRetro] = useState();
	useEffect((): void => {
		async function getRetro(): Promise<void> {
			const retroSnapshot = await firebase
				.firestore()
				.doc(`retros/${retroId}`)
				.get();

			setRetro(retroSnapshot.data() as Retro);
		}

		getRetro();
	}, [retroId]);

	const rows = retro
		? Math.max(retro.start.length, retro.stop.length, retro.cont.length)
		: 0;

	return retro ? (
		<section className="section">
			<div className="container">
				<div className="content">
					<h1 className="title">{retroId}</h1>
					<table className="table">
						<thead>
							<tr>
								<th>Start</th>
								<th>Stop</th>
								<th>Continue</th>
							</tr>
						</thead>
						<tbody>
							{_range(0)(rows).map(
								(i): JSX.Element => (
									<tr key={i}>
										<td
											dangerouslySetInnerHTML={{
												__html: marked(_get(`start[${i}].item`)(retro) || ''),
											}}
										/>
										<td
											dangerouslySetInnerHTML={{
												__html: marked(_get(`stop[${i}].item`)(retro) || ''),
											}}
										/>
										<td
											dangerouslySetInnerHTML={{
												__html: marked(_get(`cont[${i}].item`)(retro) || ''),
											}}
										/>
									</tr>
								),
							)}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	) : null;
}
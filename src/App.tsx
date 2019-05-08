import React from 'react';

import RetroItemColumn from './RetroItemColumn';
import Column from './Column';

interface AppProps {
	loading: boolean;
	name: string;
	columns: RetroItemColumn[];
	retroId: string;
	setName: Function;
	setRetroId: Function;
	setLoadedRetroId: Function;
}

export default function App({
	loading,
	name,
	columns,
	retroId,
	setName,
	setRetroId,
	setLoadedRetroId,
}: AppProps): JSX.Element {
	return (
		<>
			<section className="section">
				<div className="container">
					<div className="level is-mobile">
						<div className="level-left">
							<div className="level-item">
								<h1 className="title">Better Retros</h1>
							</div>
						</div>
						<div className="level-right">
							<div className="level-item">
								<div className="field is-horizontal">
									<div className="field-label">
										<label htmlFor="name" className="label">
											Your name
										</label>
									</div>
									<div className="field-body">
										<input
											type="text"
											id="name"
											className="input"
											onChange={(e): void => {
												setName(e.target.value);
											}}
											value={name}
										/>
									</div>
								</div>
							</div>
							<div className="level-item">
								<div className="field is-horizontal">
									<div className="field-label">
										<label htmlFor="retroId" className="label">
											Retro ID
										</label>
									</div>
									<div className="field-body">
										<input
											type="text"
											id="retroId"
											className="input"
											onChange={(e): void => {
												setRetroId(e.target.value);
											}}
											onBlur={(e): void => {
												setRetroId(e.target.value);
												setLoadedRetroId(e.target.value);
											}}
											value={retroId}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="columns is-mobile">
						{loading ||
							columns.map(
								({ header, items, addItem }): JSX.Element => (
									<Column
										key={header}
										header={header}
										items={items}
										name={name}
										addItem={addItem}
									/>
								),
							)}
					</div>
				</div>
			</section>
		</>
	);
}

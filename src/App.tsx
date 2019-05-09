import React from 'react';

import RetroItemColumn from './RetroItemColumn';
import Column from './Column';

interface AppProps {
	loading: boolean;
	setLoading: Function;
	name: string;
	columns: RetroItemColumn[];
	retroId: string;
	setName: Function;
	setRetroId: Function;
	loadedRetroId: string;
	setLoadedRetroId: Function;
}

export default function App({
	loading,
	setLoading,
	name,
	columns,
	retroId,
	setName,
	setRetroId,
	loadedRetroId,
	setLoadedRetroId,
}: AppProps): JSX.Element {
	function handleRetroIdSubmit(
		e: React.SyntheticEvent<HTMLInputElement>,
	): void {
		setLoading(true);
		setLoadedRetroId(retroId);
		e.currentTarget.blur();
	}

	return (
		<>
			<section className="section">
				<div className="navbar is-spaced">
					<div className="container">
						<div className="navbar-brand">
							<h1 className="title is-4">Better Retros</h1>
						</div>
					</div>
				</div>

				<div className="container">
					<div className="level is-mobile">
						<div className="level-left">
							<div className="level-item">
								<div className="field">
									<label htmlFor="name" className="label">
										Your name
									</label>
									<div className="control">
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
								<div className="field">
									<label htmlFor="retroId" className="label">
										Retro ID
									</label>
									<div className="control">
										<input
											type="text"
											id="retroId"
											className="input"
											onKeyDown={(e): void => {
												if (e.key == 'Enter') {
													handleRetroIdSubmit(e);
												}
											}}
											onChange={(e): void => {
												setRetroId(e.target.value);
											}}
											onBlur={handleRetroIdSubmit}
											value={retroId}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="columns is-mobile">
						{!loading && !loadedRetroId ? (
							<div className="column">
								<div className="card">
									<div className="card-content has-text-centered">
										No Retro loaded. Enter a Retro ID to get started!
									</div>
								</div>
							</div>
						) : loading ? null : (
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
							)
						)}
					</div>
				</div>
			</section>
		</>
	);
}

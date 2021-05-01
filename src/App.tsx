import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import _uniq from 'lodash/fp/uniq';
import _orderBy from 'lodash/orderBy';

import FeaturesContext from './FeaturesContext';

import RetroItemColumn from './RetroItemColumn';
import Column from './Column';

interface AppProps {
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	name: string;
	columns: RetroItemColumn[];
	retroId: string;
	setName: React.Dispatch<React.SetStateAction<string>>;
	setRetroId: React.Dispatch<React.SetStateAction<string>>;
	loadedRetroId: string;
	setLoadedRetroId: React.Dispatch<React.SetStateAction<string>>;
	nameFilter: string;
	storeNameFilter: (name: string) => void;
}

export default function App({
	loading,
	name,
	columns,
	retroId,
	setName,
	setRetroId,
	loadedRetroId,
	setLoadedRetroId,
	nameFilter,
	storeNameFilter,
}: AppProps): JSX.Element {
	const {
		nameFilters: nameFiltersFeature,
		exports: exportsFeature,
	} = useContext(FeaturesContext);

	function handleRetroIdSubmit(
		e: React.SyntheticEvent<HTMLInputElement>,
	): void {
		setLoadedRetroId(retroId);
		e.currentTarget.blur();
	}

	const names = columns.reduce(
		(result: string[], column): string[] => [
			...result,
			...column.items.map((i): string => i.name),
		],
		[],
	);
	let uniqueNames = _uniq(names);
	uniqueNames = _orderBy(uniqueNames);

	const nameOptions = ['All', ...uniqueNames].map(
		(n): JSX.Element => (
			<option id={n} key={n}>
				{n}
			</option>
		),
	);

	return (
		<>
			<nav className="navbar is-spaced">
				<div className="container">
					<div className="navbar-brand">
						<div className="navbar-item">
							<h1 className="title is-4">Better Retros</h1>
						</div>
					</div>
				</div>
			</nav>

			<div className="container">
				<div className="level">
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
					<div className="level-right">
						{nameFiltersFeature && (
							<div className="level-item">
								<div className="field">
									<label htmlFor="nameFilter" className="label">
										Name Filter
									</label>

									<div className="select">
										<select
											name="nameFilter"
											id="nameFilter"
											onChange={(e): void => {
												storeNameFilter(e.currentTarget.value);
											}}
											value={nameFilter}
										>
											{nameOptions}
										</select>
									</div>
								</div>
							</div>
						)}
						{exportsFeature && (
							<div className="level-item">
								<div className="field">
									<label htmlFor="" className="label">
										Export
									</label>
									<Link to={`/${loadedRetroId}/export`}>
										<button className="button">Export</button>
									</Link>
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="columns">
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
							({ header, items, addItem, toggleFocus }): JSX.Element => (
								<Column
									key={header}
									header={header}
									items={items}
									name={name}
									addItem={addItem}
									toggleFocus={toggleFocus}
									nameFilter={nameFilter}
								/>
							),
						)
					)}
				</div>
			</div>
		</>
	);
}

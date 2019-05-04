import React, { useState } from 'react';

import 'bulma/css/bulma.css';

interface ColumnProps {
	items: string[];
	header: string;
	addItem: (newItem: string) => void;
}

function Column({ items, header, addItem }: ColumnProps): JSX.Element {
	const [newItem, setNewItem] = useState('');
	const newItemId = `new-${header}`;

	function submitItem(): void {
		addItem(newItem);
		setNewItem('');
	}

	return (
		<div className="column">
			<h1 className="title is-5">{header}</h1>
			{items.length < 1 && <div className="box">No {header} items yet!</div>}
			{items.map(
				(item: string): JSX.Element => (
					<div className="columns" key={item}>
						<div className="column">
							<div className="card">
								<div className="card-content">{item}</div>
							</div>
						</div>
					</div>
				),
			)}
			<div className="field">
				<div className="control">
					<textarea
						name={newItemId}
						id={newItemId}
						className="textarea"
						value={newItem}
						onChange={(e): void => {
							setNewItem(e.target.value);
						}}
						onKeyDown={(e): void => {
							if ((e.ctrlKey || e.metaKey) && e.key == 'Enter') {
								submitItem();
							}
						}}
					/>
				</div>
			</div>
			<div className="field">
				<div className="control">
					<button
						className="button is-primary is-fullwidth"
						onClick={submitItem}
					>
						Add a {header} item
					</button>
				</div>
			</div>
		</div>
	);
}

interface RetroState {
	start: string[];
	stop: string[];
	cont: string[];
}

export default function App(): JSX.Element {
	const [{ start, stop, cont }, setItems] = useState<RetroState>({
		start: [],
		stop: [],
		cont: [],
	});

	function makeAddNewItem(
		column: 'start' | 'stop' | 'cont',
	): (newItem: string) => void {
		return function(newItem: string): void {
			setItems(
				(prevState: RetroState): RetroState => ({
					...prevState,
					[column]: [...prevState[column], newItem],
				}),
			);
		};
	}
	const columns = [
		{
			header: 'Start',
			items: start,
			addItem: makeAddNewItem('start'),
		},
		{
			header: 'Stop',
			items: stop,
			addItem: makeAddNewItem('stop'),
		},
		{
			header: 'Continue',
			items: cont,
			addItem: makeAddNewItem('cont'),
		},
	];

	return (
		<section className="section">
			<div className="container">
				<h1 className="title">Better Retros</h1>
				<div className="columns is-mobile">
					{columns.map(
						({ header, items, addItem }): JSX.Element => (
							<Column
								key={header}
								header={header}
								items={items}
								addItem={addItem}
							/>
						),
					)}
				</div>
			</div>
		</section>
	);
}

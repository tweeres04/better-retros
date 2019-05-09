import React, { useState } from 'react';
import marked from 'marked';

import RetroItem from './RetroItem';

interface ColumnProps {
	items: RetroItem[];
	name: string;
	header: string;
	addItem: (newItem: string) => void;
}

export default function Column({
	items,
	name,
	header,
	addItem,
}: ColumnProps): JSX.Element {
	const [newItem, setNewItem] = useState('');
	const newItemId = `new-${header}`;

	function submitItem(): void {
		if (newItem && name) {
			addItem(newItem);
			setNewItem('');
		}
	}

	return (
		<div className="column">
			<h1 className="title is-4">
				{header} <div className="tag">{items.length}</div>
			</h1>
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
			{items.length < 1 && <div className="box">No {header} items yet!</div>}
			{items.map(
				({ item, name }: RetroItem): JSX.Element => (
					<div className="columns" key={item}>
						<div className="column">
							<div className="card" style={{ position: 'relative' }}>
								<div className="card-content">
									<div
										className="content"
										dangerouslySetInnerHTML={{ __html: marked(item) }}
									/>
									<div
										className="tag"
										style={{
											position: 'absolute',
											top: '0.5em',
											right: '0.5em',
										}}
									>
										{name}
									</div>
								</div>
							</div>
						</div>
					</div>
				),
			)}
		</div>
	);
}

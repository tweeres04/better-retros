import React, { useState, useContext } from 'react';
import marked from 'marked';
import classnames from 'classnames';
import _noop from 'lodash/noop';

import FeaturesContext from './FeaturesContext';
import RetroItem from './RetroItem';

interface ColumnProps {
	items: RetroItem[];
	name: string;
	header: string;
	addItem: (newItem: string) => void;
	toggleFocus: (focused: boolean, index: number) => void;
	nameFilter: string;
}

export default function Column({
	items,
	name,
	header,
	addItem,
	toggleFocus,
	nameFilter,
}: ColumnProps): JSX.Element {
	const [newItem, setNewItem] = useState('');
	const newItemId = `new-${header}`;
	const {
		focusableItem: focusableItemFeature,
		nameFilters: nameFiltersFeature,
	} = useContext(FeaturesContext);

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
				(
					{ item, name, focused }: RetroItem,
					index: number,
				): JSX.Element | null =>
					!nameFiltersFeature || nameFilter == 'All' || nameFilter == name ? (
						<div className="columns" key={item}>
							<div className="column">
								<div
									className={classnames('card retro-item', {
										focused: focusableItemFeature && focused,
									})}
									onClick={
										focusableItemFeature
											? (): void => {
													toggleFocus(focused, index);
											  }
											: _noop
									}
								>
									<div className="card-content">
										{focused}
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
					) : null,
			)}
		</div>
	);
}

import React, { useState, useEffect } from 'react';
import firebase from 'firebase';

import 'bulma/css/bulma.css';

import RetroItem from './RetroItem';
import Column from './Column';

interface RetroState {
	start: RetroItem[];
	stop: RetroItem[];
	cont: RetroItem[];
}

function defaultRetroState(): RetroState {
	return {
		start: [],
		stop: [],
		cont: [],
	};
}

export default function App(): JSX.Element {
	const [{ start, stop, cont }, setItems] = useState(defaultRetroState());
	const [loading, setLoading] = useState(true);
	const [name, setName] = useState('');
	const [retroId, setRetroId] = useState('');
	const [loadedRetroId, setLoadedRetroId] = useState('');

	async function getRetro(retroId: string): Promise<void> {
		const retroSnapshot = await firebase
			.firestore()
			.doc(`retros/${retroId}`)
			.get();

		setItems((retroSnapshot.data() as RetroState) || defaultRetroState());
	}

	async function loadState(): Promise<void> {
		const name = localStorage.getItem('better-retros-name');
		if (name) {
			setName(name);
		}
		const retroId = localStorage.getItem('better-retros-retroId');
		if (retroId) {
			setRetroId(retroId);
			setLoadedRetroId(retroId);
			await getRetro(retroId);
		}
		setLoading(false);
	}

	useEffect((): void => {
		loadState();
	}, []);

	useEffect((): void => {
		localStorage.setItem('better-retros-name', name);
		localStorage.setItem('better-retros-retroId', retroId);
	}, [name, retroId]);

	function subscribeToRetro(): (() => void) | undefined {
		if (retroId) {
			return firebase
				.firestore()
				.doc(`retros/${retroId}`)
				.onSnapshot(
					(retroSnapshot): void => {
						setItems(
							(retroSnapshot.data() as RetroState) || defaultRetroState(),
						);
					},
				);
		}
	}

	useEffect((): (() => void) | undefined => subscribeToRetro(), [
		loadedRetroId,
	]);

	function makeAddNewItem(
		column: 'start' | 'stop' | 'cont',
	): (newItem: string) => void {
		return async function(newItem: string): Promise<void> {
			const docRef = firebase.firestore().doc(`retros/${retroId}`);
			const docSnapshot = await docRef.get();

			if (!docSnapshot.exists) {
				await docRef.set(defaultRetroState());
			}

			const retroItem: RetroItem = {
				item: newItem,
				name,
			};

			firebase
				.firestore()
				.doc(`retros/${retroId}`)
				.update({
					[column]: firebase.firestore.FieldValue.arrayUnion(retroItem),
				});
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

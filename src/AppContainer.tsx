import React, { useState, useEffect } from 'react';
import firebase from 'firebase';

import 'bulma/css/bulma.css';

import RetroItem from './RetroItem';
import App from './App';

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

export default function AppContainer(): JSX.Element {
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

	useEffect((): void => {
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

		loadState();
	}, []);

	useEffect((): void => {
		localStorage.setItem('better-retros-name', name);
		localStorage.setItem('better-retros-retroId', retroId);
	}, [name, retroId]);

	useEffect((): (() => void) | undefined => {
		function subscribeToRetro(): (() => void) | undefined {
			if (loadedRetroId) {
				return firebase
					.firestore()
					.doc(`retros/${loadedRetroId}`)
					.onSnapshot(
						(retroSnapshot): void => {
							setItems(
								(retroSnapshot.data() as RetroState) || defaultRetroState(),
							);
						},
					);
			}
		}
		return subscribeToRetro();
	}, [loadedRetroId]);

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
		<App
			loading={loading}
			name={name}
			columns={columns}
			retroId={retroId}
			setName={setName}
			setRetroId={setRetroId}
			setLoadedRetroId={setLoadedRetroId}
		/>
	);
}

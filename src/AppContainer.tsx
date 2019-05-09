import React, { useState, useEffect } from 'react';
import firebase from 'firebase';

import 'bulma/css/bulma.css';

import RetroItem from './RetroItem';
import App from './App';
import { History } from 'history';

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

interface AppContainerProps {
	match: { params: { urlRetroId: string } };
	history: History;
}

export default function AppContainer({
	match: {
		params: { urlRetroId },
	},
	history,
}: AppContainerProps): JSX.Element {
	const [{ start, stop, cont }, setItems] = useState(defaultRetroState());
	const [loading, setLoading] = useState(true);
	const [name, setName] = useState('');
	const [retroId, setRetroId] = useState(urlRetroId || '');
	const [loadedRetroId, setLoadedRetroId] = useState(urlRetroId || '');

	useEffect((): void => {
		const name = localStorage.getItem('better-retros-name');
		if (name) {
			setName(name);
		}
	}, []);

	useEffect((): (() => void) | undefined => {
		function subscribeToRetro(): (() => void) | undefined {
			if (loadedRetroId) {
				return firebase
					.firestore()
					.doc(`retros/${loadedRetroId}`)
					.onSnapshot(
						(retroSnapshot): void => {
							setLoading(false);
							setItems(
								(retroSnapshot.data() as RetroState) || defaultRetroState(),
							);
						},
					);
			} else {
				setLoading(false);
			}
		}

		history.push(loadedRetroId ? `/${loadedRetroId}` : '/');

		document.title = `${
			loadedRetroId ? `${loadedRetroId} - ` : ''
		}Better Retros`;

		setRetroId(loadedRetroId || '');

		return subscribeToRetro();
	}, [loadedRetroId, history]);

	useEffect((): void => {
		localStorage.setItem('better-retros-name', name);
	}, [name]);

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
			setLoading={setLoading}
			name={name}
			columns={columns}
			retroId={retroId}
			setName={setName}
			setRetroId={setRetroId}
			loadedRetroId={loadedRetroId}
			setLoadedRetroId={setLoadedRetroId}
		/>
	);
}

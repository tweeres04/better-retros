import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import update from 'immutability-helper';
import { History } from 'history';

import './App.scss';

import FeaturesContext from './FeaturesContext';
import Retro from './Retro';
import RetroItem from './RetroItem';
import App from './App';

type RetroColumnId = 'start' | 'stop' | 'cont';

function defaultRetroState(): Retro {
	return {
		start: [],
		stop: [],
		cont: [],
		nameFilter: 'All',
	};
}

interface AppContainerProps {
	match: { params: { urlRetroId: string } };
	history: History;
}

function retroFactory({ start, stop, cont }: Retro): Retro {
	return {
		start,
		stop,
		cont,
		nameFilter: 'All',
	};
}

export default function AppContainer({
	match: {
		params: { urlRetroId },
	},
	history,
}: AppContainerProps): JSX.Element {
	const [features, setFeatures] = useState({});
	const [{ start, stop, cont }, setItems] = useState(defaultRetroState());
	const [loading, setLoading] = useState(true);
	const [name, setName] = useState('');
	const [retroId, setRetroId] = useState(urlRetroId || '');
	const [loadedRetroId, setLoadedRetroId] = useState(urlRetroId || '');
	const [nameFilter, setNameFilter] = useState('All');

	useEffect((): void => {
		async function getFeatures(): Promise<void> {
			const featuresSnapshot = await firebase
				.firestore()
				.doc('/settings/features')
				.get();

			const features = featuresSnapshot.data() as Record<string, boolean>;

			setFeatures(features);
		}

		getFeatures();
	}, []);

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
							const snapshotData = retroSnapshot.data();
							setItems(
								retroFactory(snapshotData as Retro) || defaultRetroState(),
							);
							setNameFilter(
								((snapshotData as Record<string, string>)
									.nameFilter as string) || 'All',
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

	function makeAddNewItem(column: RetroColumnId): (newItem: string) => void {
		return async function(newItem: string): Promise<void> {
			const docRef = firebase.firestore().doc(`retros/${loadedRetroId}`);
			const docSnapshot = await docRef.get();

			if (!docSnapshot.exists) {
				await docRef.set(defaultRetroState());
			}

			const retroItem: RetroItem = {
				item: newItem,
				name,
				focused: false,
			};

			firebase
				.firestore()
				.doc(`retros/${loadedRetroId}`)
				.update({
					[column]: firebase.firestore.FieldValue.arrayUnion(retroItem),
				});
		};
	}

	function makeToggleFocus(
		column: RetroColumnId,
	): (focused: boolean, index: number) => void {
		return async function toggleFocus(
			focused: boolean,
			index: number,
		): Promise<void> {
			const retroRef = firebase.firestore().doc(`retros/${loadedRetroId}`);

			function columnResetter(
				retro: Retro,
				columnId: RetroColumnId,
			): RetroItem[] {
				return retro[columnId].map(
					(retroItem): RetroItem => ({
						...retroItem,
						focused: false,
					}),
				);
			}

			const retroDoc = await retroRef.get();
			const columnData = retroDoc.data() as Retro;
			let updatedRetro = {
				start: columnResetter(columnData, 'start'),
				stop: columnResetter(columnData, 'stop'),
				cont: columnResetter(columnData, 'cont'),
			};
			updatedRetro = update(updatedRetro, {
				[column]: {
					[index]: {
						focused: {
							$set: !focused,
						},
					},
				},
			});
			return retroRef.update(updatedRetro);
		};
	}

	function storeNameFilter(name: string): void {
		setNameFilter(name);
		firebase
			.firestore()
			.doc(`/retros/${loadedRetroId}`)
			.update({
				nameFilter: name,
			});
	}

	const columns = [
		{
			header: 'Start',
			items: start,
			addItem: makeAddNewItem('start'),
			toggleFocus: makeToggleFocus('start'),
		},
		{
			header: 'Stop',
			items: stop,
			addItem: makeAddNewItem('stop'),
			toggleFocus: makeToggleFocus('stop'),
		},
		{
			header: 'Continue',
			items: cont,
			addItem: makeAddNewItem('cont'),
			toggleFocus: makeToggleFocus('cont'),
		},
	];

	return (
		<FeaturesContext.Provider value={features}>
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
				nameFilter={nameFilter}
				storeNameFilter={storeNameFilter}
			/>
		</FeaturesContext.Provider>
	);
}

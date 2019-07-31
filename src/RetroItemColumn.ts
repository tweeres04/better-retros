import RetroItem from './RetroItem';

export default interface RetroItemColumn {
	header: string;
	items: RetroItem[];
	addItem: (newItem: string) => void;
	toggleFocus: (focused: boolean, index: number) => void;
}

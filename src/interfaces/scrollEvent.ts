import {ScrollDirection} from '../enums/scrollDirection';

export interface ScrollEvent {
	direction: ScrollDirection;
	value: number;
}

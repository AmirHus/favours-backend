import { FavourItems } from '../enums/favourItem';

export interface IFavour {
  owing: boolean;
  name: string;
  favourItem: FavourItems;
}

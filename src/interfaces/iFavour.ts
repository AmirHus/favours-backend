import { FavourItems } from '../enums/favourItem';

export interface IFavour {
  id: number;
  createdBy: string;
  otherParty: string;
  favourItem: FavourItems;
  repaid: boolean;
  noItems: number;
}

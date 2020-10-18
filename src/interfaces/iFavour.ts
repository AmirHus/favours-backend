import { FavourItems } from '../enums/favourItem';

export interface IFavour {
  id: number;
  owing: boolean;
  created_by: string;
  other_party: string;
  favour_item: FavourItems;
  repaid: boolean;
  no_of_items: number;
  proof: string;
  proof_of_completion: string;
}

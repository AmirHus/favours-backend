export interface IPublicRequest {
  id: number;
  created_by: string;
  accepted_by: string | null;
  description: string;
  title: string;
  image_proof: string;
  completed: boolean;
}

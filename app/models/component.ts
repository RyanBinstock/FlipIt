export type Component = {
  id: string; // GUID (UUID as string)
  name: string;
  price: number;
  details: string;
  build_id: string; // FK — build’s GUID
  parts: { part_name: string };
  vendors: { vendor_name: string };
  component_conditions: { condition_status: string };
  user_id: string; // FK — user’s GUID or auth id
};

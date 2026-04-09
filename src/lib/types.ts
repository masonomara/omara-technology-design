export type ContentNode = {
  name: string;
  children?: ContentNode[];
  description?: string;
  tags?: string[];
  images?: string[];
  items?: string[];
};

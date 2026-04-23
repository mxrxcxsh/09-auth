export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: string;
};

export type CreateNote = {
  title: string;
  content: string;
  tag: string;
};

export type Category = {
  tag: string;
};

export interface NewNoteData {
  title: string;
  content: string;
  tag: string;
}

import css from './LayoutNotes.module.css';

interface NotesLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

function NotesLayout({ sidebar, children }: NotesLayoutProps) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>
        <h2>Filters Menu</h2>
        {sidebar}
      </aside>
      <div className={css.notesWrapper}>{children}</div>
    </div>
  );
}

export default NotesLayout;

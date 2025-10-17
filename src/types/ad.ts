export interface Ad {
  id: string;
  pageName: string;
  title: string;
  body: string;
  videoUrl: string;
  firstSeen: string;
  lastSeen: string;
}

export interface AirtableRecord {
  id: string;
  fields: {
    'Page Name'?: string;
    'Title'?: string;
    'Body'?: string;
    'Media Link'?: string;
    'First Seen'?: string;
    'Last Seen'?: string;
  };
}

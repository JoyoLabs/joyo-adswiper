import Airtable from 'airtable';
import { Ad, AirtableRecord } from '@/types/ad';
import { convertToCloudinaryPlayerUrl } from './cloudinary';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID!);

export async function getAds(): Promise<Ad[]> {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_NAME!)
      .select({
        view: 'Grid view',
        fields: ['Page Name', 'Title', 'Body', 'Media Link', 'First Seen', 'Last Seen']
      })
      .all();

    return records.map((record: any): Ad => ({
      id: record.id,
      pageName: record.fields['Page Name'] || '',
      title: record.fields['Title'] || '',
      body: record.fields['Body'] || '',
      videoUrl: convertToCloudinaryPlayerUrl(record.fields['Media Link'] || ''),
      firstSeen: record.fields['First Seen'] || '',
      lastSeen: record.fields['Last Seen'] || '',
    }));
  } catch (error) {
    console.error('Error fetching ads from Airtable:', error);
    throw new Error('Failed to fetch ads');
  }
}

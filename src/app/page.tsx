import { Suspense } from 'react';
import AdSwiper from '@/components/AdSwiper';
import { getAds } from '@/lib/airtable';
import { Ad } from '@/types/ad';

export default async function Home() {
  let ads: Ad[] = [];
  let error: string | null = null;

  try {
    ads = await getAds();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load ads';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Ads</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="text-left bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">Please check:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Airtable access token is valid</li>
              <li>• Base ID is correct</li>
              <li>• Table name exists</li>
              <li>• Required fields are present</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Joyolabs Ad Swiper</h1>
        </div>
        
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto h-[80vh] min-h-[650px] max-h-[900px] relative">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading ads...</p>
              </div>
            </div>
          }>
            <AdSwiper ads={ads} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
# Competitor Ad Swiper

A Tinder-like web application for swiping through competitor ads. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎥 Video playback with play/pause controls
- 👆 Swipe gestures (left to pass, right to like)
- 📱 Mobile-responsive design
- 🎨 Modern, clean UI
- ⚡ Fast loading with Next.js
- 🔄 Smooth animations with Framer Motion

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `env.template` to `.env.local`
   - Fill in your Airtable credentials:
     ```
     AIRTABLE_ACCESS_TOKEN=your_airtable_access_token_here
     AIRTABLE_BASE_ID=your_airtable_base_id_here
     AIRTABLE_TABLE_NAME=your_table_name_here
     ```

3. **Airtable Setup:**
   Your Airtable table should have the following fields:
   - `Page Name` (Single line text)
   - `Title` (Single line text)
   - `Body` (Single line text)
   - `Media Link` (Single line text) - contains video URLs
   - `First Seen` (Single line text)
   - `Last Seen` (Single line text)

4. **Run the development server:**
```bash
npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

1. **Push your code to GitHub**

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard

3. **Deploy:**
   - Vercel will automatically deploy your app
   - Your app will be available at `https://your-app-name.vercel.app`

## Usage

- **Swipe left** to pass on an ad
- **Swipe right** to like an ad
- **Tap the video** to play/pause
- **Use the action buttons** at the bottom for precise control
- **Start over** when you've seen all ads

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Data Source:** Airtable API
- **Video Hosting:** Cloudinary (via Airtable URLs)
- **Deployment:** Vercel

## Troubleshooting

### Common Issues

1. **"No ads available" error:**
   - Check your Airtable access token
   - Verify the base ID and table name
   - Ensure the required fields exist in your table

2. **Videos not playing:**
   - Check that video URLs are valid
   - Ensure videos are in MP4 format
   - Verify Cloudinary URLs are accessible

3. **Build errors:**
   - Make sure all environment variables are set
   - Check that all dependencies are installed
   - Verify TypeScript configuration

### Getting Airtable Credentials

1. **Access Token:**
   - Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
   - Create a new personal access token
   - Copy the token value

2. **Base ID:**
   - Open your Airtable base
   - Go to Help > API documentation
   - Copy the Base ID from the URL

3. **Table Name:**
   - Use the exact name of your table as it appears in Airtable
   - Case-sensitive

## License

MIT License - feel free to use this project for your own needs.
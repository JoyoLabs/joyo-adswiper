/**
 * Converts Cloudinary resource URLs to embeddable player URLs
 *
 * Example:
 * Input:  https://res.cloudinary.com/dwehn5ymr/video/upload/v1760704663/Competitors/xhhws6chljeveum49blf.mp4
 * Output: https://player.cloudinary.com/embed/?cloud_name=joyolabs&public_id=Competitors%2Fxhhws6chljeveum49blf&profile=cld-default
 */

const CLOUD_NAME = 'joyolabs'; // Your Cloudinary cloud name

export function convertToCloudinaryPlayerUrl(resourceUrl: string): string {
  if (!resourceUrl) return resourceUrl;

  // Check if it's already a player URL
  if (resourceUrl.includes('player.cloudinary.com')) {
    return resourceUrl;
  }

  // Check if it's a Cloudinary resource URL
  if (!resourceUrl.includes('res.cloudinary.com')) {
    // Not a Cloudinary URL, return as-is
    return resourceUrl;
  }

  try {
    // Extract the public_id from the resource URL
    // Pattern: https://res.cloudinary.com/{cloud_name}/video/upload/v{version}/{public_id}.{extension}
    const match = resourceUrl.match(/\/video\/upload\/v\d+\/(.+?)(?:\.\w+)?$/);

    if (!match || !match[1]) {
      console.warn('Could not extract public_id from URL:', resourceUrl);
      return resourceUrl;
    }

    const publicId = match[1];

    // URL encode the public_id (replace / with %2F)
    const encodedPublicId = encodeURIComponent(publicId);

    // Construct the player embed URL with autoplay and loop parameters
    // Note: muted=false to allow sound, controls=true for player API access
    const playerUrl = `https://player.cloudinary.com/embed/?cloud_name=${CLOUD_NAME}&public_id=${encodedPublicId}&profile=cld-default&autoplay=true&loop=true&muted=false&controls=true`;

    return playerUrl;
  } catch (error) {
    console.error('Error converting Cloudinary URL:', error);
    return resourceUrl;
  }
}

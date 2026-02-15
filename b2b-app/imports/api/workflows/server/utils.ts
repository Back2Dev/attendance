import Listings from '../../listings/schema';

const debug = require('debug')('app:listings-server-utils');

export const listingSettleComplete = async (listingId: string) => {
  // check if the listing is existing
  const listing = await Listings.findOneAsync({ _id: listingId });
  if (!listing) {
    return {
      status: 'failed',
      message: `3. listing was not found with id: ${listingId}`,
    };
  }

  try {
    const affected = await Listings.updateAsync(listingId, {
      $set: { status: 'complete' },
    });
    debug('affected', affected);
    if (affected) {
      return { status: 'success', message: 'listing successfully updated' };
    }
    return { status: 'failed', message: `unable to update listing with id ${listingId}` };
  } catch (e) {
    return { status: 'failed', message: `Error: ${e}` };
  }
};

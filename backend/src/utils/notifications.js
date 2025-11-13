import Notification from '../models/Notification.js';

export const createNotification = async (userId, type, title, message, relatedId = null, relatedModel = null) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      relatedId,
      relatedModel
    });
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

export const notifyDonationClaimed = async (donorId, donationId, ngoName) => {
  return createNotification(
    donorId,
    'donation_claimed',
    'Donation Claimed',
    `Your donation has been claimed by ${ngoName}`,
    donationId,
    'Donation'
  );
};

export const notifyPickupAssigned = async (volunteerId, pickupId) => {
  return createNotification(
    volunteerId,
    'pickup_assigned',
    'New Pickup Request',
    'A new pickup request is available',
    pickupId,
    'PickupRequest'
  );
};

export const notifyPickupAccepted = async (ngoId, pickupId, volunteerName) => {
  return createNotification(
    ngoId,
    'pickup_accepted',
    'Pickup Accepted',
    `${volunteerName} has accepted the pickup request`,
    pickupId,
    'PickupRequest'
  );
};

export const notifyPickupStatusUpdate = async (ngoId, pickupId, status) => {
  const statusMessages = {
    picked_up: 'Food has been picked up',
    in_transit: 'Food is in transit',
    delivered: 'Food has been delivered'
  };

  return createNotification(
    ngoId,
    'pickup_status_updated',
    'Pickup Status Updated',
    statusMessages[status] || `Pickup status updated to ${status}`,
    pickupId,
    'PickupRequest'
  );
};

export const notifyDonorPickupDelivered = async (donorId, donationId) => {
  return createNotification(
    donorId,
    'pickup_delivered',
    'Donation Delivered',
    'Your donation has been successfully delivered',
    donationId,
    'Donation'
  );
};

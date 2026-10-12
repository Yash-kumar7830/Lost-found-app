import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_ITEMS } from '../data/mockItems';
import { MOCK_CLAIMS, MOCK_NOTIFICATIONS } from '../data/mockNotifications';
import { calculateDemoSimilarity, generateReportId, generateClaimId } from '../utils/helpers';

const DataContext = createContext();

export function DataProvider({ children }) {
  // Items state
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('findit_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_ITEMS;
      }
    }
    return MOCK_ITEMS;
  });

  // Claims state
  const [claims, setClaims] = useState(() => {
    const saved = localStorage.getItem('findit_claims');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_CLAIMS;
      }
    }
    return MOCK_CLAIMS;
  });

  // Notifications state
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('findit_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_NOTIFICATIONS;
      }
    }
    return MOCK_NOTIFICATIONS;
  });

  // Dismissed match IDs
  const [dismissedMatches, setDismissedMatches] = useState(() => {
    const saved = localStorage.getItem('findit_dismissed_matches');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('findit_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('findit_claims', JSON.stringify(claims));
  }, [claims]);

  useEffect(() => {
    localStorage.setItem('findit_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('findit_dismissed_matches', JSON.stringify(dismissedMatches));
  }, [dismissedMatches]);

  // Action: Add new reported item
  const addItem = (itemInput) => {
    const newId = itemInput.id || generateReportId();
    let bestMatch = null;
    let highestScore = 0;

    // Check potential matches against existing items of the opposite type
    const oppositeType = itemInput.type === 'lost' ? 'found' : 'lost';
    items.forEach((existing) => {
      if (existing.type === oppositeType && existing.status !== 'resolved') {
        const score = calculateDemoSimilarity(itemInput, existing);
        if (score >= 80 && score > highestScore) {
          highestScore = score;
          bestMatch = existing;
        }
      }
    });

    const newItem = {
      ...itemInput,
      id: newId,
      status: bestMatch ? 'potential_match' : 'active',
      date: itemInput.date || new Date().toISOString().split('T')[0],
      potentialMatchId: bestMatch ? bestMatch.id : null,
      matchScore: bestMatch ? highestScore : undefined,
      matchReason: bestMatch
        ? `Matched on category '${itemInput.category}', similar location keywords, and matching attributes.`
        : undefined,
    };

    setItems((prev) => {
      if (bestMatch) {
        // Also update the existing matched item
        return prev.map((item) => {
          if (item.id === bestMatch.id) {
            return {
              ...item,
              status: 'potential_match',
              potentialMatchId: newId,
              matchScore: highestScore,
              matchReason: `High-confidence match detected with newly reported item ${newId}.`,
            };
          }
          return item;
        }).concat([newItem]);
      }
      return [newItem, ...prev];
    });

    // If match found, generate a notification
    if (bestMatch) {
      const matchNotif = {
        id: `notif-${Date.now()}`,
        title: 'New High Confidence Match Detected!',
        message: `Your newly submitted ${itemInput.type} item "${itemInput.title}" matched with ${bestMatch.id} (${highestScore}% match).`,
        type: 'match',
        timestamp: new Date().toISOString(),
        read: false,
        link: '/matches',
        itemId: bestMatch.id,
        actionLabel: 'Review Match',
      };
      setNotifications((prev) => [matchNotif, ...prev]);
    }

    return newItem;
  };

  // Action: Update existing item
  const updateItem = (id, updates) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Action: Delete / withdraw item
  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Action: Mark item resolved / returned
  const resolveItem = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'resolved',
              resolvedDate: new Date().toISOString().split('T')[0],
            }
          : item
      )
    );

    const resolvedNotif = {
      id: `notif-${Date.now()}`,
      title: 'Item Marked as Returned',
      message: `Report ${id} has been marked as successfully reunited with its owner.`,
      type: 'resolved',
      timestamp: new Date().toISOString(),
      read: false,
      link: `/items/${id}`,
      actionLabel: 'View Report',
    };
    setNotifications((prev) => [resolvedNotif, ...prev]);
  };

  // Action: Submit ownership claim
  const submitClaim = (claimInput) => {
    const claimId = claimInput.id || generateClaimId();
    const newClaim = {
      ...claimInput,
      id: claimId,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      timeline: [
        { step: 'Claim Submitted', timestamp: new Date().toLocaleString(), done: true },
        { step: 'Security Desk Verification', timestamp: 'Under review', current: true },
        { step: 'Claimant Identity Check', timestamp: 'Pending', done: false },
        { step: 'Physical Handover at Admin Desk', timestamp: 'Pending', done: false },
      ],
      adminNotes: 'Awaiting student card check at central security kiosk.',
    };

    setClaims((prev) => [newClaim, ...prev]);

    // Update item status to claim_pending
    if (claimInput.itemId) {
      updateItem(claimInput.itemId, { status: 'claim_pending' });
    }

    // Add alert notification
    const claimNotif = {
      id: `notif-${Date.now()}`,
      title: 'Claim Submitted for Verification',
      message: `Your claim #${claimId} for "${claimInput.itemTitle}" has been received and logged for security review.`,
      type: 'claim',
      timestamp: new Date().toISOString(),
      read: false,
      link: '/claims',
      claimId,
      actionLabel: 'Track Claim',
    };
    setNotifications((prev) => [claimNotif, ...prev]);

    return newClaim;
  };

  // Action: Update claim status (Admin approval/rejection)
  const updateClaimStatus = (claimId, status, notes = '') => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const updatedTimeline = c.timeline.map((t, idx) => {
            if (status === 'approved') {
              return { ...t, done: true, current: false };
            }
            if (status === 'rejected' && idx === 1) {
              return { ...t, done: false, current: false, failed: true };
            }
            return t;
          });

          return {
            ...c,
            status,
            adminNotes: notes || c.adminNotes,
            timeline: updatedTimeline,
            reviewedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    // If claim approved, mark corresponding item as resolved
    const targetClaim = claims.find((c) => c.id === claimId);
    if (targetClaim && status === 'approved') {
      resolveItem(targetClaim.itemId);
    }
  };

  // Action: Dismiss match recommendation
  const dismissMatch = (matchPairId) => {
    setDismissedMatches((prev) => [...prev, matchPairId]);
  };

  // Notification actions
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Computed metrics
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  const myReports = items.filter((item) => item.reportedBy?.isCurrentUser);
  const myLostCount = myReports.filter((item) => item.type === 'lost').length;
  const myFoundCount = myReports.filter((item) => item.type === 'found').length;
  const potentialMatchesCount = items.filter(
    (item) => item.status === 'potential_match' && !dismissedMatches.includes(item.id)
  ).length;
  const resolvedCount = items.filter((item) => item.status === 'resolved').length;
  const pendingClaimsCount = claims.filter((c) => c.status === 'pending').length;

  return (
    <DataContext.Provider
      value={{
        items,
        claims,
        notifications,
        dismissedMatches,
        addItem,
        updateItem,
        deleteItem,
        resolveItem,
        submitClaim,
        updateClaimStatus,
        dismissMatch,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotifsCount,
        myReports,
        myLostCount,
        myFoundCount,
        potentialMatchesCount,
        resolvedCount,
        pendingClaimsCount,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

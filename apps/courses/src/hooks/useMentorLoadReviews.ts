import { useState, useCallback, useEffect } from 'react';
import { useFirestore, useUser } from 'reactfire';
import { MentorReview } from '@openmined/shared/types';

export function useMentorLoadReviews() {
  const [reviews, setReviews] = useState<Array<MentorReview>>([]);
  const [shouldLoad, setLoadNextPage] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [hasMoreReviews, setHasMoreReviews] = useState<boolean>(true);
  const [last, setLast] = useState<firebase.firestore.DocumentData>(null);

  const pageSize = 5;
  const db = useFirestore();
  const user: firebase.User = useUser();

  const fetchData = useCallback(async () => {
    setLoading(true);

    let dbRef = db
      .collection('users')
      .doc(user.uid)
      .collection('reviews')
      .orderBy('started_at', 'desc')
      .limit(pageSize + 1);

    if (reviews.length > 0) {
      dbRef = dbRef.startAt(last);
    }

    const reviewsSnapshots = await dbRef.get();

    const newReviews: firebase.firestore.DocumentData = reviewsSnapshots.docs.map(
      (doc) => doc.data()
    );

    if (newReviews.length === 0 || newReviews.length < pageSize) {
      setHasMoreReviews(false);
    } else {
      setLast(reviewsSnapshots.docs[reviewsSnapshots.docs.length - 1]);
    }

    setReviews([].concat(reviews, newReviews.slice(0, pageSize)));
    setLoading(false);
  }, [db, last, reviews, user.uid]);

  useEffect(() => {
    if (shouldLoad) {
      setLoadNextPage(false);
      fetchData();
    }
  }, [fetchData, shouldLoad]);

  return {
    reviews,
    nextPage: () => setLoadNextPage(true),
    isLoading,
    hasMoreReviews,
  };
}

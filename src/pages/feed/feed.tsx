import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeed,
  selectFeedOrders,
  selectFeedLoading,
  selectFeedError
} from '../../features/feed/feedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const loading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);

  useEffect(() => {
    if (!orders.length) dispatch(fetchFeed());
  }, [dispatch, orders.length]);

  if (loading && !orders.length) return <Preloader />;
  if (error) return <div style={{ padding: 16 }}>{error}</div>;

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(fetchFeed())} // кнопка «Обновить»
    />
  );
};

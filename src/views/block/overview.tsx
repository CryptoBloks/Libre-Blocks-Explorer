import type { OverviewProps } from './types';
import dayjs from 'dayjs';
import Link from 'next/link';
import * as React from 'react';
import TimeAgo from 'react-timeago';

export default function TxOverview({ data }: OverviewProps) {
  const [actionState, setActionState] = React.useState<'pending' | 'irreversible'>('pending');
  const timestamp = data.timestamp;
  const difference = dayjs(timestamp).diff(dayjs(), 'minute');

  function checkDifference() {
    if (difference > 2) {
      setActionState('pending');
    } else {
      setActionState('irreversible');
    }
  }

  React.useEffect(() => {
    checkDifference();
    const intervalId = setInterval(() => {
      checkDifference();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const totalActionsLength =
    data.transactions.reduce((acc, item) => acc + item.trx.transaction.actions.length, 0) || 0;

  return (
    <div className='divide-y divide-shade-800 rounded-xl border border-shade-800 bg-black pb-5 text-white'>
      <div className='p-5'>
        <div className='align-center inline-block rounded-full bg-primary py-1.5 px-3 text-xs font-medium capitalize'>
          {actionState}
        </div>
        <p className='mt-5 text-sm'>
          <TimeAgo title='' date={dayjs(timestamp).utc(true).toDate()} />
          <br />
          {dayjs(timestamp).utc(true).format('MMM DD, YYYY h:mm A')} UTC
        </p>
      </div>
      <div className='flex items-center justify-between py-3 px-5'>
        <p>Block</p>
        <p className='font-semibold'>
          <Link href={`/block/${data.block_num}`} className='text-primary hover:underline'>
            {data.block_num}
          </Link>
        </p>
      </div>
      <div className='flex items-center justify-between space-x-2 py-3 px-5'>
        <p>Total Actions</p>
        <p className='text-right font-semibold'>{totalActionsLength}</p>
      </div>
      <div className='flex items-center justify-between space-x-2 py-3 px-5'>
        <p>Producer</p>
        <Link
          href={`/address/${data.producer}`}
          className='text-right font-semibold hover:underline'
        >
          {data.producer}
        </Link>
      </div>

      <div className='flex items-center justify-between space-x-2 py-3 px-5'>
        <p>CPU Usage</p>
        <p className='text-right font-semibold'>{data.transactions[0].cpu_usage_us} µs</p>
      </div>

      <div className='flex items-center justify-between space-x-2 py-3 px-5'>
        <p>NET Usage</p>
        <p className='text-right font-semibold'>{data.transactions[0].net_usage_words}</p>
      </div>

      <div className='flex items-center justify-between space-x-2 py-3 px-5'>
        <p>Memo</p>
        <p className='text-right font-semibold'>
          {data.transactions[0].trx.transaction.actions[0].data.memo || '-'}
        </p>
      </div>
    </div>
  );
}

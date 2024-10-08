'use client';

import { useState, useEffect } from 'react';
import { GameDetail } from '@/components/game-detail';
import { GameDetailComment } from '@/components/game-detail-comment';
import { GameDetailVote } from '@/components/game-detail-vote';
import { Badge } from '@/components/ui/badge';
import { useReadContract } from 'wagmi';
import WNW_ABI from '@/abi/IWNW.abi';
import { useSearchParams } from 'next/navigation';
import { tokenInfos } from '@/constants';
import Head from 'next/head';

export default function Page() {
  const [gameTitle, setGameTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [category, setCategory] = useState('');
  const WNW_PRECOMPILE_ADDRESS = '0x8b6eC36dB2Cc17D3b16D52DdA334238F24EE7Ed6';
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const url = 'https://bnb-wnw.online/';
  const text = `ADF referral share ${url}`;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);

  const shareTwitter = () => {
    const via = 'Wise and Weird';
    const hashtags = 'Prediction,Price,BNB,BSC';
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&via=${via}&hashtags=${hashtags}`;
    window.open(shareUrl, '_blank');
  };

  const { data: game }: any = useReadContract({
    address: WNW_PRECOMPILE_ADDRESS,
    abi: WNW_ABI,
    functionName: 'getGame',
    args: [key]
  });

  useEffect(() => {
    if (game) {
      setGameTitle(game.gameTitle);
      setCategory(game.category);

      const milliseconds = Number(game.startDate);
      const date = new Date(milliseconds);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}.${month}.${day}`;
      setEventDate(formattedDate);

      const tokenInfo = tokenInfos.find(
        (item) => item.id === Number(game.gameId)
      );
      setTokenName(tokenInfo?.name ?? 'Token Name');

      const updateTimer = () => {
        const endDate = Number(game.endDate);
        const now = Date.now();
        const timeDiff = endDate - now;

        if (timeDiff > 0) {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

          const timeString =
            days > 0
              ? `${days}D ${hours.toString().padStart(2, '0')}:${minutes
                  .toString()
                  .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
              : `${hours.toString().padStart(2, '0')}:${minutes
                  .toString()
                  .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

          setTimeLeft(timeString);
        } else {
          setTimeLeft('Game Ended');
        }
      };

      const timerInterval = setInterval(updateTimer, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [game]);

  return (
    <div className="mt-10 max-h-screen space-y-6 overflow-y-auto p-4 md:p-8">
      <div className="flex w-4/6 justify-between">
        <h1 className="mb-5 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-3xl">
          {gameTitle || 'Loading...'}
        </h1>
        <button onClick={shareTwitter}>
          <svg
            width="25"
            height="25"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_451_295)">
              <path
                d="M15 13.4C14.3667 13.4 13.8 13.65 13.3667 14.0416L7.425 10.5833C7.46667 10.3916 7.5 10.2 7.5 9.99996C7.5 9.79996 7.46667 9.60829 7.425 9.41663L13.3 5.99163C13.75 6.40829 14.3417 6.66663 15 6.66663C16.3833 6.66663 17.5 5.54996 17.5 4.16663C17.5 2.78329 16.3833 1.66663 15 1.66663C13.6167 1.66663 12.5 2.78329 12.5 4.16663C12.5 4.36663 12.5333 4.55829 12.575 4.74996L6.7 8.17496C6.25 7.75829 5.65833 7.49996 5 7.49996C3.61667 7.49996 2.5 8.61663 2.5 9.99996C2.5 11.3833 3.61667 12.5 5 12.5C5.65833 12.5 6.25 12.2416 6.7 11.825L12.6333 15.2916C12.5917 15.4666 12.5667 15.65 12.5667 15.8333C12.5667 17.175 13.6583 18.2666 15 18.2666C16.3417 18.2666 17.4333 17.175 17.4333 15.8333C17.4333 14.4916 16.3417 13.4 15 13.4ZM15 3.33329C15.4583 3.33329 15.8333 3.70829 15.8333 4.16663C15.8333 4.62496 15.4583 4.99996 15 4.99996C14.5417 4.99996 14.1667 4.62496 14.1667 4.16663C14.1667 3.70829 14.5417 3.33329 15 3.33329ZM5 10.8333C4.54167 10.8333 4.16667 10.4583 4.16667 9.99996C4.16667 9.54163 4.54167 9.16663 5 9.16663C5.45833 9.16663 5.83333 9.54163 5.83333 9.99996C5.83333 10.4583 5.45833 10.8333 5 10.8333ZM15 16.6833C14.5417 16.6833 14.1667 16.3083 14.1667 15.85C14.1667 15.3916 14.5417 15.0166 15 15.0166C15.4583 15.0166 15.8333 15.3916 15.8333 15.85C15.8333 16.3083 15.4583 16.6833 15 16.6833Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_451_295">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      <div className="flex space-x-6">
        <Badge className="text-F7F8F8 rounded-3xl bg-[#575757] p-1.5 px-5 text-xs">
          {tokenName}
        </Badge>
        <Badge className="text-F7F8F8 rounded-3xl bg-[#575757] p-1.5 px-5 text-xs">
          {!game?.isEnded ? `Ends in ${timeLeft}` : 'End'}
        </Badge>
        <Badge className="text-F7F8F8 rounded-3xl bg-[#575757] p-1.5 px-5 text-xs">
          Event Date: {eventDate}
        </Badge>
        <Badge className="text-F7F8F8 rounded-3xl bg-[#575757] p-1.5 px-5 text-xs">
          {game?.category || 'Loading...'}
        </Badge>
      </div>

      <div className="flex h-full space-x-8">
        <div className="h-full w-2/3 space-y-20 overflow-y-auto pr-2">
          <GameDetail />
          <GameDetailComment />
        </div>

        <div className="h-full w-1/3 space-y-4 overflow-y-auto pl-2">
          <GameDetailVote />
        </div>
      </div>
    </div>
  );
}

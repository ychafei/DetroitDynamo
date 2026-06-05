import React from 'react';
import { Outlet } from 'react-router-dom';
import DetroitDynamoHeader from './DetroitDynamoHeader';
import DetroitDynamoFooter from './DetroitDynamoFooter';
import useDetroitDynamoMeta from './useDetroitDynamoMeta';

export default function DetroitDynamoLayout() {
  useDetroitDynamoMeta();

  return (
    <div className="dynamo-site min-h-screen overflow-x-hidden text-white">
      <DetroitDynamoHeader />
      <main>
        <Outlet />
      </main>
      <DetroitDynamoFooter />
    </div>
  );
}

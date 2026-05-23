import React, { useEffect } from 'react';
import DetroitDynamoPreview from '@/components/rebrand/DetroitDynamoPreview';

export default function DetroitDynamoPreviewPage() {
  useEffect(() => {
    const previousTitle = document.title;
    const existingRobots = document.querySelector('meta[name="robots"]');
    const previousRobotsContent = existingRobots?.getAttribute('content');
    const robotsMeta = existingRobots || document.createElement('meta');

    document.title = 'Detroit Dynamo Rebrand Preview | LC Training';
    robotsMeta.setAttribute('name', 'robots');
    robotsMeta.setAttribute('content', 'noindex,nofollow');

    if (!existingRobots) {
      robotsMeta.setAttribute('data-detroit-dynamo-preview', 'true');
      document.head.appendChild(robotsMeta);
    }

    return () => {
      document.title = previousTitle;

      if (!existingRobots) {
        robotsMeta.remove();
        return;
      }

      if (previousRobotsContent === null) {
        existingRobots.removeAttribute('content');
      } else {
        existingRobots.setAttribute('content', previousRobotsContent);
      }
    };
  }, []);

  return <DetroitDynamoPreview />;
}

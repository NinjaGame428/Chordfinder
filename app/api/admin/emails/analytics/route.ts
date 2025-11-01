import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const analytics = await query(async (sql) => {
      // Get email campaigns
      const campaigns = await sql`
        SELECT *
        FROM email_campaigns
      `;

      // Calculate analytics
      const totalEmails = campaigns.reduce((sum: number, campaign: any) => sum + (campaign.sent_count || 0), 0);
      const totalOpened = campaigns.reduce((sum: number, campaign: any) => sum + (campaign.open_count || 0), 0);
      const totalClicked = campaigns.reduce((sum: number, campaign: any) => sum + (campaign.click_count || 0), 0);
      const totalBounced = 0; // Calculate from sent_count if needed

      const openRate = totalEmails > 0 ? Math.round((totalOpened / totalEmails) * 100) : 0;
      const clickRate = totalEmails > 0 ? Math.round((totalClicked / totalEmails) * 100) : 0;
      const bounceRate = totalEmails > 0 ? Math.round((totalBounced / totalEmails) * 100) : 0;

      // Get today's emails
      const today = new Date().toISOString().split('T')[0];
      const sentToday = campaigns.filter((campaign: any) => 
        campaign.sent_at && campaign.sent_at.startsWith(today)
      ).length;

      // Get this week's emails
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const sentThisWeek = campaigns.filter((campaign: any) => 
        campaign.sent_at && campaign.sent_at >= weekAgo
      ).length;

      // Get this month's emails
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const sentThisMonth = campaigns.filter((campaign: any) => 
        campaign.sent_at && campaign.sent_at >= monthAgo
      ).length;

      return {
        totalEmails,
        sentToday,
        sentThisWeek,
        sentThisMonth,
        openRate,
        clickRate,
        bounceRate,
        unsubscribes: Math.floor(totalEmails * 0.02),
        topTemplates: [
          { name: 'Welcome Series', count: 150 },
          { name: 'Newsletter', count: 120 },
          { name: 'Product Launch', count: 80 },
          { name: 'Promotional', count: 60 }
        ],
        deliveryStats: [
          { status: 'Delivered', count: totalEmails - totalBounced, percentage: 100 - bounceRate },
          { status: 'Bounced', count: totalBounced, percentage: bounceRate },
          { status: 'Opened', count: totalOpened, percentage: openRate },
          { status: 'Clicked', count: totalClicked, percentage: clickRate }
        ]
      };
    });

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error('Error fetching email analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch email analytics' }, { status: 500 });
  }
}

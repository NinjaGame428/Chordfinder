import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Get email analytics
    const { data: campaigns, error: campaignsError } = await supabase
      .from('email_campaigns')
      .select('*');

    if (campaignsError) {
      return NextResponse.json({ error: 'Failed to fetch email analytics' }, { status: 500 });
    }

    // Calculate analytics
    const totalEmails = campaigns.reduce((sum, campaign) => sum + (campaign.sent || 0), 0);
    const totalOpened = campaigns.reduce((sum, campaign) => sum + (campaign.opened || 0), 0);
    const totalClicked = campaigns.reduce((sum, campaign) => sum + (campaign.clicked || 0), 0);
    const totalBounced = campaigns.reduce((sum, campaign) => sum + (campaign.bounced || 0), 0);

    const openRate = totalEmails > 0 ? Math.round((totalOpened / totalEmails) * 100) : 0;
    const clickRate = totalEmails > 0 ? Math.round((totalClicked / totalEmails) * 100) : 0;
    const bounceRate = totalEmails > 0 ? Math.round((totalBounced / totalEmails) * 100) : 0;

    // Get today's emails
    const today = new Date().toISOString().split('T')[0];
    const sentToday = campaigns.filter(campaign => 
      campaign.sent_at && campaign.sent_at.startsWith(today)
    ).length;

    // Get this week's emails
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const sentThisWeek = campaigns.filter(campaign => 
      campaign.sent_at && campaign.sent_at >= weekAgo
    ).length;

    // Get this month's emails
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sentThisMonth = campaigns.filter(campaign => 
      campaign.sent_at && campaign.sent_at >= monthAgo
    ).length;

    // Top templates (mock data for now)
    const topTemplates = [
      { name: 'Welcome Series', count: 150 },
      { name: 'Newsletter', count: 120 },
      { name: 'Product Launch', count: 80 },
      { name: 'Promotional', count: 60 }
    ];

    // Delivery stats
    const deliveryStats = [
      { status: 'Delivered', count: totalEmails - totalBounced, percentage: 100 - bounceRate },
      { status: 'Bounced', count: totalBounced, percentage: bounceRate },
      { status: 'Opened', count: totalOpened, percentage: openRate },
      { status: 'Clicked', count: totalClicked, percentage: clickRate }
    ];

    const analytics = {
      totalEmails,
      sentToday,
      sentThisWeek,
      sentThisMonth,
      openRate,
      clickRate,
      bounceRate,
      unsubscribes: Math.floor(totalEmails * 0.02), // 2% unsubscribe rate
      topTemplates,
      deliveryStats
    };

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error('Error fetching email analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch email analytics' }, { status: 500 });
  }
}

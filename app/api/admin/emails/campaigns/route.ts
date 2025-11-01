import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const campaigns = await query(async (sql) => {
      const results = await sql`
        SELECT *
        FROM email_campaigns
        ORDER BY created_at DESC
      `;
      return results;
    });

    return NextResponse.json({ campaigns }, { status: 200 });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subject, content, recipients, scheduledFor } = body;

    const campaign = await query(async (sql) => {
      const [result] = await sql`
        INSERT INTO email_campaigns (
          name,
          subject,
          body,
          recipient_type,
          recipient_ids,
          status,
          scheduled_at,
          created_at,
          updated_at
        ) VALUES (
          ${name},
          ${subject},
          ${content},
          ${recipients?.type || 'all'},
          ${recipients?.ids ? recipients.ids : null},
          'draft',
          ${scheduledFor || null},
          NOW(),
          NOW()
        )
        RETURNING *
      `;
      return result;
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ 
      error: 'Failed to create campaign',
      details: error.message
    }, { status: 500 });
  }
}

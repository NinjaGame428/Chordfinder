import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Initialize with empty arrays
    let templates = [];
    let campaigns = [];

    // Try to fetch email templates
    try {
      const { data: templatesData, error: templatesError } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (!templatesError && templatesData) {
        templates = templatesData;
      }
    } catch (error) {
      console.log('Email templates table not found or empty');
    }

    // Try to fetch email campaigns
    try {
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (!campaignsError && campaignsData) {
        campaigns = campaignsData;
      }
    } catch (error) {
      console.log('Email campaigns table not found or empty');
    }

    return NextResponse.json({ templates, campaigns });
  } catch (error) {
    console.error('Error in GET /api/admin/emails:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const body = await request.json();
    const { type, data } = body;

    if (type === 'template') {
      const { data: template, error } = await supabase
        .from('email_templates')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Error creating template:', error);
        return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
      }

      return NextResponse.json({ template });
    }

    if (type === 'campaign') {
      const { data: campaign, error } = await supabase
        .from('email_campaigns')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Error creating campaign:', error);
        return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
      }

      return NextResponse.json({ campaign });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error in POST /api/admin/emails:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const body = await request.json();
    const { type, id, data } = body;

    if (type === 'template') {
      const { data: template, error } = await supabase
        .from('email_templates')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating template:', error);
        return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
      }

      return NextResponse.json({ template });
    }

    if (type === 'campaign') {
      const { data: campaign, error } = await supabase
        .from('email_campaigns')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating campaign:', error);
        return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
      }

      return NextResponse.json({ campaign });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error in PUT /api/admin/emails:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

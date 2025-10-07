'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Send, 
  RefreshCw,
  Users,
  Calendar,
  Eye,
  Copy
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: string;
  created_at: string;
  updated_at: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  template_id: string;
  status: string;
  recipients: number;
  sent: number;
  created_at: string;
  scheduled_at?: string;
}

export default function AdminEmails() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [emailsLoading, setEmailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmailData = async () => {
    try {
      setEmailsLoading(true);
      const response = await fetch('/api/admin/emails');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
        setCampaigns(data.campaigns || []);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(`Failed to fetch email data: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching email data:', error);
      setError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setEmailsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailData();
  }, []);

  const handleCreateTemplate = () => {
    // TODO: Implement template creation
    console.log('Create template clicked');
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    // TODO: Implement template editing
    console.log('Edit template:', template);
  };

  const handleDeleteTemplate = (templateId: string) => {
    // TODO: Implement template deletion
    console.log('Delete template:', templateId);
  };

  const handleCreateCampaign = () => {
    // TODO: Implement campaign creation
    console.log('Create campaign clicked');
  };

  const handleEditCampaign = (campaign: EmailCampaign) => {
    // TODO: Implement campaign editing
    console.log('Edit campaign:', campaign);
  };

  const handleSendCampaign = (campaignId: string) => {
    // TODO: Implement campaign sending
    console.log('Send campaign:', campaignId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Management</h1>
          <p className="text-muted-foreground">
            Manage email templates and campaigns for your users
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
          <Button onClick={handleCreateCampaign} variant="outline">
            <Send className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
          <Button onClick={fetchEmailData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Email Templates ({templates.length})</CardTitle>
              <CardDescription>
                Create and manage email templates for your campaigns
              </CardDescription>
            </div>
            <Button onClick={handleCreateTemplate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {emailsLoading ? (
            <div className="text-center py-8">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">No templates found</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first email template to get started with email campaigns.
              </p>
              <Button onClick={handleCreateTemplate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.subject}</CardDescription>
                      </div>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {template.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(template.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Email Campaigns ({campaigns.length})</CardTitle>
              <CardDescription>
                Manage and track your email campaigns
              </CardDescription>
            </div>
            <Button onClick={handleCreateCampaign} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {emailsLoading ? (
            <div className="text-center py-8">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8">
              <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">No campaigns found</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first email campaign to start reaching your users.
              </p>
              <Button onClick={handleCreateCampaign}>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Campaign</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Recipients</th>
                    <th className="text-left p-3">Sent</th>
                    <th className="text-left p-3">Scheduled</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Template ID: {campaign.template_id}
                          </p>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{campaign.recipients}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <Send className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{campaign.sent}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {campaign.scheduled_at 
                              ? new Date(campaign.scheduled_at).toLocaleDateString()
                              : 'Not scheduled'
                            }
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCampaign(campaign)}
                            title="Edit Campaign"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {campaign.status === 'draft' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendCampaign(campaign.id)}
                              title="Send Campaign"
                              className="text-green-600 hover:text-green-700"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

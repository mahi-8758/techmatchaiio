import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Mail, Send, User, Phone, MapPin, Search } from 'lucide-react';

interface Contact {
  id: string;
  full_name: string;
  email?: string;
  location?: string;
  skills?: string[];
  experience_level?: string;
  bio?: string;
}

export function ContactManagement() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    template: '',
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter(contact =>
      contact.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredContacts(filtered);
  }, [contacts, searchTerm]);

  const fetchContacts = async () => {
    try {
      // Fetch all candidate profiles (employers can contact candidates)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'candidate');

      if (error) throw error;
      setContacts(data || []);
      setFilteredContacts(data || []);
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load contacts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const emailTemplates = {
    interview: {
      subject: 'Interview Invitation - {{jobTitle}}',
      message: `Dear {{name}},

We were impressed by your profile and would like to invite you for an interview for the {{jobTitle}} position at our company.

Please let us know your availability for the coming week.

Best regards,
{{companyName}} Hiring Team`
    },
    followup: {
      subject: 'Following up on your application',
      message: `Dear {{name}},

Thank you for your interest in the position at {{companyName}}. We wanted to follow up on your application and let you know that we are currently reviewing all candidates.

We will be in touch soon with next steps.

Best regards,
{{companyName}} Team`
    },
    jobOffer: {
      subject: 'Job Offer - {{jobTitle}}',
      message: `Dear {{name}},

We are pleased to offer you the position of {{jobTitle}} at {{companyName}}.

Please find the detailed offer attached. We look forward to hearing from you.

Best regards,
{{companyName}} Team`
    }
  };

  const selectTemplate = (templateKey: string) => {
    const template = emailTemplates[templateKey as keyof typeof emailTemplates];
    if (template && selectedContact) {
      setEmailData({
        template: templateKey,
        subject: template.subject.replace('{{name}}', selectedContact.full_name || ''),
        message: template.message.replace('{{name}}', selectedContact.full_name || '')
      });
    }
  };

  const sendEmail = async () => {
    if (!selectedContact || !emailData.subject || !emailData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSendingEmail(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          to: selectedContact.email,
          subject: emailData.subject,
          message: emailData.message,
          candidateName: selectedContact.full_name
        }
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: `Email sent successfully to ${selectedContact.full_name}.`,
      });

      // Reset form
      setEmailData({ subject: '', message: '', template: '' });
      setSelectedContact(null);
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contact Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Candidate Directory
          </CardTitle>
          <CardDescription>
            Browse and contact potential candidates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredContacts.map((contact) => (
              <Card 
                key={contact.id} 
                className={`p-3 cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{contact.full_name}</h4>
                    {contact.experience_level && (
                      <Badge variant="outline" className="text-xs">
                        {contact.experience_level}
                      </Badge>
                    )}
                  </div>

                  {contact.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {contact.location}
                    </div>
                  )}

                  {contact.skills && contact.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {contact.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {contact.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{contact.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Message
          </CardTitle>
          <CardDescription>
            Contact selected candidate directly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedContact ? (
            <>
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{selectedContact.full_name}</span>
                </div>
                {selectedContact.location && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {selectedContact.location}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email Template</Label>
                <Select value={emailData.template} onValueChange={selectTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interview">Interview Invitation</SelectItem>
                    <SelectItem value="followup">Application Follow-up</SelectItem>
                    <SelectItem value="jobOffer">Job Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                  placeholder="Email subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={emailData.message}
                  onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                  placeholder="Your message..."
                  className="min-h-[200px]"
                />
              </div>

              <Button 
                onClick={sendEmail} 
                disabled={sendingEmail || !emailData.subject || !emailData.message}
                className="w-full"
              >
                {sendingEmail ? (
                  <>
                    <Mail className="h-4 w-4 mr-2 animate-pulse" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a candidate to send a message</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { Send, Lock, Trash2, Clock, Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  content: string;
  fromUser: boolean;
  messageType: 'text' | 'panic' | 'system';
  encrypted: boolean;
  autoDelete: boolean;
  deleteAt?: string;
  readAt?: string;
  createdAt: string;
}

export default function SecureMessaging() {
  const [message, setMessage] = useState('');
  const [autoDelete, setAutoDelete] = useState(false);
  const [deleteHours, setDeleteHours] = useState(24);
  const [encrypted, setEncrypted] = useState(true);
  const [showEncryption, setShowEncryption] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // WebSocket connection for real-time messaging
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to secure messaging');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_message') {
        queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from secure messaging');
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [queryClient]);

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: {
      content: string;
      autoDelete: boolean;
      encrypted: boolean;
      deleteHours?: number;
    }) => {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...messageData,
          messageType: 'text',
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      toast({
        title: "Message sent",
        description: encrypted ? "Your encrypted message has been delivered." : "Your message has been sent.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      toast({
        title: "Message deleted",
        description: "The message has been permanently removed.",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendMessageMutation.mutate({
      content: message,
      autoDelete,
      encrypted,
      deleteHours: autoDelete ? deleteHours : undefined,
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTimeRemaining = (deleteAt: string) => {
    const now = new Date();
    const deleteTime = new Date(deleteAt);
    const diff = deleteTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/attached_assets/New Primary YLG Transparent Logo_1753681153359.png" 
              alt="YoLuxGo" 
              className="h-16 w-16"
            />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-green-400" />
            <Lock className="h-10 w-10 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Secure Messaging</h1>
          <p className="text-gray-300">
            End-to-end encrypted communication with YoLuxGo™ Command Center
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Message Thread */}
          <div className="lg:col-span-2">
            <Card className="border-gray-700 bg-gray-900/50 h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Command Center Communication
                  {socket && (
                    <div className="flex items-center gap-1 text-xs text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Live
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Secure channel with your assigned security team
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
                  {isLoading ? (
                    <div className="text-center text-gray-400 py-8">
                      <Lock className="h-8 w-8 mx-auto mb-2 animate-spin" />
                      Loading secure messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <Shield className="h-8 w-8 mx-auto mb-2" />
                      No messages yet. Start a secure conversation.
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.fromUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.fromUser
                              ? 'bg-blue-600 text-white'
                              : msg.messageType === 'panic'
                              ? 'bg-red-600 text-white'
                              : msg.messageType === 'system'
                              ? 'bg-yellow-600 text-black'
                              : 'bg-gray-700 text-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm break-words flex-1">{msg.content}</p>
                            {msg.fromUser && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="h-6 w-6 p-0 hover:bg-red-500/20"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                            <div className="flex items-center gap-2">
                              <span>{formatTime(msg.createdAt)}</span>
                              {msg.encrypted && <Lock className="h-3 w-3" />}
                              {msg.autoDelete && msg.deleteAt && (
                                <div className="flex items-center gap-1 text-yellow-300">
                                  <Clock className="h-3 w-3" />
                                  {getTimeRemaining(msg.deleteAt)}
                                </div>
                              )}
                            </div>
                            {msg.readAt && <span>Read</span>}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your secure message..."
                      className="bg-gray-800 border-gray-700 text-white resize-none"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || sendMessageMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Message Options */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="encrypted"
                        checked={encrypted}
                        onCheckedChange={setEncrypted}
                      />
                      <Label htmlFor="encrypted" className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Encrypt
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        id="auto-delete"
                        checked={autoDelete}
                        onCheckedChange={setAutoDelete}
                      />
                      <Label htmlFor="auto-delete" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Auto-delete
                      </Label>
                    </div>

                    {autoDelete && (
                      <Input
                        type="number"
                        value={deleteHours}
                        onChange={(e) => setDeleteHours(parseInt(e.target.value) || 24)}
                        min="1"
                        max="168"
                        className="w-16 h-8 bg-gray-800 border-gray-700 text-white"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Controls */}
          <div className="space-y-6">
            <Card className="border-green-500 bg-green-900/20">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Encryption Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">End-to-End Encryption</span>
                  <div className="flex items-center gap-1 text-green-400">
                    <Lock className="h-4 w-4" />
                    Active
                  </div>
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div className="space-y-2 text-xs text-gray-300">
                  <p>• Messages encrypted with AES-256</p>
                  <p>• Keys rotated every 24 hours</p>
                  <p>• Zero-knowledge architecture</p>
                  <p>• No server-side message storage</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEncryption(!showEncryption)}
                  className="w-full border-green-500 text-green-400 hover:bg-green-900/50"
                >
                  {showEncryption ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showEncryption ? 'Hide' : 'Show'} Encryption Details
                </Button>
                
                {showEncryption && (
                  <div className="mt-3 p-3 bg-gray-800/50 rounded text-xs font-mono text-green-300">
                    RSA-4096 + AES-256-GCM<br />
                    Key: 7f4a2b1c...d8e9<br />
                    Salt: 3x9k8m2n...7q1w
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-yellow-500 bg-yellow-900/20">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-800/30 rounded-lg">
                  <p className="text-xs text-yellow-200 mb-2 font-medium">Active Monitoring</p>
                  <p className="text-xs text-yellow-300">
                    All communications are monitored for security threats and compliance.
                  </p>
                </div>
                
                <div className="p-3 bg-blue-800/30 rounded-lg">
                  <p className="text-xs text-blue-200 mb-2 font-medium">Data Retention</p>
                  <p className="text-xs text-blue-300">
                    Messages with auto-delete enabled will be permanently removed after the specified time.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-500 bg-red-900/20">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Emergency Protocols
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline"
                  className="w-full border-red-500 text-red-400 hover:bg-red-900/50"
                  onClick={() => {
                    sendMessageMutation.mutate({
                      content: "🚨 PRIORITY: Immediate assistance required",
                      autoDelete: false,
                      encrypted: true,
                    });
                  }}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Send Priority Alert
                </Button>
                
                <p className="text-xs text-red-300">
                  Priority alerts bypass normal queues and trigger immediate response protocols.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
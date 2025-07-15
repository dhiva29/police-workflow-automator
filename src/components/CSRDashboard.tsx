import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Send, Phone, Clock, Building2, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CSRRequest, ProviderStats } from "@/types/csr";

// Mock data generator
const generateMockData = (): CSRRequest[] => {
  const stations = [
    "Chennai Central Police Station",
    "Coimbatore North Police Station", 
    "Madurai East Police Station",
    "Trichy West Police Station",
    "Salem South Police Station"
  ];
  
  const providers: CSRRequest['serviceProvider'][] = ['Jio', 'Airtel', 'VI', 'BSNL'];
  
  const mockRequests: CSRRequest[] = [];
  
  for (let i = 0; i < 15; i++) {
    const station = stations[Math.floor(Math.random() * stations.length)];
    const provider = providers[Math.floor(Math.random() * providers.length)];
    const mobile = `${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 9000000) + 1000000}`;
    
    mockRequests.push({
      id: `CSR-${Date.now()}-${i}`,
      policeStationEmail: `${station.toLowerCase().replace(/\s+/g, '.')}@tnpolice.gov.in`,
      policeStationName: station,
      mobileNumber: mobile,
      serviceProvider: provider,
      status: Math.random() > 0.3 ? 'Request Received' : 'Response Received',
      timestamps: {
        received: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      },
      referenceId: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      providerResponse: Math.random() > 0.7 ? "Subscriber details: Name: John Doe, Address: Chennai, Last activity: 2024-01-15" : undefined
    });
  }
  
  return mockRequests;
};

export const CSRDashboard = () => {
  const [requests, setRequests] = useState<CSRRequest[]>([]);
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  useEffect(() => {
    setRequests(generateMockData());
  }, []);

  const groupedRequests = requests.reduce((acc, request) => {
    if (request.status === 'Request Received') {
      const existing = acc.find(p => p.provider === request.serviceProvider);
      if (existing) {
        existing.requests.push(request);
        existing.pendingCount++;
      } else {
        acc.push({
          provider: request.serviceProvider,
          pendingCount: 1,
          requests: [request]
        });
      }
    }
    return acc;
  }, [] as ProviderStats[]);

  const handleSendToProvider = async (provider: string) => {
    setIsLoading(prev => ({ ...prev, [provider]: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setRequests(prev => 
      prev.map(req => 
        req.serviceProvider === provider && req.status === 'Request Received'
          ? { 
              ...req, 
              status: 'Sent to Provider' as const,
              timestamps: { 
                ...req.timestamps, 
                sentToProvider: new Date().toISOString() 
              }
            }
          : req
      )
    );
    
    setIsLoading(prev => ({ ...prev, [provider]: false }));
    
    toast({
      title: "Requests Sent",
      description: `All pending requests have been consolidated and sent to ${provider}`,
    });
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'Jio': return <Wifi className="w-5 h-5" />;
      case 'Airtel': return <Phone className="w-5 h-5" />;
      case 'VI': return <Building2 className="w-5 h-5" />;
      case 'BSNL': return <Wifi className="w-5 h-5" />;
      default: return <Phone className="w-5 h-5" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'Jio': return 'bg-blue-500';
      case 'Airtel': return 'bg-red-500';
      case 'VI': return 'bg-purple-500';
      case 'BSNL': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">CSR Dashboard</h2>
          <p className="text-muted-foreground">Manage Customer Service Requests</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {requests.filter(r => r.status === 'Request Received').length} Pending
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {groupedRequests.map((stats) => (
          <Card key={stats.provider} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 ${getProviderColor(stats.provider)}`} />
            
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getProviderIcon(stats.provider)}
                  {stats.provider}
                </CardTitle>
                <Badge variant="secondary">
                  {stats.pendingCount} pending
                </Badge>
              </div>
              <CardDescription>
                CSR requests ready for dispatch
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {stats.requests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                    <span className="font-mono">{request.mobileNumber}</span>
                    <span className="text-xs text-muted-foreground">
                      {request.policeStationName.split(' ')[0]}
                    </span>
                  </div>
                ))}
                {stats.requests.length > 5 && (
                  <div className="text-xs text-muted-foreground text-center py-1">
                    +{stats.requests.length - 5} more
                  </div>
                )}
              </div>

              <Separator />

              <Button 
                variant="police"
                className="w-full"
                onClick={() => handleSendToProvider(stats.provider)}
                disabled={isLoading[stats.provider] || stats.pendingCount === 0}
              >
                {isLoading[stats.provider] ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send to {stats.provider}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {groupedRequests.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground">
              <Phone className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
              <p>All CSR requests have been processed or are awaiting responses.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
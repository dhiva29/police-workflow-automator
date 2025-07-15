import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Forward, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CSRRequest } from "@/types/csr";

export const ResponseHandler = () => {
  const [requests, setRequests] = useState<CSRRequest[]>([]);
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  const [selectedResponse, setSelectedResponse] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Generate mock data for responses received
    const mockResponses: CSRRequest[] = [
      {
        id: "CSR-001",
        policeStationEmail: "chennai.central@tnpolice.gov.in",
        policeStationName: "Chennai Central Police Station",
        mobileNumber: "9876543210",
        serviceProvider: "Jio",
        status: "Response Received",
        timestamps: {
          received: "2024-01-15T09:00:00Z",
          sentToProvider: "2024-01-15T10:30:00Z",
          responseReceived: "2024-01-15T14:45:00Z"
        },
        referenceId: "REF-JIO-001",
        providerResponse: "Subscriber Details:\nName: Rajesh Kumar\nAddress: No. 45, Anna Nagar, Chennai - 600040\nConnection Date: 15-Mar-2023\nLast Activity: 14-Jan-2024 18:30 hrs\nTower Location: Anna Nagar East\nCall Records: Available for last 6 months\nStatus: Active"
      },
      {
        id: "CSR-002", 
        policeStationEmail: "coimbatore.north@tnpolice.gov.in",
        policeStationName: "Coimbatore North Police Station",
        mobileNumber: "8765432109",
        serviceProvider: "Airtel",
        status: "Response Received",
        timestamps: {
          received: "2024-01-15T11:15:00Z",
          sentToProvider: "2024-01-15T12:00:00Z",
          responseReceived: "2024-01-15T16:20:00Z"
        },
        referenceId: "REF-AIR-002",
        providerResponse: "Subscriber Information:\nName: Priya Sharma\nAddress: Plot 23, RS Puram, Coimbatore - 641002\nActivation: 28-Aug-2022\nLast Location: Race Course Road Tower\nData Usage: 2.5 GB (Last 24 hrs)\nCall Summary: 45 calls in last week\nAccount Status: Active - Postpaid"
      },
      {
        id: "CSR-003",
        policeStationEmail: "madurai.east@tnpolice.gov.in", 
        policeStationName: "Madurai East Police Station",
        mobileNumber: "7654321098",
        serviceProvider: "VI",
        status: "Response Received",
        timestamps: {
          received: "2024-01-14T15:30:00Z",
          sentToProvider: "2024-01-14T16:15:00Z",
          responseReceived: "2024-01-15T10:45:00Z"
        },
        referenceId: "REF-VI-003",
        providerResponse: "Customer Data:\nName: Mohammed Ali\nAddress: 12/A, Meenakshi Nagar, Madurai - 625001\nSIM Issue Date: 05-Dec-2023\nLast Known Location: Madurai Junction\nRecent Activity: Voice calls - 12, SMS - 5 (Last 24 hrs)\nNetwork Type: 4G\nSubscription: Prepaid Plan ₹199"
      }
    ];
    setRequests(mockResponses);
  }, []);

  const handleForwardResponse = async (requestId: string) => {
    setIsLoading(prev => ({ ...prev, [requestId]: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId
          ? { 
              ...req, 
              status: 'Completed' as const,
              timestamps: { 
                ...req.timestamps, 
                forwarded: new Date().toISOString() 
              }
            }
          : req
      ).filter(req => req.status !== 'Completed')
    );
    
    setIsLoading(prev => ({ ...prev, [requestId]: false }));
    
    toast({
      title: "Response Forwarded",
      description: "The response has been sent back to the requesting police station",
    });
  };

  const getStatusBadge = (status: CSRRequest['status']) => {
    switch (status) {
      case 'Response Received':
        return (
          <Badge variant="outline" className="border-warning text-warning">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'Completed':
        return (
          <Badge variant="outline" className="border-success text-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Response Handler</h2>
          <p className="text-muted-foreground">Review and forward provider responses</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          {requests.filter(r => r.status === 'Response Received').length} Awaiting Action
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Provider Responses</CardTitle>
          <CardDescription>
            Responses received from telecom providers requiring review and forwarding
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference ID</TableHead>
                  <TableHead>Mobile Number</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Police Station</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-mono text-sm">
                      {request.referenceId}
                    </TableCell>
                    <TableCell className="font-mono">
                      {request.mobileNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.serviceProvider}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {request.policeStationName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {request.timestamps.responseReceived && 
                        formatTimestamp(request.timestamps.responseReceived)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedResponse(request.providerResponse || "")}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Provider Response - {request.referenceId}</DialogTitle>
                              <DialogDescription>
                                Response from {request.serviceProvider} for mobile number {request.mobileNumber}
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-96 w-full rounded border p-4">
                              <pre className="text-sm whitespace-pre-wrap">
                                {request.providerResponse}
                              </pre>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>

                        <Button 
                          variant="success"
                          size="sm"
                          onClick={() => handleForwardResponse(request.id)}
                          disabled={isLoading[request.id]}
                        >
                          {isLoading[request.id] ? (
                            <>Forwarding...</>
                          ) : (
                            <>
                              <Forward className="w-4 h-4 mr-1" />
                              Forward
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Pending Responses</h3>
                <p>All provider responses have been reviewed and forwarded.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
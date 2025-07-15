export interface CSRRequest {
  id: string;
  policeStationEmail: string;
  policeStationName: string;
  mobileNumber: string;
  serviceProvider: 'Jio' | 'Airtel' | 'VI' | 'BSNL';
  status: 'Request Received' | 'Sent to Provider' | 'Response Received' | 'Completed';
  timestamps: {
    received: string;
    sentToProvider?: string;
    responseReceived?: string;
    forwarded?: string;
  };
  providerResponse?: string;
  referenceId: string;
}

export interface ProviderStats {
  provider: string;
  pendingCount: number;
  requests: CSRRequest[];
}
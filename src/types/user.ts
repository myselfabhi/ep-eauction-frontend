export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Viewer' | 'Supplier';
  isVerified: boolean;
  profile?: {
    companyName?: string;
    registrationNumber?: string;
    taxId?: string;
    address?: string;
    coreCapabilities?: string;
    portOfLoading?: string;
    containerCapacity?: number;
    importDutiesInfo?: string;
  };
  businessDocs?: string[];
  createdAt: string;
}

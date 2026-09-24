export interface GeneralSettings {
  platformName: string;
  description: string;
  siteUrl: string;
  contactEmail: string;
  phone: string;
  address: string;
  timezone: string;
}

export interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  color: string;
}

export interface PaymentSettings {
  methods: PaymentMethodConfig[];
  commissionRate: number;
  minWithdrawal: number;
  withdrawalDelay: number;
}

export interface NotificationChannel {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface NotificationSettings {
  channels: NotificationChannel[];
  adminEmail: string;
  reportFrequency: "daily" | "weekly" | "monthly";
}

export interface ServiceStatus {
  id: string;
  label: string;
  status: "OPERATIONAL" | "DEGRADED" | "DOWN";
}
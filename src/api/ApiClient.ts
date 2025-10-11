// src/api/ApiClient.ts
import type { VersionInfo } from '../types/api';

export interface IApiClient {
  getVersion(): Promise<VersionInfo>;
}

export class ApiClient implements IApiClient {
  private baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  async getVersion(): Promise<VersionInfo> {
    const res = await fetch(`${this.baseUrl}/version`);
    if (!res.ok) throw new Error('Failed to fetch API version');
    return res.json();
  }
}

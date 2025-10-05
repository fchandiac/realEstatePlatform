import { Injectable } from '@nestjs/common';

@Injectable()
export class JoseWrapperService {
  private jose: any = null;

  async getJose(): Promise<any> {
    if (!this.jose) {
      try {
        this.jose = await import('jose');
      } catch (error) {
        throw new Error(`Failed to load jose library: ${error.message}`);
      }
    }
    return this.jose;
  }

  // For testing purposes - allows mocking
  setJose(mockJose: any): void {
    this.jose = mockJose;
  }
}
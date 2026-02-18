import axios from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private readonly axiosInstance = axios.create();

  async get<T>(url: string): Promise<T> {
    const { data } = await this.axiosInstance.get<T>(url);
    return data;
  }
}

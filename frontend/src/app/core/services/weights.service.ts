import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Weight {
  id: number;
  weight: number;
  date: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface WeightEntry {
  weight: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeightsService {
  private apiUrl = `${environment.apiUrl}/weights`;

  constructor(private http: HttpClient) {}

  // Create or update weight
  upsertWeight(entry: WeightEntry): Observable<Weight> {
    return this.http.post<Weight>(this.apiUrl, entry);
  }

  // Get weight for specific date
  getWeightByDate(date: string): Observable<Weight> {
    return this.http.get<Weight>(`${this.apiUrl}/date/${date}`);
  }

  // Get weights for date range
  getWeightsByRange(startDate: string, endDate: string): Observable<Weight[]> {
    return this.http.get<Weight[]>(`${this.apiUrl}?startDate=${startDate}&endDate=${endDate}`);
  }

  // Get all weights
  getAllWeights(): Observable<Weight[]> {
    return this.http.get<Weight[]>(this.apiUrl);
  }

  // Update weight
  updateWeight(id: number, weight: number): Observable<Weight> {
    return this.http.put<Weight>(`${this.apiUrl}/${id}`, { weight });
  }

  // Delete weight
  deleteWeight(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Delete weight by date
  deleteWeightByDate(date: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/date/${date}`);
  }
}

import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { OfflineService } from '../services/offline.service';
import { of, throwError } from 'rxjs';

export const offlineInterceptor: HttpInterceptorFn = (req, next) => {
    const offlineService = inject(OfflineService);

    if (!offlineService.isOfflineMode()) {
        return next(req);
    }

    // Handle Offline Mode API Mocks
    const url = req.url;
    const method = req.method;

    try {
        if (url.includes('/auth/login') || url.includes('/auth/register')) {
            const user = { id: 0, email: 'offline@localhost', name: 'Offline User' };
            return of(new HttpResponse({ status: 200, body: { access_token: 'offline-token', user } }));
        }

        if (url.includes('/habits')) {
            if (method === 'GET') {
                if (url.includes('/habits/today')) {
                    const params = new URL(req.urlWithParams).searchParams;
                    const date = params.get('date') || new Date().toISOString().split('T')[0];
                    return of(new HttpResponse({ status: 200, body: offlineService.getTodayHabits(date) }));
                }
                if (url.match(/\/habits\/\d+$/)) {
                    const id = parseInt(url.split('/').pop()!, 10);
                    return of(new HttpResponse({ status: 200, body: offlineService.getHabit(id) }));
                }
                return of(new HttpResponse({ status: 200, body: offlineService.getHabits() }));
            }
            if (method === 'POST') {
                return of(new HttpResponse({ status: 201, body: offlineService.createHabit(req.body) }));
            }
            if (method === 'PUT') {
                const id = parseInt(url.split('/').pop()!, 10);
                return of(new HttpResponse({ status: 200, body: offlineService.updateHabit(id, req.body) }));
            }
            if (method === 'DELETE') {
                const id = parseInt(url.split('/').pop()!, 10);
                offlineService.deleteHabit(id);
                return of(new HttpResponse({ status: 200, body: {} }));
            }
        }

        if (url.includes('/completions')) {
            if (url.includes('/completions/toggle/')) {
                const urlObj = new URL(req.urlWithParams);
                const params = urlObj.searchParams;
                const date = params.get('date') || new Date().toISOString().split('T')[0];
                // url is something like http://.../api/completions/toggle/123
                const parts = urlObj.pathname.split('/');
                const habitId = parseInt(parts[parts.length - 1], 10);
                return of(new HttpResponse({ status: 201, body: offlineService.toggleCompletion(habitId, date) }));
            }
            if (url.includes('/completions/history/')) {
                const urlObj = new URL(req.urlWithParams);
                const params = urlObj.searchParams;
                const days = parseInt(params.get('days') || '30', 10);
                const parts = urlObj.pathname.split('/');
                const habitId = parseInt(parts[parts.length - 1], 10);
                return of(new HttpResponse({ status: 200, body: offlineService.getHistory(habitId, days) }));
            }
            if (url.includes('/completions/stats/month')) {
                const params = new URL(req.urlWithParams).searchParams;
                const year = parseInt(params.get('year')!, 10);
                const month = parseInt(params.get('month')!, 10);
                return of(new HttpResponse({ status: 200, body: offlineService.getMonthStats(year, month) }));
            }
        }

        if (url.includes('/weights')) {
            if (method === 'GET') {
                if (url.includes('/weights/date/')) {
                    const date = url.split('/').pop()!;
                    return of(new HttpResponse({ status: 200, body: offlineService.getWeightByDate(date) }));
                }
                const params = new URL(req.urlWithParams).searchParams;
                const startDate = params.get('startDate');
                const endDate = params.get('endDate');
                if (startDate && endDate) {
                    return of(new HttpResponse({ status: 200, body: offlineService.getWeightsBetween(startDate, endDate) }));
                }
                return of(new HttpResponse({ status: 200, body: offlineService.getWeights() }));
            }
            if (method === 'POST') {
                return of(new HttpResponse({ status: 201, body: offlineService.createWeight(req.body) }));
            }
            if (method === 'PUT') {
                const id = parseInt(url.split('/').pop()!, 10);
                return of(new HttpResponse({ status: 200, body: offlineService.updateWeight(id, req.body) }));
            }
            if (method === 'DELETE') {
                if (url.includes('/weights/date/')) {
                    const date = url.split('/').pop()!;
                    offlineService.deleteWeightByDate(date);
                } else {
                    const id = parseInt(url.split('/').pop()!, 10);
                    offlineService.deleteWeight(id);
                }
                return of(new HttpResponse({ status: 200, body: {} }));
            }
        }
    } catch (error: any) {
        return throwError(() => error);
    }

    // Fallback for unhandled offline routes
    return of(new HttpResponse({ status: 404, body: { message: 'Not found in offline mode' } }));
};

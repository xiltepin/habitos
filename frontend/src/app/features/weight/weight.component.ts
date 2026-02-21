import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeightsService, Weight } from '../../core/services/weights.service';

type TimeRange = '3days' | '7days' | '31days' | '3months' | '6months' | '1year' | '3years';

interface ChartData {
  labels: string[];
  values: number[];
  min: number;
  max: number;
  average: number;
}

@Component({
  selector: 'app-weight',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="weight-page">
      <div class="page-header">
        <h2>Weight Tracker</h2>
      </div>

      <div class="time-range-buttons">
        @for (range of timeRanges; track range.value) {
          <button
            [class.active]="selectedRange() === range.value"
            (click)="selectRange(range.value)"
          >
            {{ range.label }}
          </button>
        }
      </div>

      @if (chartData(); as data) {
        <div class="stats-summary">
          <div class="stat-item">
            <div class="stat-label">Current</div>
            <div class="stat-value">{{ data.values[data.values.length - 1] || '-' }} kg</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Average</div>
            <div class="stat-value">{{ data.average }} kg</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Min</div>
            <div class="stat-value">{{ data.min }} kg</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Max</div>
            <div class="stat-value">{{ data.max }} kg</div>
          </div>
        </div>

        <div class="card">
          @if (isLoading()) {
            <div class="loading">Loading chart...</div>
          } @else if (data.values.length === 0) {
            <div class="no-data">
              <p>No weight data for this period</p>
              <p class="hint">Click on calendar days in Stats tab to add weight entries</p>
            </div>
          } @else {
            <div class="chart-container">
              <svg class="weight-chart" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
                <g class="grid">
                  @for (i of [0, 1, 2, 3, 4]; track i) {
                    <line
                      [attr.x1]="0"
                      [attr.y1]="80 + (i * 60)"
                      [attr.x2]="1000"
                      [attr.y2]="80 + (i * 60)"
                      stroke="var(--border)"
                      stroke-width="1"
                    />
                  }
                </g>
                <path
                  [attr.d]="getLinePath(data)"
                  fill="none"
                  stroke="var(--primary)"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  [attr.d]="getAreaPath(data)"
                  [attr.fill]="'var(--primary)'"
                  opacity="0.1"
                />
                @for (point of getDataPoints(data); track $index) {
                  <circle
                    [attr.cx]="point.x"
                    [attr.cy]="point.y"
                    r="5"
                    fill="var(--primary)"
                    stroke="white"
                    stroke-width="2"
                  >
                    <title>{{ point.label }}: {{ point.value }} kg</title>
                  </circle>
                }
                <g class="x-labels">
                  @for (label of getXAxisLabels(data); track $index) {
                    <text
                      [attr.x]="label.x"
                      y="380"
                      text-anchor="middle"
                      font-size="12"
                      fill="var(--text-muted)"
                    >
                      {{ label.text }}
                    </text>
                  }
                </g>
                <g class="y-labels">
                  @for (yLabel of getYAxisLabels(data); track $index) {
                    <text
                      x="10"
                      [attr.y]="yLabel.y"
                      font-size="12"
                      fill="var(--text-muted)"
                    >
                      {{ yLabel.text }} kg
                    </text>
                  }
                </g>
              </svg>
            </div>

            @if (data.values.length > 1) {
              @if (getChange(data); as changeInfo) {
                <div class="change-indicator">
                  <span [class.positive]="changeInfo.value < 0" [class.negative]="changeInfo.value > 0">
                    {{ changeInfo.value > 0 ? '+' : '' }}{{ changeInfo.formatted }} kg
                    @if (changeInfo.value < 0) {
                      <span class="emoji">📉</span>
                    } @else if (changeInfo.value > 0) {
                      <span class="emoji">📈</span>
                    } @else {
                      <span class="emoji">➡️</span>
                    }
                  </span>
                  <span class="period">since {{ data.labels[0] }}</span>
                </div>
              }
            }
          }
        </div>
      } @else {
        <div class="card">
          @if (isLoading()) {
            <div class="loading">Loading chart...</div>
          } @else {
            <div class="no-data">
              <p>No weight data for this period</p>
              <p class="hint">Click on calendar days in Stats tab to add weight entries</p>
            </div>
          }
        </div>
      }

      @if (weights().length > 0) {
        <div class="card">
          <h3>Recent Entries</h3>
          <div class="weight-list">
            @for (weight of weights().slice(0, 10); track weight.id) {
              <div class="weight-item">
                <div class="wi-date">{{ formatDate(weight.date) }}</div>
                <div class="wi-value">{{ weight.weight }} kg</div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    '.weight-page { padding: 20px 16px; max-width: 600px; margin: 0 auto; padding-bottom: 80px; }',
    '.page-header { margin-bottom: 20px; }',
    '.page-header h2 { margin: 0; font-size: 1.4rem; }',
    '.time-range-buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 20px; }',
    '.time-range-buttons button { padding: 10px 8px; border: 1.5px solid var(--border); background: var(--surface); color: var(--text); border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }',
    '.time-range-buttons button:hover { border-color: var(--primary); background: var(--bg); }',
    '.time-range-buttons button.active { background: var(--primary); color: white; border-color: var(--primary); }',
    '.stats-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }',
    '.stat-item { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px; text-align: center; }',
    '.stat-label { font-size: 0.7rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600; }',
    '.stat-value { font-size: 1.1rem; font-weight: 700; color: var(--primary); }',
    '.card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; margin-bottom: 16px; }',
    '.card h3 { margin: 0 0 16px; font-size: 1rem; color: var(--text); }',
    '.loading, .no-data { text-align: center; padding: 40px 20px; color: var(--text-muted); }',
    '.no-data p { margin: 8px 0; }',
    '.no-data .hint { font-size: 0.85rem; opacity: 0.7; }',
    '.chart-container { width: 100%; margin-bottom: 16px; }',
    '.weight-chart { width: 100%; height: auto; }',
    '.change-indicator { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: var(--bg); border-radius: 8px; font-size: 0.9rem; }',
    '.change-indicator .positive { color: #16a34a; font-weight: 700; }',
    '.change-indicator .negative { color: #dc2626; font-weight: 700; }',
    '.change-indicator .emoji { font-size: 1.2rem; }',
    '.change-indicator .period { color: var(--text-muted); font-size: 0.85rem; }',
    '.weight-list { display: flex; flex-direction: column; gap: 8px; }',
    '.weight-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg); border-radius: 8px; }',
    '.wi-date { font-size: 0.9rem; color: var(--text); }',
    '.wi-value { font-size: 1rem; font-weight: 700; color: var(--primary); }'
  ]
})
export class WeightComponent implements OnInit {
  weights = signal<Weight[]>([]);
  selectedRange = signal<TimeRange>('31days');
  chartData = signal<ChartData | null>(null);
  isLoading = signal(false);

  timeRanges = [
    { value: '3days' as TimeRange, label: '3 Days' },
    { value: '7days' as TimeRange, label: '7 Days' },
    { value: '31days' as TimeRange, label: '31 Days' },
    { value: '3months' as TimeRange, label: '3 Months' },
    { value: '6months' as TimeRange, label: '6 Months' },
    { value: '1year' as TimeRange, label: '1 Year' },
    { value: '3years' as TimeRange, label: '3 Years' },
  ];

  constructor(private weightsService: WeightsService) {}

  ngOnInit() {
    this.loadWeights();
  }

  selectRange(range: TimeRange) {
    this.selectedRange.set(range);
    this.updateChartData();
  }

  loadWeights() {
    this.isLoading.set(true);
    this.weightsService.getAllWeights().subscribe({
      next: (weights) => {
        this.weights.set(weights);
        this.updateChartData();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load weights:', err);
        this.isLoading.set(false);
      }
    });
  }

  updateChartData() {
    const range = this.selectedRange();
    const days = this.getDaysForRange(range);
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

const filteredWeights = this.weights()
  .filter(w => {
    const wDate = new Date(w.date);
    return wDate >= startDate && wDate <= endDate;
  })
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (filteredWeights.length === 0) {
      this.chartData.set(null);
      return;
    }

    const labels = filteredWeights.map(w => this.formatChartLabel(w.date, range));
    const values = filteredWeights.map(w => w.weight);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const average = parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));

    this.chartData.set({ labels, values, min, max, average });
  }

  getDaysForRange(range: TimeRange): number {
    const daysMap: Record<TimeRange, number> = {
      '3days': 3, '7days': 7, '31days': 31,
      '3months': 90, '6months': 180, '1year': 365, '3years': 1095,
    };
    return daysMap[range];
  }

  formatChartLabel(dateStr: string, range: TimeRange): string {
    const date = new Date(dateStr);
    if (range === '3months' || range === '6months' || range === '1year' || range === '3years') {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getChange(data: ChartData): { value: number; formatted: string } | null {
    if (data.values.length < 2) return null;
    const value = data.values[data.values.length - 1] - data.values[0];
    return { value, formatted: value.toFixed(1) };
  }

  getLinePath(data: ChartData): string {
    const points = this.getDataPoints(data);
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  }

  getAreaPath(data: ChartData): string {
    const points = this.getDataPoints(data);
    if (points.length === 0) return '';
    let path = `M ${points[0].x} 320`;
    path += ` L ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    path += ` L ${points[points.length - 1].x} 320 Z`;
    return path;
  }

  getDataPoints(data: ChartData): Array<{ x: number; y: number; value: number; label: string }> {
    if (data.values.length === 0) return [];
    const minWeight = data.min - 2;
    const maxWeight = data.max + 2;
    const range = maxWeight - minWeight;
    return data.values.map((value, i) => {
      const x = 50 + (i / Math.max(1, data.values.length - 1)) * 900;
      const normalizedValue = (value - minWeight) / range;
      const y = 320 - (normalizedValue * 240);
      return { x, y, value, label: data.labels[i] };
    });
  }

  getXAxisLabels(data: ChartData): Array<{ x: number; text: string }> {
    if (data.labels.length === 0) return [];
    const maxLabels = 7;
    const step = Math.max(1, Math.floor(data.labels.length / maxLabels));
    return data.labels
      .filter((_, i) => i % step === 0 || i === data.labels.length - 1)
      .map((_, i) => {
        const originalIndex = i * step >= data.labels.length ? data.labels.length - 1 : i * step;
        const x = 50 + (originalIndex / Math.max(1, data.values.length - 1)) * 900;
        return { x, text: data.labels[originalIndex] };
      });
  }

  getYAxisLabels(data: ChartData): Array<{ y: number; text: string }> {
    if (data.values.length === 0) return [];
    const minWeight = data.min - 2;
    const maxWeight = data.max + 2;
    const range = maxWeight - minWeight;
    const step = range / 4;
    return [0, 1, 2, 3, 4].map(i => {
      const value = minWeight + (step * i);
      const y = 320 - ((i / 4) * 240);
      return { y, text: value.toFixed(1) };
    });
  }
}

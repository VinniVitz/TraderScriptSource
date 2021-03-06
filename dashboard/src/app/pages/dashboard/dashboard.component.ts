import { DashboardNotification } from './../../models/dashboard-notification.model';
import { ChartState } from './../../states/chart.state';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { Chart, registerables, ChartData } from 'chart.js';
import { InfluxConfig } from 'src/app/models/influx-config.model';
import { Color } from '@angular-material-components/color-picker';
import { ActivatedRoute } from '@angular/router';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  config: InfluxConfig;
  type = 'line';
  options = { animation: { duration: 0 } };
  panel: { name: string; expanded: boolean }[];
  rangeOptions = [
    '1m',
    '2m',
    '5m',
    '10m',
    '30m',
    '1h',
    '2h',
    '5h',
    '10h',
    '1d',
    '2d'
  ];
  intervalId: any;

  @Select(ChartState.data) data: Observable<ChartData>;
  @Select(ChartState.notifications)
  notifications: Observable<DashboardNotification[]>;

  @Emitter(ChartState.onFetchData) onFetchData: Emittable<InfluxConfig>;

  constructor(activatedRoute: ActivatedRoute) {
    this.config = activatedRoute.snapshot.data.config;
    this.panel = this.config.defs.map((def) => ({
      name: def.name,
      expanded: false
    }));
    this.intervalId = setInterval(
      () => this.onFetchData.emit(this.config),
      this.config.interval * 1000
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateColor(color: Color, name: string): void {
    this.config = { ...this.config };
    this.config.defs = this.config.defs.map((def) =>
      def.name === name ? { ...def, color } : def
    );
  }

  toggleCheckbox(name: string): void {
    this.config = { ...this.config };
    this.config.defs = this.config.defs.map((def) =>
      def.name === name ? { ...def, show: !def.show } : def
    );
  }

  setRange(range: string): void {
    this.config = { ...this.config };
    this.config.range = range;
  }

  setInterval(interval: number): void {
    this.config = { ...this.config };
    this.config.interval = interval;
  }
}

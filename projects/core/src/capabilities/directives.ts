import { Component, Input } from '@angular/core';
import { CapabilitiesService } from './service';

@Component({
  selector: '[capability-enabled]',
  template: ` @if (isEnabled) { <ng-content></ng-content> } `,
  imports: []
})
export class CapabilityEnabledComponent {
  _capabilityName!: string;
  constructor(private capabilities: CapabilitiesService) {}

  get isEnabled(): boolean {
    return this.capabilities.getCapabilityEnabled(this._capabilityName);
  }

  @Input('capability-enabled') set capabilityName(name: string) {
    this._capabilityName = name;
  }
}

@Component({
  selector: '[capability-disabled]',
  template: ` @if (isDisabled) { <ng-content></ng-content> } `,
  imports: []
})
export class CapabilityDisabledComponent {
  _capabilityName!: string;

  constructor(private capabilities: CapabilitiesService) {}
  get isDisabled(): boolean {
    return !this.capabilities.getCapabilityEnabled(this._capabilityName);
  }

  @Input('capability-disabled') set capabilityName(name: string) {
    this._capabilityName = name;
  }
}

export const CppCapabilityComponents = [
  CapabilityDisabledComponent,
  CapabilityEnabledComponent
] as const;
